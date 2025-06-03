import React, { useState } from 'react';
import Layout from '../components/Layout';

const ReportAnalysis = () => {
  const [timeRange, setTimeRange] = useState('day'); // 默认按日显示
  const [policeStation, setPoliceStation] = useState('all');
  const [category, setCategory] = useState('all');
  const N = 3; // 连续 N 天的阈值

  // 示例数据
  const reportData = [
    { time: '2025-05-01', station: '东派出所', category: '盗窃类', count: 123 },
    { time: '2025-05-01', station: '西派出所', category: '交通类', count: 456 },
    { time: '2025-05-02', station: '东派出所', category: '盗窃类', count: 789 },
    { time: '2025-05-02', station: '西派出所', category: '交通类', count: 101 },
    { time: '2025-05-03', station: '东派出所', category: '盗窃类', count: 150 },
    { time: '2025-05-03', station: '西派出所', category: '交通类', count: 200 },
    { time: '2025-05-04', station: '东派出所', category: '盗窃类', count: 180 },
    { time: '2025-05-04', station: '西派出所', category: '交通类', count: 220 },
    { time: '2025-05-05', station: '东派出所', category: '盗窃类', count: 130 },
    { time: '2025-05-05', station: '西派出所', category: '交通类', count: 190 },
    { time: '2024-05-01', station: '东派出所', category: '盗窃类', count: 100 }, // Add data for YoY comparison
    { time: '2024-05-01', station: '西派出所', category: '交通类', count: 400 },
  ];

  // Function to get week number
  const getWeekNumber = (dateString) => {
    const date = new Date(dateString);
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  // 过滤数据
  const filteredData = reportData.filter(item => {
    // 如果时间范围是 'day'，直接显示所有数据（按日显示）
    if (timeRange === 'day') {
      return true;
    }
    // 如果时间范围是 'all'，显示所有数据
    if (timeRange === 'all') {
      return true;
    }
    // 如果时间范围是具体的时间段，进行匹配
    if (timeRange !== 'all' && item.time !== timeRange) {
      return false;
    }
    // 按派出所过滤
    if (policeStation !== 'all' && item.station !== policeStation) {
      return false;
    }
    // 按警情类别过滤
    if (category !== 'all' && item.category !== category) {
      return false;
    }
    return true;
  });

  // 模拟同比
  const calculateYearOverYear = () => {
    const randomValue = (Math.random() * 20 - 10).toFixed(2); // 随机生成 -10% 到 10% 的值
    return `${randomValue}%`;
  };

  // 模拟环比
  const calculateMonthOverMonth = () => {
    const randomValue = (Math.random() * 20 - 10).toFixed(2); // 随机生成 -10% 到 10% 的值
    return `${randomValue}%`;
  };

  // 计算预警
  const calculateWarning = (currentTime, currentStation, currentCategory) => {
    const currentIndex = reportData.findIndex(
      item =>
        item.time === currentTime &&
        item.station === currentStation &&
        item.category === currentCategory
    );

    if (currentIndex < N - 1) {
      return ''; // 如果数据不足 N 天，返回空
    }

    let increasingDays = 0;
    let decreasingDays = 0;

    for (let i = 1; i < N; i++) {
      const current = reportData[currentIndex - i + 1]?.count || 0;
      const previous = reportData[currentIndex - i]?.count || 0;

      if (current > previous) {
        increasingDays++;
        decreasingDays = 0; // 如果有上升，重置下降计数
      } else if (current < previous) {
        decreasingDays++;
        increasingDays = 0; // 如果有下降，重置上升计数
      } else {
        increasingDays = 0;
        decreasingDays = 0; // 如果持平，重置计数
      }

      // 如果连续上升或下降达到 N 天，提前返回
      if (increasingDays >= N - 1) {
        return <span className="text-red-500">连续上升 {increasingDays + 1} 天</span>;
      }
      if (decreasingDays >= N - 1) {
        return <span className="text-green-500">连续下降 {decreasingDays + 1} 天</span>;
      }
    }

    return ''; // 如果没有连续上升或下降，返回空
  };

  return (
    <Layout title="统计报表分析">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-bold mb-4">统计报表分析</h2>
        <p className="text-gray-600">
          该页面用于展示各类统计报表，例如警情数量统计、类型分布统计、区域分布统计等。
        </p>

        {/* 筛选选项 */}
        <div className="mb-4 flex space-x-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">时间范围:</label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="all">全部</option>
              <option value="2025-04">2025-04</option>
              <option value="2025-05">2025-05</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">派出所:</label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={policeStation}
              onChange={(e) => setPoliceStation(e.target.value)}
            >
              <option value="all">全部</option>
              <option value="东派出所">东派出所</option>
              <option value="西派出所">西派出所</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">警情类别:</label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">全部</option>
              <option value="盗窃类">盗窃类</option>
              <option value="交通类">交通类</option>
            </select>
          </div>
        </div>

        {/* 报表展示区域 */}
        <div className="mt-4">
          {/* 示例报表：警情数量统计 */}
          <div className="mb-4">
            <h3 className="font-medium mb-2">警情数量统计</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-2 py-2 text-left">时间</th>
                  <th className="px-2 py-2 text-left">派出所</th>
                  <th className="px-2 py-2 text-left">警情类别</th>
                  <th className="px-2 py-2 text-center">警情数量</th>
                  <th className="px-2 py-2 text-center">同比</th>
                  <th className="px-2 py-2 text-center">环比</th>
                  <th className="px-2 py-2 text-center">预警</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index}>
                    <td className="px-2 py-2">{item.time}</td>
                    <td className="px-2 py-2">{item.station}</td>
                    <td className="px-2 py-2">{item.category}</td>
                    <td className="px-2 py-2 text-center">{item.count}</td>
                    <td className="px-2 py-2 text-center">{calculateYearOverYear()}</td>
                    <td className="px-2 py-2 text-center">{calculateMonthOverMonth()}</td>
                    <td className="px-2 py-2 text-center">{calculateWarning(item.time, item.station, item.category)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReportAnalysis;