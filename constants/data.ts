// data/habits.ts
export interface Habit {
    id: string;
    name: string;
    days: number;
    progress: number; // 0-100
    color: string;
  }
  
  export const habits: Habit[] = [
    {
      id: '1',
      name: 'Go Gym',
      days: 7,
      progress: 70,
      color: '#00B865', // green
    },
    {
      id: '2',
      name: 'Go Gym',
      days: 7,
      progress: 70,
      color: '#00B865', // green
    },
    {
      id: '3',
      name: 'Go Gym',
      days: 7,
      progress: 50,
      color: '#0051FF', // blue
    },
    {
      id: '4',
      name: 'Go Gym',
      days: 7,
      progress: 30,
      color: '#FFB800', // yellow
    },
    {
      id: '5',
      name: 'Go Gym',
      days: 7,
      progress: 30,
      color: '#FFB800', // yellow
    },
    {
      id: '6',
      name: 'Go Gym',
      days: 7,
      progress: 30,
      color: '#FFB800', // yellow
    },
  ];
  
  export interface CalendarDay {
    day: string;
    date: number;
    isActive: boolean;
  }
  
  export const getCalendarDays = (): CalendarDay[] => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 (Sunday) to 6 (Saturday)
    const currentDate = today.getDate();

    // Calculate the date of Monday (start of week)
    const monday = new Date(today);
    monday.setDate(currentDate - ((currentDay === 0 ? 7 : currentDay) - 1));

    const days: CalendarDay[] = [];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Generate 7 days starting from Monday
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      
      days.push({
        day: dayNames[i],
        date: date.getDate(),
        isActive: date.getDate() === currentDate
      });
    }

    return days;
  };

  // Replace the hardcoded calendarDays with a function call
  export const calendarDays = getCalendarDays();