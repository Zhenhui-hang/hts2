import React, { useState } from 'react';
// 文件顶部的导入语句
import { generateProblems } from '../utils/mathGenerator';

const ProblemGenerator = () => {
  const [settings, setSettings] = useState({
    operators: ['addition'],
    count: 20,
    reversePercentage: 0
  });

  const [problems, setProblems] = useState([]);

  const handleGenerate = () => {
    if (settings.operators.length === 0) {
      alert('请至少选择一个运算符');
      return;
    }
    
    try {
      const newProblems = generateProblems(
        settings.operators,
        settings.count,
        settings.reversePercentage
      );
      setProblems(newProblems);
    } catch (error) {
      console.error('生成题目时出错：', error);
    }
  };

  const handleOperatorChange = (operator) => {
    const newOperators = settings.operators.includes(operator)
      ? settings.operators.filter(t => t !== operator)
      : [...settings.operators, operator];
    setSettings({ ...settings, operators: newOperators });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6">数学练习生成器</h2>
          
          <div className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text">运算符选择</span>
              </label>
              <div className="flex gap-4">
                <label className="label cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.operators.includes('addition')}
                    onChange={() => handleOperatorChange('addition')}
                    className="checkbox checkbox-primary"
                  />
                  <span className="label-text ml-2">+</span>
                </label>
                <label className="label cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.operators.includes('subtraction')}
                    onChange={() => handleOperatorChange('subtraction')}
                    className="checkbox checkbox-primary"
                  />
                  <span className="label-text ml-2">-</span>
                </label>
                <label className="label cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.operators.includes('multiplication')}
                    onChange={() => handleOperatorChange('multiplication')}
                    className="checkbox checkbox-primary"
                  />
                  <span className="label-text ml-2">×</span>
                </label>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">反向计算题目比例</span>
                <span className="label-text-alt">{settings.reversePercentage}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.reversePercentage}
                onChange={(e) => setSettings({ ...settings, reversePercentage: Number(e.target.value) })}
                className="range range-primary"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">题目数量</span>
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={settings.count}
                onChange={(e) => setSettings({ ...settings, count: Number(e.target.value) })}
                className="input input-bordered w-full"
              />
            </div>

            <button
              onClick={handleGenerate}
              className="btn btn-primary w-full"
            >
              生成题目
            </button>
          </div>

          {problems.length > 0 && (
            <div className="mt-8">
              <div className="grid grid-cols-4 gap-4">
                {[0, 1, 2, 3].map((columnIndex) => (
                  <div key={columnIndex} className="space-y-4 p-4 border rounded-lg bg-base-200">
                    <div className="text-center font-bold text-sm text-gray-500">第 {columnIndex + 1} 列</div>
                    {problems
                      .slice(columnIndex * Math.ceil(problems.length / 4), (columnIndex + 1) * Math.ceil(problems.length / 4))
                      .map((problem, index) => (
                        <div key={index} className="card bg-base-100 p-3">
                          <div className="text-lg font-mono text-center">{problem.question}</div>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 导出 ProblemGenerator 组件作为默认导出
// 这行代码使得其他文件可以通过 import ProblemGenerator from './ProblemGenerator' 来导入这个组件
export default ProblemGenerator; 