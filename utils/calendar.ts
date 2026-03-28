export const getMonthDates = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const dates: (Date | null)[] = [];

  // Add empty cells for days before the month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    dates.push(null);
  }

  // Add all days in the month
  for (let day = 1; day <= daysInMonth; day++) {
    dates.push(new Date(year, month, day));
  }

  return dates;
};

export const getDatesWithLogs = (foodLogs: any[]) => {
  const datesSet = new Set<string>();
  
  foodLogs.forEach(log => {
    const date = new Date(log.logged_at);
    const dateString = date.toISOString().split('T')[0];
    datesSet.add(dateString);
  });

  return datesSet;
};

export const formatMonthYear = (year: number, month: number) => {
  const date = new Date(year, month, 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

export const isSameDate = (date1: Date, date2: Date) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const isToday = (date: Date) => {
  return isSameDate(date, new Date());
};

export const getDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
