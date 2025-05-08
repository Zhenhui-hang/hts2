import React, { useState } from 'react';
// 文件顶部的导入语句
import { generateProblems, generateVerticalProblem } from '../utils/mathGenerator';
import { FaPrint, FaCog } from 'react-icons/fa';
import Toast from './Toast';
import { Popover } from '@headlessui/react';

const ProblemGenerator = () => {
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState({
    operators: ['addition'],
    count: 20,
    reversePercentage: 0,
    problemType: 1, // 1: 双操作数, 2: 三操作数, 3: 竖式计算
    hasRemainder: false,
    ranges: {
      a: { min: 0, max: 20, type: 'normal' },
      b: { min: 0, max: 20, type: 'normal' },
      c: { min: 0, max: 20, type: 'normal' },
      result: { min: 0, max: 20 }
    }
  });

  const [problems, setProblems] = useState([]);

  const handleGenerate = () => {
    if (settings.operators.length === 0) {
      alert('请至少选择一个运算符');
      return;
    }
    
    try {
      let newProblems = [];
      if (settings.problemType === 3) { // 竖式计算
        for (let i = 0; i < settings.count; i++) {
          const operator = settings.operators[Math.floor(Math.random() * settings.operators.length)];
          const problem = generateVerticalProblem(operator, settings.ranges, settings.hasRemainder);
          newProblems.push(problem);
        }
      } else { // 双操作数或三操作数
        newProblems = generateProblems(
          settings.operators,
          settings.count,
          settings.reversePercentage,
          settings.problemType,
          settings.ranges,
          settings.hasRemainder
        );
      }
      setProblems(newProblems);
    } catch (error) {
      setError(error.message || '生成题目时出错');
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
      <Toast
        message={error}
        isVisible={!!error}
        onClose={() => setError(null)}
      />
      <div className="container mx-auto p-4">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-4">
                <h2 className="card-title text-2xl">数学练习</h2>
                <button
                  onClick={() => window.print()}
                  className="btn btn-ghost print-hide"
                  title="打印预览"
                >
                  <FaPrint className="text-xl" />
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-500 mb-6">{new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'numeric', day: 'numeric' })}</div>
            
            <div className="space-y-6 print-hide">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">题型选择</span>
                </label>
                <select
                  value={settings.problemType}
                  onChange={(e) => setSettings({ ...settings, problemType: Number(e.target.value) })}
                  className="select select-bordered w-full"
                >
                  <option value={1}>双操作数 (A o B = R)</option>
                  <option value={2}>三操作数 (A o B o C = R)</option>
                  <option value={3}>竖式计算</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">运算符选择</span>
                </label>
                <div className="flex justify-between items-center">
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
                    <label className="label cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.operators.includes('division')}
                        onChange={() => handleOperatorChange('division')}
                        className="checkbox checkbox-primary"
                      />
                      <span className="label-text ml-2">÷</span>
                    </label>
                  </div>
                  {settings.operators.includes('division') && (
                    <label className="label cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.hasRemainder}
                        onChange={(e) => setSettings({ ...settings, hasRemainder: e.target.checked })}
                        className="checkbox checkbox-primary"
                      />
                      <span className="label-text ml-2">有余数</span>
                    </label>
                  )}
                </div>
              </div>

              {settings.problemType !== 3 && (
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
              )}



              <div className="form-control">
                <label className="label">
                  <span className="label-text">范围设置</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label flex justify-between items-center">
                      <span className="label-text">A的范围</span>
                      <Popover className="relative">
                        <Popover.Button className="btn btn-ghost btn-xs">
                          <FaCog className={settings.ranges.a.type !== 'normal' ? 'text-primary' : ''} />
                        </Popover.Button>
                        <Popover.Panel className="absolute z-10 right-0 mt-2 w-48 bg-base-100 shadow-xl rounded-lg p-2">
                          <div className="space-y-2">
                            <label className="label cursor-pointer justify-start gap-2">
                              <input
                                type="radio"
                                className="radio radio-primary"
                                checked={settings.ranges.a.type === 'normal'}
                                onChange={() => setSettings(prev => ({
                                  ...prev,
                                  ranges: {
                                    ...prev.ranges,
                                    a: { ...prev.ranges.a, type: 'normal' }
                                  }
                                }))}
                              />
                              <span className="label-text">无限制</span>
                            </label>
                            <label className="label cursor-pointer justify-start gap-2">
                              <input
                                type="radio"
                                className="radio radio-primary"
                                checked={settings.ranges.a.type === 'tens'}
                                onChange={() => setSettings(prev => ({
                                  ...prev,
                                  ranges: {
                                    ...prev.ranges,
                                    a: { ...prev.ranges.a, type: 'tens' }
                                  }
                                }))}
                              />
                              <span className="label-text">整十</span>
                            </label>
                            <label className="label cursor-pointer justify-start gap-2">
                              <input
                                type="radio"
                                className="radio radio-primary"
                                checked={settings.ranges.a.type === 'decimal'}
                                onChange={() => setSettings(prev => ({
                                  ...prev,
                                  ranges: {
                                    ...prev.ranges,
                                    a: { ...prev.ranges.a, type: 'decimal' }
                                  }
                                }))}
                              />
                              <span className="label-text">一位小数</span>
                            </label>
                          </div>
                        </Popover.Panel>
                      </Popover>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="最小值"
                        value={settings.ranges.a.min}
                        onChange={(e) => setSettings({
                          ...settings,
                          ranges: {
                            ...settings.ranges,
                            a: { ...settings.ranges.a, min: Number(e.target.value) }
                          }
                        })}
                        className="input input-bordered w-full"
                      />
                      <input
                        type="number"
                        placeholder="最大值"
                        value={settings.ranges.a.max}
                        onChange={(e) => setSettings({
                          ...settings,
                          ranges: {
                            ...settings.ranges,
                            a: { ...settings.ranges.a, max: Number(e.target.value) }
                          }
                        })}
                        className="input input-bordered w-full"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label flex justify-between items-center">
                      <span className="label-text">B的范围</span>
                      <Popover className="relative">
                        <Popover.Button className="btn btn-ghost btn-xs">
                          <FaCog className={settings.ranges.b.type !== 'normal' ? 'text-primary' : ''} />
                        </Popover.Button>
                        <Popover.Panel className="absolute z-10 right-0 mt-2 w-48 bg-base-100 shadow-xl rounded-lg p-2">
                          <div className="space-y-2">
                            <label className="label cursor-pointer justify-start gap-2">
                              <input
                                type="radio"
                                className="radio radio-primary"
                                checked={settings.ranges.b.type === 'normal'}
                                onChange={() => setSettings(prev => ({
                                  ...prev,
                                  ranges: {
                                    ...prev.ranges,
                                    b: { ...prev.ranges.b, type: 'normal' }
                                  }
                                }))}
                              />
                              <span className="label-text">无限制</span>
                            </label>
                            <label className="label cursor-pointer justify-start gap-2">
                              <input
                                type="radio"
                                className="radio radio-primary"
                                checked={settings.ranges.b.type === 'tens'}
                                onChange={() => setSettings(prev => ({
                                  ...prev,
                                  ranges: {
                                    ...prev.ranges,
                                    b: { ...prev.ranges.b, type: 'tens' }
                                  }
                                }))}
                              />
                              <span className="label-text">整十</span>
                            </label>
                            <label className="label cursor-pointer justify-start gap-2">
                              <input
                                type="radio"
                                className="radio radio-primary"
                                checked={settings.ranges.b.type === 'decimal'}
                                onChange={() => setSettings(prev => ({
                                  ...prev,
                                  ranges: {
                                    ...prev.ranges,
                                    b: { ...prev.ranges.b, type: 'decimal' }
                                  }
                                }))}
                              />
                              <span className="label-text">一位小数</span>
                            </label>
                          </div>
                        </Popover.Panel>
                      </Popover>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="最小值"
                        value={settings.ranges.b.min}
                        onChange={(e) => setSettings({
                          ...settings,
                          ranges: {
                            ...settings.ranges,
                            b: { ...settings.ranges.b, min: Number(e.target.value) }
                          }
                        })}
                        className="input input-bordered w-full"
                      />
                      <input
                        type="number"
                        placeholder="最大值"
                        value={settings.ranges.b.max}
                        onChange={(e) => setSettings({
                          ...settings,
                          ranges: {
                            ...settings.ranges,
                            b: { ...settings.ranges.b, max: Number(e.target.value) }
                          }
                        })}
                        className="input input-bordered w-full"
                      />
                    </div>
                  </div>
                  {settings.problemType === 2 && (
                    <div>
                      <label className="label flex justify-between items-center">
                        <span className="label-text">C的范围</span>
                        <Popover className="relative">
                          <Popover.Button className="btn btn-ghost btn-xs">
                            <FaCog className={settings.ranges.c.type !== 'normal' ? 'text-primary' : ''} />
                          </Popover.Button>
                          <Popover.Panel className="absolute z-10 right-0 mt-2 w-48 bg-base-100 shadow-xl rounded-lg p-2">
                            <div className="space-y-2">
                              <label className="label cursor-pointer justify-start gap-2">
                                <input
                                  type="radio"
                                  className="radio radio-primary"
                                  checked={settings.ranges.c.type === 'normal'}
                                  onChange={() => setSettings(prev => ({
                                    ...prev,
                                    ranges: {
                                      ...prev.ranges,
                                      c: { ...prev.ranges.c, type: 'normal' }
                                    }
                                  }))}
                                />
                                <span className="label-text">无限制</span>
                              </label>
                              <label className="label cursor-pointer justify-start gap-2">
                                <input
                                  type="radio"
                                  className="radio radio-primary"
                                  checked={settings.ranges.c.type === 'tens'}
                                  onChange={() => setSettings(prev => ({
                                    ...prev,
                                    ranges: {
                                      ...prev.ranges,
                                      c: { ...prev.ranges.c, type: 'tens' }
                                    }
                                  }))}
                                />
                                <span className="label-text">整十</span>
                              </label>
                              <label className="label cursor-pointer justify-start gap-2">
                                <input
                                  type="radio"
                                  className="radio radio-primary"
                                  checked={settings.ranges.c.type === 'decimal'}
                                  onChange={() => setSettings(prev => ({
                                    ...prev,
                                    ranges: {
                                      ...prev.ranges,
                                      c: { ...prev.ranges.c, type: 'decimal' }
                                    }
                                  }))}
                                />
                                <span className="label-text">一位小数</span>
                              </label>
                            </div>
                          </Popover.Panel>
                        </Popover>
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="最小值"
                          value={settings.ranges.c.min}
                          onChange={(e) => setSettings({
                            ...settings,
                            ranges: {
                              ...settings.ranges,
                              c: { ...settings.ranges.c, min: Number(e.target.value) }
                            }
                          })}
                          className="input input-bordered w-full"
                        />
                        <input
                          type="number"
                          placeholder="最大值"
                          value={settings.ranges.c.max}
                          onChange={(e) => setSettings({
                            ...settings,
                            ranges: {
                              ...settings.ranges,
                              c: { ...settings.ranges.c, max: Number(e.target.value) }
                            }
                          })}
                          className="input input-bordered w-full"
                        />
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="label">
                      <span className="label-text">结果范围</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="最小值"
                        value={settings.ranges.result.min}
                        onChange={(e) => setSettings({
                          ...settings,
                          ranges: {
                            ...settings.ranges,
                            result: { ...settings.ranges.result, min: Number(e.target.value) }
                          }
                        })}
                        className="input input-bordered w-full"
                      />
                      <input
                        type="number"
                        placeholder="最大值"
                        value={settings.ranges.result.max}
                        onChange={(e) => setSettings({
                          ...settings,
                          ranges: {
                            ...settings.ranges,
                            result: { ...settings.ranges.result, max: Number(e.target.value) }
                          }
                        })}
                        className="input input-bordered w-full"
                      />
                    </div>
                  </div>
                </div>
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
                <div className="grid grid-cols-4 gap-4 problem-grid">
                  {[0, 1, 2, 3].map((columnIndex) => (
                    <div key={columnIndex} className="space-y-4 p-4 border rounded-lg bg-base-200">
                      <div className="text-center font-bold text-sm text-gray-500">第 {columnIndex + 1} 列</div>
                      {problems
                        .slice(columnIndex * Math.ceil(problems.length / 4), (columnIndex + 1) * Math.ceil(problems.length / 4))
                        .map((problem, index) => (
                          <div key={index} className={`card bg-base-100 p-3 ${problem.type === 'vertical' ? 'mb-12' : ''}`}>
                            <div className="font-mono text-center text-lg">{problem.question}</div>
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
    </div>
  );
};



export default ProblemGenerator;