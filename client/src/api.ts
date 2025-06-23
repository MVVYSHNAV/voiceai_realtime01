const API_BASE_URL = 'http://localhost:3000';

export interface EphemeralToken {
  client_secret: {
    value: string;
  };
}

export async function getEphemeralToken(): Promise<EphemeralToken> {
  const response = await fetch(`${API_BASE_URL}/session`);
  if (!response.ok) {
    throw new Error('Failed to get ephemeral token');
  }
  return response.json();
} 