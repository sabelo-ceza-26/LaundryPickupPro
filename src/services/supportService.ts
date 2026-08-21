export type SupportMessageStatus = 'Open' | 'Resolved';

export type SupportMessage = {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  message: string;
  createdAt: string;
  status: SupportMessageStatus;
};

export type SupportMessageInput = Omit<SupportMessage, 'id' | 'createdAt' | 'status'>;

type SupportStore = {
  messages: SupportMessage[];
};

const store: SupportStore = {
  messages: [],
};

const NETWORK_DELAY_MS = 250;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchSupportMessages(): Promise<SupportMessage[]> {
  await delay(NETWORK_DELAY_MS);
  return [...store.messages];
}

export async function createSupportMessage(
  input: SupportMessageInput
): Promise<SupportMessage> {
  if (!input.customerId.trim()) {
    throw new Error('Support messages can only be sent by registered customers.');
  }
  await delay(NETWORK_DELAY_MS);
  const record: SupportMessage = {
    ...input,
    id: `s${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'Open',
  };
  store.messages = [record, ...store.messages];
  return record;
}

export async function updateSupportMessageStatus(
  id: string,
  status: SupportMessageStatus
): Promise<SupportMessage | null> {
  await delay(NETWORK_DELAY_MS);
  let updated: SupportMessage | null = null;
  store.messages = store.messages.map((message) => {
    if (message.id !== id) return message;
    updated = { ...message, status };
    return updated;
  });
  return updated;
}

export async function deleteSupportMessage(id: string): Promise<boolean> {
  await delay(NETWORK_DELAY_MS);
  const before = store.messages.length;
  store.messages = store.messages.filter((message) => message.id !== id);
  return store.messages.length < before;
}
