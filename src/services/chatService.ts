export type ChatRole = 'customer' | 'driver';

export type ChatMessage = {
  id: string;
  orderId: string;
  text: string;
  senderRole: ChatRole;
  senderName: string;
  timestamp: number;
};

export type NewChatMessage = Omit<ChatMessage, 'id' | 'timestamp'>;

export async function fetchChatMessages(
  _orderId: string
): Promise<ChatMessage[]> {
  return [];
}

export async function createChatMessage(
  input: NewChatMessage
): Promise<ChatMessage> {
  return {
    ...input,
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
  };
}

export function subscribeToOrderMessages(
  _orderId: string,
  _onNewMessage: (message: ChatMessage) => void
): () => void {
  return () => undefined;
}
