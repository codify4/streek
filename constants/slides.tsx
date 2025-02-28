// Define all shared types in a central location
export type SlideType = "text" | "choice" | "date" | "number" | "measurement" | "loading" | "age";

export interface OnboardingData {
  name: string;
  birthDate: string;
  measurements: string;
  goal: string;
  min: string;
  max: string;
  frequency: string;
  experience: string;
  gender: string;
  loading: string;
  age: string;
}

export interface Slide {
  type: SlideType;
  title: string;
  field: keyof OnboardingData;
  placeholder?: string;
  choices?: string[];
  min?: number;
  max?: number;
  validation: (value: string) => boolean;
}

export const slides: Slide[] = [
  {
    type: 'text',
    title: "What would you like to be called?",
    field: 'name',
    placeholder: "Enter your name",
    validation: (value: string) => value.length > 0
  },
  {
    type: 'age',
    title: "How old are you?",
    field: 'age',
    placeholder: "Enter your age", 
    validation: (value: string) => value.length > 0
  },
  {
    type: 'choice',
    title: "Do you have a hard time committing to something?",
    field: 'experience',
    choices: [
      "Yes",
      "No",
      "Sometimes"
    ],
    validation: (value: string) => value.length > 0
  },
  {
    type: 'choice',
    title: "What's your main goal?",
    field: 'goal',
    choices: [
      "Build good habits",
      "Break bad habits", 
      "Stay consistent",
      "Improve productivity"
    ],
    validation: (value: string) => value.length > 0
  },
  {
    type: 'choice',
    title: "What type of habits do you want to focus on?",
    field: 'goal',
    choices: [
      "Health & Fitness",
      "Productivity",
      "Mindfulness",
      "Learning",
      "Everything"
    ],
    validation: (value: string) => value.length > 0
  },
  {
    type: 'choice',
    title: "How many habits do you want to track?",
    field: 'frequency',
    choices: [
      "1-3",
      "3-5",
      "5+"
    ],
    validation: (value: string) => value.length > 0
  }
];