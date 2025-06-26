import { getEphemeralToken } from './api';
import { getAllToolDefinitions, getToolHandler, isToolRegistered, toolRegistry } from './tools/registry';
import { FunctionCallData } from './tools/types';

export interface WebRTCClientOptions {
  logSystemEvents?: boolean;
}

export class WebRTCClient {
  private pc: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private micStream: MediaStream | null = null;
  private logSystemEvents: boolean = false;

  constructor(options: WebRTCClientOptions = {}) {
    this.logSystemEvents = options.logSystemEvents ?? false;
    this.audioElement = document.createElement('audio');
    this.audioElement.autoplay = true;
  }

  public setLogSystemEvents(enabled: boolean): void {
    this.logSystemEvents = enabled;
  }

  private systemLog(message: string, ...args: any[]): void {
    if (this.logSystemEvents) {
      console.log(message, ...args);
    }
  }

  async initWebRTC(): Promise<void> {
    try {
      const tokenData = await getEphemeralToken();
      const EPHEMERAL_KEY = tokenData.client_secret.value;

      this.pc = new RTCPeerConnection();

      this.dataChannel = this.pc.createDataChannel('oai-events');
      this.setupDataChannel();

      this.pc.ontrack = this.handleRemoteAudio.bind(this);

      await this.startMicStream();

      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(offer);

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
        type: 'answer' as RTCSdpType,
        sdp: await sdpResponse.text(),
      };

      await this.pc.setRemoteDescription(answer);
      this.systemLog('WebRTC connection established');
    } catch (error) {
      console.error('Error initializing WebRTC:', error);
      throw error;
    }
  }

  public sendTextMessage(text: string, role: 'user' | 'assistant' = 'user'): void {
    if (!text.trim()) return;

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

    this.systemLog(`Sending ${role} message:`, JSON.stringify(conversationEvent, null, 2));
    this.sendClientEvent(conversationEvent);

    if (role === 'user') {
      const responseEvent = {
        type: 'response.create'
      };

      this.sendClientEvent(responseEvent);
      this.systemLog(`${role.charAt(0).toUpperCase() + role.slice(1)} message sent, response requested:`, text);
    } else {
      this.systemLog(`${role.charAt(0).toUpperCase() + role.slice(1)} message sent (no response requested):`, text);
    }
  }

  public sendOutOfBandRequest(prompt: string, metadata: any = {}): void {
    const event = {
      type: 'response.create',
      response: {
        conversation: 'none',
        metadata: metadata,
        modalities: ['text'],
        instructions: prompt,
      },
    };

    this.sendClientEvent(event);
    this.systemLog('Out-of-band request sent:', prompt);
  }

  public sendCustomContextRequest(userText: string, metadata: any = {}): void {
    const event = {
      type: 'response.create',
      response: {
        conversation: 'none',
        metadata: metadata,
        modalities: ['text'],
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
    this.systemLog('Custom context request sent:', userText);
  }

  public triggerResponse(): void {
    const responseEvent = {
      type: 'response.create'
    };

    this.sendClientEvent(responseEvent);
    this.systemLog('Manual response triggered');
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
    this.systemLog('Tools configured:', getAllToolDefinitions().map(tool => tool.name));
  }

  private async handleFunctionCall(functionCall: FunctionCallData): Promise<void> {
    this.systemLog('Function call received:', functionCall);

    console.log('=== TOOL CALL DEBUG ===');
    console.log('Requested tool name:', functionCall.name);
    console.log('Available tools:', Object.keys(toolRegistry));
    console.log('Is tool registered:', isToolRegistered(functionCall.name));

    if (!isToolRegistered(functionCall.name)) {
      console.error(`Unknown tool: ${functionCall.name}`);
      console.error('Available tools:', Object.keys(toolRegistry));
      return;
    }

    try {
      const handler = getToolHandler(functionCall.name);
      if (!handler) {
        console.error(`No handler found for tool: ${functionCall.name}`);
        return;
      }

      let args = {};
      if (functionCall.arguments) {
        try {
          args = JSON.parse(functionCall.arguments);
        } catch (error) {
          console.error('Failed to parse function arguments:', error);
          args = {};
        }
      }

      const result = await handler.execute(args);

      const resultEvent = {
        type: 'conversation.item.create',
        item: {
          type: 'function_call_output',
          call_id: functionCall.call_id,
          output: JSON.stringify(result)
        }
      };

      this.sendClientEvent(resultEvent);

      const responseEvent = {
        type: 'response.create'
      };

      this.sendClientEvent(responseEvent);

      if (this.onToolResult) {
        this.onToolResult(functionCall.name, result);
      }

      this.systemLog(`Tool ${functionCall.name} executed successfully`);
    } catch (error) {
      console.error(`Error executing tool ${functionCall.name}:`, error);

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

  // ✅ Updated method with echo cancellation and noise suppression
  private async startMicStream(): Promise<void> {
    try {
      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
          sampleRate: 44100
        }
      });

      if (this.pc && this.micStream) {
        this.micStream.getTracks().forEach(track => {
          this.pc!.addTrack(track, this.micStream!);
        });
      }

      this.systemLog('Microphone stream started with noise suppression, echo cancellation, and gain control.');
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
      this.systemLog('Data channel opened');
      this.configureTools();
    };

    this.dataChannel.onmessage = (event) => {
      const serverEvent = JSON.parse(event.data);
      this.systemLog('Received server event:', serverEvent);

      switch (serverEvent.type) {
        case 'session.created':
          this.systemLog('Session created');
          break;
        case 'session.updated':
          this.systemLog('Session updated with tools');
          break;
        case 'input_audio_buffer.speech_started':
          this.systemLog('Speech started');
          break;
        case 'input_audio_buffer.speech_stopped':
          this.systemLog('Speech stopped');
          break;
        case 'response.done':
          this.systemLog('Response completed:', serverEvent.response);

          if (serverEvent.response.metadata) {
            this.systemLog('Out-of-band response received:', serverEvent.response.metadata);
            if (serverEvent.response.metadata.topic === 'classification') {
              this.systemLog('Classification result:', serverEvent.response.output[0]);
            }
          }

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
      this.systemLog('Data channel closed');
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

  public onToolResult?: (toolName: string, result: any) => void;
}
