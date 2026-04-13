export type Question = {
  id: number;
  question: string;
  choices: Record<string, string>;
  answer: string;
};

export const questions: Question[] = [
  {
    id: 1,
    question: "What is the capital of France?",
    choices: {
      A: "Paris",
      B: "London",
      C: "Berlin",
      D: "Madrid",
    },
    answer: "A",
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    choices: {
      A: "Earth",
      B: "Saturn",
      C: "Mars",
      D: "Jupiter",
    },
    answer: "C",
  },
  {
    id: 3,
    question: "What color do you get when you mix red and blue?",
    choices: {
      A: "Green",
      B: "Purple",
      C: "Yellow",
      D: "Orange",
    },
    answer: "B",
  },
];
