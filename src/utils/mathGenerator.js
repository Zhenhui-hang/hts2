// 生成指定范围内的随机数
const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// 生成加法题（包含反向计算）
export const generateAddition = (isReverse = false) => {
  const num1 = getRandomNumber(1, 100);
  const num2 = getRandomNumber(1, 100);
  const result = num1 + num2;

  if (isReverse) {
    const hidePosition = Math.random() < 0.5 ? 1 : 2;
    return {
      question: hidePosition === 1 ? `__ + ${num2} = ${result}` : `${num1} + __ = ${result}`,
      answer: hidePosition === 1 ? num1 : num2,
      type: 'addition'
    };
  }

  return {
    question: `${num1} + ${num2} = __`,
    answer: result,
    type: 'addition'
  };
};

// 生成减法题（包含反向计算）
export const generateSubtraction = (isReverse = false) => {
  const num1 = getRandomNumber(1, 100);
  const num2 = getRandomNumber(1, num1);
  const result = num1 - num2;

  if (isReverse) {
    const hidePosition = Math.random() < 0.5 ? 1 : 2;
    return {
      question: hidePosition === 1 ? `__ - ${num2} = ${result}` : `${num1} - __ = ${result}`,
      answer: hidePosition === 1 ? num1 : num2,
      type: 'subtraction'
    };
  }

  return {
    question: `${num1} - ${num2} = __`,
    answer: result,
    type: 'subtraction'
  };
};

// 生成乘法题（包含反向计算）
export const generateMultiplication = (isReverse = false) => {
  const num1 = getRandomNumber(1, 12);
  const num2 = getRandomNumber(1, 12);
  const result = num1 * num2;

  if (isReverse) {
    const hidePosition = Math.random() < 0.5 ? 1 : 2;
    return {
      question: hidePosition === 1 ? `__ × ${num2} = ${result}` : `${num1} × __ = ${result}`,
      answer: hidePosition === 1 ? num1 : num2,
      type: 'multiplication'
    };
  }

  return {
    question: `${num1} × ${num2} = __`,
    answer: result,
    type: 'multiplication'
  };
};

// 生成一组题目
export const generateProblems = (operators, count, reversePercentage = 0) => {
  console.log('接收到的参数：', operators, count, reversePercentage); // 添加这行来调试
  const problems = [];
  const generators = {
    addition: generateAddition,
    subtraction: generateSubtraction,
    multiplication: generateMultiplication
  };

  const reverseCount = Math.floor(count * reversePercentage / 100);
  
  for (let i = 0; i < count; i++) {
    const operator = operators[Math.floor(Math.random() * operators.length)];
    const isReverse = i < reverseCount;
    
    if (generators[operator]) {
      problems.push(generators[operator](isReverse));
    }
  }

  return problems;
};