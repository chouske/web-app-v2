export function isoToStandard(value: string): string {
  try {
    const date = new Date(value);
    const dateTimeFormat = new Intl.DateTimeFormat('en', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    return dateTimeFormat.format(date);
  } catch (error) {
    console.error('isoToStandard: ', error);
    return '[ERROR]';
  }
}

export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const monthShortNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function getMonthName(value: string): string {
  const date = new Date(value);
  return monthNames[date.getMonth() + 1];
}

export const formatDate = (date: string | Date, options?: Intl.DateTimeFormatOptions) => {
  const currentDate = new Date(date);
  const currentOptions =
    options && Object?.keys(options)?.length
      ? options
      : ({ year: 'numeric', month: 'short', day: '2-digit' } as Intl.DateTimeFormatOptions);
  return currentDate.toLocaleDateString('en-US', currentOptions);
};

export const getDaysInMonth = (month: number, year: number) => {
  const date = new Date(year, month + 1, 0);
  return date.getDate();
};

export const getUTCDate = (date: string) => (date.endsWith('Z') ? date : `${date}Z`);

export const getStringDate = (date: string) => {
  const dateFormat = new Date(getUTCDate(date));
  const month = monthShortNames[dateFormat.getMonth()];
  const year = dateFormat.getFullYear().toString();
  return `${month} ${year}`;
};

export const addDaysToDate = (date: string | Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const formatDateToCustomUTC = (date: string | Date) => {
  const currentDate = new Date(date);
  const options = { year: 'numeric', month: 'long', day: 'numeric' } as Intl.DateTimeFormatOptions;
  const datePart = currentDate.toLocaleDateString('en-US', options);
  const timePart = currentDate.toISOString().split('T')[1].split('.')[0].slice(0, 5);
  const formattedTime = `${timePart} UTC`;
  return `${datePart} ${formattedTime}`;
};
