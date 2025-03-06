export interface Stat {
  id: string
  title: string
  value: number
  subtitle: string
  iconName: "flame" | "refresh-cw" | "target"
}

export interface Quote {
  id: string
  text: string
  author: string
}

export const stats: Stat[] = [
  {
    id: "longest-streak",
    title: "Longest Streak",
    value: 5,
    subtitle: "Days",
    iconName: "flame",
  },
  {
    id: "current-streeks",
    title: "Current Streeks",
    value: 10,
    subtitle: "Streeks",
    iconName: "refresh-cw",
  },
  {
    id: "habits-done",
    title: "Habits Done",
    value: 20,
    subtitle: "Habits",
    iconName: "target",
  },
]

export const quotes: Quote[] = [
  {
    id: "1",
    text: "A strong body is a strong mind...",
    author: "Andrew Tate",
  },
  {
    id: "2",
    text: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    author: "Winston Churchill",
  },
  {
    id: "3",
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    id: "4",
    text: "Consistency is the key to achieving and maintaining momentum.",
    author: "Brian Tracy",
  },
  {
    id: "5",
    text: "Small daily improvements are the key to staggering long-term results.",
    author: "Unknown",
  },
]

export const treeProgress = 60 // Percentage of growth (0-100)
  
  