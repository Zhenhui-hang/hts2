// 生成指定范围内的随机数
const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// 验证范围设置是否合理
const validateRange = (operator, ranges) => {
  const { a, b, c, result } = ranges;
  
  switch(operator) {
    case 'addition':
      return (a.max + b.max) >= result.min && (a.min + b.min) <= result.max;
    case 'subtraction':
      return (a.max - b.min) >= result.min && (a.min - b.max) <= result.max;
    case 'multiplication':
      return (a.max * b.max) >= result.min && (a.min * b.min) <= result.max;
    case 'division':
      return b.min !== 0 && (a.max / b.min) >= result.min && (a.min / b.max) <= result.max;
    default:
      return false;
  }
};

// 生成符合范围的数字
const generateNumberInRange = (range, operator, otherNum = null, result = null, position = null) => {
  const { min, max } = range;
  if (!otherNum || !result) return getRandomNumber(min, max);
  
  let validNum;
  switch(operator) {
    case 'addition':
      validNum = position === 1 ? result - otherNum : result - otherNum;
      break;
    case 'subtraction':
      validNum = position === 1 ? result + otherNum : otherNum - result;
      break;
    case 'multiplication':
      validNum = position === 1 ? result / otherNum : result / otherNum;
      break;
    case 'division':
      validNum = position === 1 ? result * otherNum : result * otherNum;
      break;
    default:
      return getRandomNumber(min, max);
  }
  
  return Math.max(min, Math.min(max, validNum));
};

// 生成三操作数题目
const generateTripleOperandProblem = (operators, ranges = null, isReverse = false) => {
  const defaultRanges = {
    a: { min: 0, max: 20 },
    b: { min: 0, max: 20 },
    c: { min: 0, max: 20 },
    result: { min: 0, max: 20 }
  };
  const r = ranges || defaultRanges;

  let num1, num2, num3, intermediateResult, result;
  let operator1, operator2;
  let attempts = 0;
  const maxAttempts = 100; // 防止无限循环

  // 随机选择两个运算符
  operator1 = operators[Math.floor(Math.random() * operators.length)];
  operator2 = operators[Math.floor(Math.random() * operators.length)];

  const getOperatorSymbol = (op) => {
    switch(op) {
      case 'addition': return '+';
      case 'subtraction': return '-';
      case 'multiplication': return '×';
      case 'division': return '÷';
      default: return '+';
    }
  };

  const calculateStep = (a, b, op) => {
    switch(op) {
      case 'addition': return a + b;
      case 'subtraction': return a - b;
      case 'multiplication': return a * b;
      case 'division': 
        if (b === 0) return null;
        if (a % b !== 0) return null;
        return a / b;
      default: return null;
    }
  };

  const isMultiplicationOrDivision = (op) => {
    return op === 'multiplication' || op === 'division';
  };

  do {
    // 生成三个数，确保除法运算能整除且结果在范围内
    if (operator1 === 'division' && operator2 === 'division') {
      // 对于连续除法，从右向左生成数字
      num3 = generateNumberInRange({...r.c, min: 1, max: Math.min(r.c.max, 20)}, operator2);
      num2 = generateNumberInRange({...r.b, min: 1, max: Math.min(r.b.max, 20)}, operator1);
      // 确保最终结果在范围内
      const maxNum1 = r.result.max * num2 * num3;
      const minNum1 = r.result.min * num2 * num3;
      num1 = generateNumberInRange({...r.a, min: Math.max(r.a.min, minNum1), max: Math.min(r.a.max, maxNum1)}, operator1);
    } else if (operator1 === 'division') {
      // 先生成除数，确保不为0且在范围内
      num2 = generateNumberInRange({...r.b, min: 1, max: Math.min(r.b.max, 20)}, operator1);
      // 生成商，确保乘积不超过a的范围
      const maxQuotient = Math.floor(r.a.max / num2);
      const tempResult = generateNumberInRange({min: 1, max: Math.min(maxQuotient, r.result.max)}, operator1);
      // 计算被除数
      num1 = num2 * tempResult;
      // 生成第三个数，确保最终结果在范围内
      const maxNum3 = r.result.max - tempResult;
      const minNum3 = r.result.min - tempResult;
      num3 = generateNumberInRange({...r.c, min: Math.max(r.c.min, minNum3), max: Math.min(r.c.max, maxNum3)}, operator2);
    } else if (operator2 === 'division') {
      num3 = generateNumberInRange({...r.c, min: 1, max: Math.min(r.c.max, 20)}, operator2);
      num1 = generateNumberInRange(r.a, operator1);
      num2 = generateNumberInRange(r.b, operator1);
      // 确保前面的结果能被num3整除且在范围内
      let tempResult = calculateStep(num1, num2, operator1);
      if (tempResult !== null && (tempResult % num3 !== 0 || tempResult > r.result.max * num3)) continue;
    } else {
      num1 = generateNumberInRange(r.a, operator1);
      num2 = generateNumberInRange(r.b, operator1);
      num3 = generateNumberInRange(r.c, operator2);
    }

    // 根据运算符优先级计算结果
    if (isMultiplicationOrDivision(operator1) && !isMultiplicationOrDivision(operator2)) {
      // 先计算乘除法
      intermediateResult = calculateStep(num1, num2, operator1);
      if (intermediateResult !== null && Number.isInteger(intermediateResult)) {
        result = calculateStep(intermediateResult, num3, operator2);
      }
    } else if (!isMultiplicationOrDivision(operator1) && isMultiplicationOrDivision(operator2)) {
      // 先计算第二个乘除法
      intermediateResult = calculateStep(num2, num3, operator2);
      if (intermediateResult !== null && Number.isInteger(intermediateResult)) {
        result = calculateStep(num1, intermediateResult, operator1);
      }
    } else {
      // 从左到右计算
      intermediateResult = calculateStep(num1, num2, operator1);
      if (intermediateResult !== null && Number.isInteger(intermediateResult)) {
        result = calculateStep(intermediateResult, num3, operator2);
      }
    }

    attempts++;
  } while ((result === null || result < r.result.min || result > r.result.max || !Number.isInteger(result)) && attempts < maxAttempts);

  if (attempts >= maxAttempts) {
    throw new Error('无法生成符合条件的题目');
  }

  const op1Symbol = getOperatorSymbol(operator1);
  const op2Symbol = getOperatorSymbol(operator2);

  if (isReverse) {
    // 随机选择一个位置隐藏
    const hidePosition = Math.floor(Math.random() * 3) + 1;
    let question;
    switch(hidePosition) {
      case 1:
        question = `__ ${op1Symbol} ${num2} ${op2Symbol} ${num3} = ${result}`;
        return { question, answer: num1, type: 'mixed' };
      case 2:
        question = `${num1} ${op1Symbol} __ ${op2Symbol} ${num3} = ${result}`;
        return { question, answer: num2, type: 'mixed' };
      case 3:
        question = `${num1} ${op1Symbol} ${num2} ${op2Symbol} __ = ${result}`;
        return { question, answer: num3, type: 'mixed' };
    }
  }

  return {
    question: `${num1} ${op1Symbol} ${num2} ${op2Symbol} ${num3} = __`,
    answer: result,
    type: 'mixed'
  };

};

// 导出所有生成函数
export const generateAddition = (isReverse = false, ranges = null) => {
  const defaultRanges = {
    a: { min: 0, max: 20 },
    b: { min: 0, max: 20 },
    result: { min: 0, max: 20 }
  };
  const r = ranges || defaultRanges;

  let num1, num2, result;
  let attempts = 0;
  const maxAttempts = 100;

  do {
    num1 = generateNumberInRange(r.a, 'addition');
    // 确保num2不会导致结果超出范围
    const maxAllowedNum2 = r.result.max - num1;
    const adjustedRange = {
      min: Math.max(r.b.min, r.result.min - num1),
      max: Math.min(r.b.max, maxAllowedNum2)
    };
    num2 = generateNumberInRange(adjustedRange, 'addition');
    result = num1 + num2;
    attempts++;
  } while ((result < r.result.min || result > r.result.max) && attempts < maxAttempts);

  if (attempts >= maxAttempts) {
    throw new Error('无法生成符合条件的题目');
  }

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

export const generateSubtraction = (isReverse = false, ranges = null) => {
  const defaultRanges = {
    a: { min: 0, max: 20 },
    b: { min: 0, max: 20 },
    result: { min: 0, max: 20 }
  };
  const r = ranges || defaultRanges;

  const num1 = generateNumberInRange(r.a, 'subtraction');
  const num2 = generateNumberInRange(r.b, 'subtraction');
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

export const generateMultiplication = (isReverse = false, ranges = null) => {
  const defaultRanges = {
    a: { min: 0, max: 20 },
    b: { min: 0, max: 20 },
    result: { min: 0, max: 20 }
  };
  const r = ranges || defaultRanges;

  const num1 = generateNumberInRange(r.a, 'multiplication');
  const num2 = generateNumberInRange(r.b, 'multiplication');
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

export const generateDivision = (isReverse = false, ranges = null, hasRemainder = false) => {
  const defaultRanges = {
    a: { min: 1, max: 100 },
    b: { min: 1, max: 10 },
    result: { min: 1, max: 10 }
  };
  const r = ranges || defaultRanges;

  let num1, num2, result, remainder;
  do {
    num2 = generateNumberInRange(r.b, 'division');
    if (hasRemainder) {
      result = generateNumberInRange(r.result, 'division');
      remainder = getRandomNumber(1, num2 - 1);
      num1 = num2 * result + remainder;
    } else {
      result = generateNumberInRange(r.result, 'division');
      num1 = num2 * result;
    }
  } while (num1 > r.a.max || num1 < r.a.min || num2 === 0);

  if (isReverse) {
    const hidePosition = Math.random() < 0.5 ? 1 : 2;
    return {
      question: hidePosition === 1 ? `__ ÷ ${num2} = ${result}${hasRemainder ? `...${remainder}` : ''}` : `${num1} ÷ __ = ${result}${hasRemainder ? `...${remainder}` : ''}`,
      answer: hidePosition === 1 ? num1 : num2,
      type: 'division'
    };
  }

  return {
    question: `${num1} ÷ ${num2} = __`,
    answer: hasRemainder ? `${result}...${remainder}` : result,
    type: 'division'
  };
};

// 生成竖式计算题目
export const generateVerticalProblem = (operator, ranges = null, hasRemainder = false) => {
  const defaultRanges = {
    a: { min: 0, max: 100 },
    b: { min: 0, max: 100 },
    result: { min: 0, max: 100 }
  };
  const r = ranges || defaultRanges;

  let num1, num2, result, remainder;
  let attempts = 0;
  const maxAttempts = 100;

  do {
    switch(operator) {
      case 'addition':
        num1 = generateNumberInRange(r.a, 'addition');
        num2 = generateNumberInRange(r.b, 'addition');
        result = num1 + num2;
        break;
      case 'subtraction':
        num1 = generateNumberInRange(r.a, 'subtraction');
        num2 = generateNumberInRange({...r.b, max: num1}, 'subtraction');
        result = num1 - num2;
        break;
      case 'multiplication':
        num1 = generateNumberInRange(r.a, 'multiplication');
        num2 = generateNumberInRange(r.b, 'multiplication');
        result = num1 * num2;
        break;
      case 'division':
        if (hasRemainder) {
          num2 = generateNumberInRange({...r.b, min: 1}, 'division');
          result = generateNumberInRange(r.result, 'division');
          remainder = getRandomNumber(1, num2 - 1);
          num1 = num2 * result + remainder;
        } else {
          num2 = generateNumberInRange({...r.b, min: 1}, 'division');
          result = generateNumberInRange(r.result, 'division');
          num1 = num2 * result;
        }
        break;
      default:
        throw new Error('不支持的运算符：' + operator);
    }
    attempts++;
  } while ((result < r.result.min || result > r.result.max || !Number.isInteger(result)) && attempts < maxAttempts);

  if (attempts >= maxAttempts) {
    throw new Error('无法生成符合条件的题目');
  }

  const getOperatorSymbol = (op) => {
    switch(op) {
      case 'addition': return '+';
      case 'subtraction': return '-';
      case 'multiplication': return '×';
      case 'division': return '÷';
      default: return '+';
    }
  };

  return {
    question: `${num1} ${getOperatorSymbol(operator)} ${num2} = __`,
    answer: operator === 'division' && hasRemainder ? `${result}...${remainder}` : result,
    type: 'vertical'
  };
};

export const generateProblems = (operators, count, reversePercentage, problemType, ranges = null, hasRemainder = false) => {
  if (!operators || operators.length === 0) {
    throw new Error('至少需要选择一个运算符');
  }

  const problems = [];
  const reverseCount = Math.floor(count * (reversePercentage / 100));
  const normalCount = count - reverseCount;

  // 生成正常题目
  for (let i = 0; i < normalCount; i++) {
    let problem;

    if (problemType === 2) {
      problem = generateTripleOperandProblem(operators, ranges, false);
    } else {
      const operator = operators[Math.floor(Math.random() * operators.length)];
      switch (operator) {
        case 'addition':
          problem = generateAddition(false, ranges);
          break;
        case 'subtraction':
          problem = generateSubtraction(false, ranges);
          break;
        case 'multiplication':
          problem = generateMultiplication(false, ranges);
          break;
        case 'division':
          problem = generateDivision(false, ranges, hasRemainder);
          break;
        default:
          throw new Error('不支持的运算符：' + operator);
      }
    }
    problems.push(problem);
  }

  // 生成逆向题目
  for (let i = 0; i < reverseCount; i++) {
    let problem;

    if (problemType === 2) {
      problem = generateTripleOperandProblem(operators, ranges, true);
    } else {
      const operator = operators[Math.floor(Math.random() * operators.length)];
      switch (operator) {
        case 'addition':
          problem = generateAddition(true, ranges);
          break;
        case 'subtraction':
          problem = generateSubtraction(true, ranges);
          break;
        case 'multiplication':
          problem = generateMultiplication(true, ranges);
          break;
        case 'division':
          problem = generateDivision(true, ranges, hasRemainder);
          break;
        default:
          throw new Error('不支持的运算符：' + operator);
      }
    }
    problems.push(problem);
  }

  // 随机打乱题目顺序
  return problems.sort(() => Math.random() - 0.5);
};