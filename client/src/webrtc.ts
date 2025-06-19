import { getEphemeralToken } from './api';
import { getAllToolDefinitions, getToolHandler, isToolRegistered } from './tools/registry';
import { FunctionCallData } from './tools/types';

export class WebRTCClient {
  private pc: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private micStream: MediaStream | null = null;

  constructor() {
    this.audioElement = document.createElement('audio');
    this.audioElement.autoplay = true;
  }

  async initWebRTC(): Promise<void> {
    try {
      // Get ephemeral token from backend
      const tokenData = await getEphemeralToken();
      const EPHEMERAL_KEY = tokenData.client_secret.value;

      // Create peer connection
      this.pc = new RTCPeerConnection();

      // Set up data channel for events
      this.dataChannel = this.pc.createDataChannel('oai-events');
      this.setupDataChannel();

      // Set up remote audio stream handler
      this.pc.ontrack = this.handleRemoteAudio.bind(this);

      // Add local audio track
      await this.startMicStream();

      // Create and set local description
      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(offer);

      // Send offer to OpenAI and get answer
      const baseUrl = 'https://api.openai.com/v1/realtime';
      const model = 'gpt-4o-realtime-preview-2025-06-03';
      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: 'POST',
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          'Content-Type': 'application/sdp',
        },
      });

      if (!sdpResponse.ok) {
        throw new Error('Failed to get SDP answer from OpenAI');
      }

      const answer = {
        type: 'answer',
        sdp: await sdpResponse.text(),
      };

      await this.pc.setRemoteDescription(answer);
      console.log('WebRTC connection established');
    } catch (error) {
      console.error('Error initializing WebRTC:', error);
      throw error;
    }
  }

  // Public method to send text messages
  public sendTextMessage(text: string, role: 'user' | 'assistant' = 'user'): void {
    if (!text.trim()) return;

    // Create a conversation item with text input
    const conversationEvent = {
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: role,
        content: [
          {
            type: role === 'assistant' ? 'text' : 'input_text',
            text: text.trim()
          }
        ]
      }
    };

    console.log(`Sending ${role} message:`, JSON.stringify(conversationEvent, null, 2));
    this.sendClientEvent(conversationEvent);

    // Only create a response if it's a user message
    // System messages are usually just context and don't need responses
    if (role === 'user') {
      const responseEvent = {
        type: 'response.create'
      };

      this.sendClientEvent(responseEvent);
      console.log(`${role.charAt(0).toUpperCase() + role.slice(1)} message sent, response requested:`, text);
    } else {
      console.log(`${role.charAt(0).toUpperCase() + role.slice(1)} message sent (no response requested):`, text);
    }
  }

  // Public method to send out-of-band requests (like the classification example)
  public sendOutOfBandRequest(prompt: string, metadata: any = {}): void {
    const event = {
      type: 'response.create',
      response: {
        // Setting to "none" indicates the response is out of band
        // and will not be added to the default conversation
        conversation: 'none',
        
        // Set metadata to help identify responses sent back from the model
        metadata: metadata,
        
        // Set any other available response fields
        modalities: ['text'],
        instructions: prompt,
      },
    };

    this.sendClientEvent(event);
    console.log('Out-of-band request sent:', prompt);
  }

  // Public method to send custom context requests
  public sendCustomContextRequest(userText: string, metadata: any = {}): void {
    const event = {
      type: 'response.create',
      response: {
        conversation: 'none',
        metadata: metadata,
        modalities: ['text'],
        
        // Create a custom input array for this request
        input: [
          {
            type: 'message',
            role: 'user',
            content: [
              {
                type: 'input_text',
                text: userText,
              },
            ],
          },
        ],
      },
    };

    this.sendClientEvent(event);
    console.log('Custom context request sent:', userText);
  }

  // Public method to manually trigger a response (useful after system messages)
  public triggerResponse(): void {
    const responseEvent = {
      type: 'response.create'
    };

    this.sendClientEvent(responseEvent);
    console.log('Manual response triggered');
  }

  private sendClientEvent(event: any): void {
    if (this.dataChannel && this.dataChannel.readyState === 'open') {
      this.dataChannel.send(JSON.stringify(event));
    } else {
      console.error('Data channel not ready to send event:', event);
    }
  }

  private configureTools(): void {
    const sessionUpdateEvent = {
      type: 'session.update',
      session: {
        tools: getAllToolDefinitions(),
        tool_choice: 'auto'
      }
    };

    this.sendClientEvent(sessionUpdateEvent);
    console.log('Tools configured:', getAllToolDefinitions().map(tool => tool.name));
  }

  private async handleFunctionCall(functionCall: FunctionCallData): Promise<void> {
    console.log('Function call received:', functionCall);

    // Check if the tool is registered
    if (!isToolRegistered(functionCall.name)) {
      console.error(`Unknown tool: ${functionCall.name}`);
      return;
    }

    try {
      // Get the tool handler
      const handler = getToolHandler(functionCall.name);
      if (!handler) {
        console.error(`No handler found for tool: ${functionCall.name}`);
        return;
      }

      // Parse arguments if provided
      let args = {};
      if (functionCall.arguments) {
        try {
          args = JSON.parse(functionCall.arguments);
        } catch (error) {
          console.error('Failed to parse function arguments:', error);
          args = {};
        }
      }

      // Execute the tool function
      const result = await handler.execute(args);

      // Send the function result back to the model
      const resultEvent = {
        type: 'conversation.item.create',
        item: {
          type: 'function_call_output',
          call_id: functionCall.call_id,
          output: JSON.stringify(result)
        }
      };

      this.sendClientEvent(resultEvent);

      // Create a new response after sending function result
      const responseEvent = {
        type: 'response.create'
      };

      this.sendClientEvent(responseEvent);

      console.log(`Tool ${functionCall.name} executed successfully`);
    } catch (error) {
      console.error(`Error executing tool ${functionCall.name}:`, error);
      
      // Send error result back to the model
      const errorEvent = {
        type: 'conversation.item.create',
        item: {
          type: 'function_call_output',
          call_id: functionCall.call_id,
          output: JSON.stringify({ error: `Failed to execute ${functionCall.name}: ${error}` })
        }
      };

      this.sendClientEvent(errorEvent);
    }
  }

  private async startMicStream(): Promise<void> {
    try {
      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      if (this.pc && this.micStream) {
        this.micStream.getTracks().forEach(track => {
          if (this.pc && this.micStream) {
            this.pc.addTrack(track, this.micStream);
          }
        });
      }
    } catch (error) {
      console.error('Error accessing microphone:', error);
      throw error;
    }
  }

  private handleRemoteAudio(event: RTCTrackEvent): void {
    if (this.audioElement) {
      this.audioElement.srcObject = event.streams[0];
    }
  }

  private setupDataChannel(): void {
    if (!this.dataChannel) return;

    this.dataChannel.onopen = () => {
      console.log('Data channel opened');
      // Configure tools after data channel is open
      this.configureTools();
    };

    this.dataChannel.onmessage = (event) => {
      const serverEvent = JSON.parse(event.data);
      console.log('Received server event:', serverEvent);

      // Handle different event types
      switch (serverEvent.type) {
        case 'session.created':
          console.log('Session created');
          break;
        case 'session.updated':
          console.log('Session updated with tools');
          break;
        case 'input_audio_buffer.speech_started':
          console.log('Speech started');
          break;
        case 'input_audio_buffer.speech_stopped':
          console.log('Speech stopped');
          break;
        case 'response.done':
          console.log('Response completed:', serverEvent.response);
          
          // Handle out-of-band responses with metadata
          if (serverEvent.response.metadata) {
            console.log('Out-of-band response received:', serverEvent.response.metadata);
            // You can handle different types of out-of-band responses here
            if (serverEvent.response.metadata.topic === 'classification') {
              console.log('Classification result:', serverEvent.response.output[0]);
            }
          }
          
          // Check if response contains a function call
          if (serverEvent.response.output && serverEvent.response.output.length > 0) {
            const output = serverEvent.response.output[0];
            if (output.type === 'function_call') {
              this.handleFunctionCall(output);
            }
          }
          break;
        case 'error':
          console.error('Server error:', serverEvent);
          break;
      }
    };

    this.dataChannel.onclose = () => {
      console.log('Data channel closed');
    };

    this.dataChannel.onerror = (error) => {
      console.error('Data channel error:', error);
    };
  }

  cleanup(): void {
    this.micStream?.getTracks().forEach(track => track.stop());
    this.pc?.close();
    this.audioElement?.remove();
  }
} 