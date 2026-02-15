import { questionsPart1 } from './questions-part1.js';
import { questionsPart2 } from './questions-part2.js';
import { questionsPart3 } from './questions-part3.js';
import { questionsPart4 } from './questions-part4.js';
import { questionsPart5 } from './questions-part5.js';

export const questions = [
  ...questionsPart1,
  ...questionsPart2,
  ...questionsPart3,
  ...questionsPart4,
  ...questionsPart5,
];

console.log(`📚 Loaded ${questions.length} interview questions across ${new Set(questions.map(q => q.unitId)).size} units`);
