import React, { useState } from 'react';

const MathProblemGenerator = () => {
  const [problemSettings, setProblemSettings] = useState({
    grade: 1,
    type: 'addition',
    count: 20
  });

  const generateProblems = () => {
    // 根据年级和类型生成题目
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <select 
          value={problemSettings.grade}
          onChange={(e) => setProblemSettings({...problemSettings, grade: e.target.value})}
        >
          <option value={1}>一年级</option>
          <option value={2}>二年级</option>
          {/* 其他年级选项 */}
        </select>
        {/* 其他设置选项 */}
      </div>
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={generateProblems}
      >
        生成题目
      </button>
    </div>
  );
};

export default MathProblemGenerator;