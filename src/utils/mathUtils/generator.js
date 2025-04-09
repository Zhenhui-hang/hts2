export const generateAdditionProblem = (grade) => {
  const maxNum = grade === 1 ? 20 : 100;
  const num1 = Math.floor(Math.random() * maxNum);
  const num2 = Math.floor(Math.random() * (maxNum - num1));
  
  return {
    problem: `${num1} + ${num2} = `,
    answer: num1 + num2
  };
};

export const generateSubtractionProblem = (grade) => {
  const maxNum = grade === 1 ? 20 : 100;
  const num1 = Math.floor(Math.random() * maxNum);
  const num2 = Math.floor(Math.random() * num1);
  
  return {
    problem: `${num1} - ${num2} = `,
    answer: num1 - num2
  };
};