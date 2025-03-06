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
  
  export const calendarDays: CalendarDay[] = [
    { day: 'Mon', date: 3, isActive: false },
    { day: 'Tue', date: 4, isActive: false },
    { day: 'Wed', date: 5, isActive: true },
    { day: 'Thu', date: 6, isActive: false },
    { day: 'Fri', date: 7, isActive: false },
    { day: 'Sat', date: 8, isActive: false },
    { day: 'Sun', date: 9, isActive: false },
  ];