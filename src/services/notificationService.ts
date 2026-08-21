export type NotificationKind =
  | 'order_assigned'
  | 'new_message'
  | 'order_delivered';

export type NotificationAudience = 'driver' | 'customer';

export type AppNotification = {
  id: string;
  kind: NotificationKind;
  audience: NotificationAudience;
  recipientName: string;
  orderId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export type NewNotification = Omit<AppNotification, 'id' | 'read' | 'createdAt'>;

type LocalRow = AppNotification & { localId: number };

const localStore: { rows: LocalRow[]; nextId: number } = {
  rows: [],
  nextId: 1,
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function makeId(): string {
  return `ntf-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function fetchNotifications(
  audience: NotificationAudience,
  recipientName: string
): Promise<AppNotification[]> {
  await delay(200);
  return localStore.rows
    .filter(
      (row) =>
        row.audience === audience &&
        row.recipientName.toLowerCase() === recipientName.trim().toLowerCase()
    )
    .map(({ localId: _localId, ...rest }) => rest);
}

export async function createNotification(
  input: NewNotification
): Promise<AppNotification> {
  await delay(120);
  const record: LocalRow = {
    ...input,
    id: makeId(),
    read: false,
    createdAt: new Date().toISOString(),
    localId: localStore.nextId++,
  };
  localStore.rows = [record, ...localStore.rows];
  const { localId: _localId, ...rest } = record;
  return rest;
}

export async function markNotificationRead(id: string): Promise<void> {
  await delay(80);
  localStore.rows = localStore.rows.map((row) =>
    row.id === id ? { ...row, read: true } : row
  );
}

export async function markAllNotificationsRead(
  audience: NotificationAudience,
  recipientName: string
): Promise<void> {
  await delay(80);
  localStore.rows = localStore.rows.map((row) =>
    row.audience === audience &&
    row.recipientName.toLowerCase() === recipientName.trim().toLowerCase()
      ? { ...row, read: true }
      : row
  );
}
