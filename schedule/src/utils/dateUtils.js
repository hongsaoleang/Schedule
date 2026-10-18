// Date utilities for weekly scheduling

export function formatDateToISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseISODate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

// Get the Monday of the week for any given date
export function getMondayOfWeek(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay(); // 0 is Sunday, 1 is Monday...
  // Calculate distance to previous Monday
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return formatDateToISO(monday);
}

// Add weeks to a Monday date string (e.g. '2026-10-19' + 1 = '2026-10-26')
export function addWeeksToMonday(mondayStr, weekOffset) {
  const date = parseISODate(mondayStr);
  date.setDate(date.getDate() + weekOffset * 7);
  return formatDateToISO(date);
}

// Get all 7 days for a week starting on Monday
export function getDaysOfWeek(mondayStr) {
  const base = parseISODate(mondayStr);
  const todayStr = formatDateToISO(new Date());
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const shortNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return dayNames.map((name, index) => {
    const dayDate = new Date(base);
    dayDate.setDate(base.getDate() + index);
    const dateStr = formatDateToISO(dayDate);

    const monthName = dayDate.toLocaleDateString('en-US', { month: 'short' });
    const dayNumber = dayDate.getDate();

    return {
      dayIndex: index,
      dayName: name,
      shortName: shortNames[index],
      dateStr,
      displayDate: `${monthName} ${dayNumber}`,
      isToday: dateStr === todayStr,
      isWeekend: index >= 5
    };
  });
}

// Format week range e.g. "Oct 19 – Oct 25, 2026"
export function formatWeekRange(mondayStr) {
  const monday = parseISODate(mondayStr);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const startMonth = monday.toLocaleDateString('en-US', { month: 'short' });
  const endMonth = sunday.toLocaleDateString('en-US', { month: 'short' });
  const startYear = monday.getFullYear();
  const endYear = sunday.getFullYear();

  if (startYear !== endYear) {
    return `${startMonth} ${monday.getDate()}, ${startYear} – ${endMonth} ${sunday.getDate()}, ${endYear}`;
  }
  if (startMonth !== endMonth) {
    return `${startMonth} ${monday.getDate()} – ${endMonth} ${sunday.getDate()}, ${startYear}`;
  }
  return `${startMonth} ${monday.getDate()} – ${sunday.getDate()}, ${startYear}`;
}

// Return human label like "This Week", "Next Week", "In 2 Weeks", "Last Week"
export function getWeekLabel(mondayStr) {
  const currentMonday = getMondayOfWeek(new Date());
  if (mondayStr === currentMonday) return 'This Week';

  const current = parseISODate(currentMonday);
  const target = parseISODate(mondayStr);
  const diffDays = Math.round((target.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.round(diffDays / 7);

  if (diffWeeks === 1) return 'Next Week';
  if (diffWeeks === 2) return 'In 2 Weeks';
  if (diffWeeks > 2) return `+${diffWeeks} Weeks`;
  if (diffWeeks === -1) return 'Last Week';
  if (diffWeeks < -1) return `${diffWeeks} Weeks ago`;
  return '';
}

// Generate the 35 or 42 grid cells for a full Month Calendar (starting on Monday)
export function getMonthCalendarDays(year, month) {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const todayStr = formatDateToISO(new Date());

  // Determine day of week for 1st of month (0 is Sun, 1 is Mon...)
  // We want Monday = 0, ..., Sunday = 6
  let firstDayIndex = firstDayOfMonth.getDay() - 1;
  if (firstDayIndex === -1) firstDayIndex = 6;

  const days = [];

  // Previous month padding
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dayNum = prevMonthLastDay - i;
    const prevDate = new Date(year, month - 1, dayNum);
    const dateStr = formatDateToISO(prevDate);
    days.push({
      dateStr,
      dayNumber: dayNum,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      isWeekend: prevDate.getDay() === 0 || prevDate.getDay() === 6,
    });
  }

  // Current month days
  const totalDays = lastDayOfMonth.getDate();
  for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
    const currentDate = new Date(year, month, dayNum);
    const dateStr = formatDateToISO(currentDate);
    days.push({
      dateStr,
      dayNumber: dayNum,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
      isWeekend: currentDate.getDay() === 0 || currentDate.getDay() === 6,
    });
  }

  // Next month padding (complete grid to multiple of 7)
  const remainingCells = (7 - (days.length % 7)) % 7;
  for (let dayNum = 1; dayNum <= remainingCells; dayNum++) {
    const nextDate = new Date(year, month + 1, dayNum);
    const dateStr = formatDateToISO(nextDate);
    days.push({
      dateStr,
      dayNumber: dayNum,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      isWeekend: nextDate.getDay() === 0 || nextDate.getDay() === 6,
    });
  }

  return days;
}

export function formatMonthYear(year, month) {
  const date = new Date(year, month, 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}
