/**
 * Formats a date into IST (Indian Standard Time, UTC+05:30)
 * Format: dd/mm/yyyy hh:mm am/pm
 */
export function formatIST(dateInput: string | Date | number): string {
  const date = new Date(dateInput);

  const formatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return formatter.format(date);
}
