import { getOrderTotal, type AdminOrder } from '../context/AdminContext';

export type WeeklyTrendPoint = {
  day: string;
  label: string;
  value: number;
};

export type StatusShareEntry = {
  label: string;
  count: number;
  percent: number;
  tint: string;
  color: string;
};

export type ReportStats = {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  weeklyTrend: WeeklyTrendPoint[];
  statusShare: StatusShareEntry[];
  rangeStart: Date;
  rangeEnd: Date;
};

const DAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const STATUS_SHARE_META: Record<
  AdminOrder['status'],
  { tint: string; color: string }
> = {
  Pending: { tint: '#FFF0B8', color: '#E19A00' },
  'In Progress': { tint: '#E4EEFF', color: '#3278F6' },
  Completed: { tint: '#DDF8E8', color: '#00A85A' },
};

function startOfDay(date: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
}

export function getOrderTimestamp(order: AdminOrder): Date {
  if (order.placedAtISO) {
    const parsed = new Date(order.placedAtISO);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  const fallback = new Date(order.placedAt);
  return Number.isNaN(fallback.getTime()) ? new Date() : fallback;
}

export function computeReportStats(orders: AdminOrder[]): ReportStats {
  const totalRevenue = orders.reduce(
    (sum, order) => sum + getOrderTotal(order),
    0
  );
  const totalOrders = orders.length;
  const avgOrderValue =
    totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const today = startOfDay(new Date());
  const rangeStart = new Date(today);
  rangeStart.setDate(rangeStart.getDate() - 6);

  const countsByDay = new Array<number>(7).fill(0);
  for (const order of orders) {
    const placed = startOfDay(getOrderTimestamp(order));
    const diffDays = Math.round(
      (placed.getTime() - rangeStart.getTime()) / (24 * 60 * 60 * 1000)
    );
    if (diffDays >= 0 && diffDays < 7) {
      countsByDay[diffDays] += 1;
    }
  }

  const weeklyTrend: WeeklyTrendPoint[] = countsByDay.map((value, index) => {
    const date = new Date(rangeStart);
    date.setDate(date.getDate() + index);
    return {
      day: DAY_LETTERS[date.getDay()],
      label: DAY_NAMES[date.getDay()],
      value,
    };
  });

  const statusCounts: Record<AdminOrder['status'], number> = {
    Pending: 0,
    'In Progress': 0,
    Completed: 0,
  };
  for (const order of orders) {
    statusCounts[order.status] += 1;
  }

  const statusShare: StatusShareEntry[] = (
    Object.keys(statusCounts) as AdminOrder['status'][]
  ).map((status) => ({
    label: status,
    count: statusCounts[status],
    percent:
      totalOrders > 0
        ? Math.round((statusCounts[status] / totalOrders) * 100)
        : 0,
    tint: STATUS_SHARE_META[status].tint,
    color: STATUS_SHARE_META[status].color,
  }));

  return {
    totalRevenue,
    totalOrders,
    avgOrderValue,
    weeklyTrend,
    statusShare,
    rangeStart,
    rangeEnd: today,
  };
}
