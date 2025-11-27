
export const formatDate = (dateString?: string | Date): string => {
  if (!dateString) return '--';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

export const formatTime = (dateString?: string | Date): string => {
  if (!dateString) return '--';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
};

export const formatDateTime = (dateString?: string | Date): string => {
  if (!dateString) return '--';
  return `${formatDate(dateString)} • ${formatTime(dateString)}`;
};

export const classNames = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};
