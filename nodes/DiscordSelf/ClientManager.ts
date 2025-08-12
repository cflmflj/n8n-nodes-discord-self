import { Client } from 'discord.js-selfbot-v13';

type ManagedClient = {
  client: Client;
  loginPromise?: Promise<string>;
};

const tokenToClient = new Map<string, ManagedClient>();

export async function getOrCreateClient(token: string): Promise<Client> {
  let entry = tokenToClient.get(token);
  if (!entry) {
    const client = new Client();
    entry = { client };
    tokenToClient.set(token, entry);
    entry.loginPromise = client.login(token);
  }

  if (entry.loginPromise) await entry.loginPromise;
  return entry.client;
}

export function destroyClientForToken(token: string): void {
  const entry = tokenToClient.get(token);
  if (!entry) return;
  try {
    entry.client.destroy();
  } finally {
    tokenToClient.delete(token);
  }
}


