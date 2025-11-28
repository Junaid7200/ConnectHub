export function formatRelativeTime(input: string | number | Date): string {
  const date = input instanceof Date ? input : new Date(input);
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  if (Number.isNaN(diffMs)) return '';

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);

  const isSameDay = now.toDateString() === date.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = yesterday.toDateString() === date.toDateString();

  if (diffSeconds < 60 && isSameDay) return 'Just now';
  if (diffMinutes < 60 && isSameDay) return `${diffMinutes}m`;
  if (diffHours < 24 && isSameDay) return `${diffHours}h`;
  if (isYesterday) return 'Yesterday';

  return date.toLocaleDateString();
}
