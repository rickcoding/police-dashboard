import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, Filler, ArcElement } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler,
  ArcElement
);

// 添加样式支持
const styles = `
  .line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

// 插入样式到页面
if (typeof document !== 'undefined' && !document.getElementById('custom-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'custom-styles';
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

const TimeDimensionAnalysis = () => {
  // 状态管理 - 实际应用会使用更复杂的状态管理
  const [timeUnit, setTimeUnit] = useState('hour');
  const [timeRange, setTimeRange] = useState('week');
  const [compareType, setCompareType] = useState('yoy');
  const [analysisTab, setAnalysisTab] = useState('distribution');
  const [patternTab, setPatternTab] = useState('weekday');
  const [trendTab, setTrendTab] = useState('short');
  const [showWarningModal, setShowWarningModal] = useState(false);
  
  // ESC键关闭弹窗
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        setShowWarningModal(false);
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);
  
  // 阻止背景滚动
  useEffect(() => {
    if (showWarningModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showWarningModal]);
  
  // 不同时间粒度的数据生成函数
  const generateHourlyData = () => [
    5, 3, 2, 2, 3, 5, 12, 25, 32, 28, 25, 30, 
    35, 32, 28, 30, 35, 45, 50, 42, 35, 25, 15, 8
  ];
  
  const generateDailyData = () => [
    126, 134, 128, 145, 139, 163, 158, // 一周7天的数据
  ];
  
  const generateWeeklyData = () => [
    890, 945, 823, 1020, 978, 1156, 1089, 934, // 8周的数据
  ];
  
  const generateMonthlyData = () => [
    3450, 3780, 4120, 4890, 4560, 4230, 3890, 3650, 3420, 3780, 4100, 4350 // 12个月的数据
  ];
  
  // 根据时间粒度获取对应的数据和标签
  const getTimeUnitData = () => {
    switch(timeUnit) {
      case 'hour':
        return {
          data: generateHourlyData(),
          labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
          title: '24小时警情分布',
          unit: '小时',
          xAxisTitle: '时间(小时)',
          peakInfo: {
            time: '19:00',
            value: '50起',
            lowTime: '02:00-04:00'
          }
        };
      case 'day':
        return {
          data: generateDailyData(),
          labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          title: '一周每日警情分布',
          unit: '天',
          xAxisTitle: '星期',
          peakInfo: {
            time: '周六',
            value: '163起',
            lowTime: '周一'
          }
        };
      case 'week':
        return {
          data: generateWeeklyData(),
          labels: ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周', '第7周', '第8周'],
          title: '近8周警情分布',
          unit: '周',
          xAxisTitle: '周次',
          peakInfo: {
            time: '第6周',
            value: '1156起',
            lowTime: '第3周'
          }
        };
      case 'month':
        return {
          data: generateMonthlyData(),
          labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          title: '全年每月警情分布',
          unit: '月',
          xAxisTitle: '月份',
          peakInfo: {
            time: '7月',
            value: '4890起',
            lowTime: '9月'
          }
        };
      default:
        return {
          data: generateHourlyData(),
          labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
          title: '24小时警情分布',
          unit: '小时',
          xAxisTitle: '时间',
          peakInfo: {
            time: '19:00',
            value: '50起',
            lowTime: '02:00-04:00'
          }
        };
    }
  };
  
  // 获取当前时间粒度的数据
  const currentTimeData = getTimeUnitData();
  
  // 动态生成柱状图数据
  const dynamicBarData = {
    labels: currentTimeData.labels,
    datasets: [
      {
        label: `警情量(${currentTimeData.unit})`,
        data: currentTimeData.data,
        backgroundColor: currentTimeData.data.map(value => {
          const max = Math.max(...currentTimeData.data);
          const ratio = value / max;
          if (ratio >= 0.8) return 'rgba(220, 38, 38, 0.7)'; // 红色 - 高
          if (ratio >= 0.6) return 'rgba(249, 115, 22, 0.7)'; // 橙色 - 中高
          if (ratio >= 0.4) return 'rgba(245, 158, 11, 0.7)'; // 黄色 - 中
          if (ratio >= 0.2) return 'rgba(132, 204, 22, 0.7)'; // 浅绿色 - 中低
          return 'rgba(34, 197, 94, 0.7)'; // 绿色 - 低
        }),
        borderColor: currentTimeData.data.map(value => {
          const max = Math.max(...currentTimeData.data);
          const ratio = value / max;
          if (ratio >= 0.8) return 'rgba(220, 38, 38, 1)';
          if (ratio >= 0.6) return 'rgba(249, 115, 22, 1)';
          if (ratio >= 0.4) return 'rgba(245, 158, 11, 1)';
          if (ratio >= 0.2) return 'rgba(132, 204, 22, 1)';
          return 'rgba(34, 197, 94, 1)';
        }),
        borderWidth: 1,
      },
    ],
  };
  
  // 动态图表配置选项
  const dynamicChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: currentTimeData.title,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: currentTimeData.xAxisTitle,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '警情数量',
        },
      },
    },
  };
  
  // 生成对应时间粒度的颜色函数
  const getTimeUnitColor = (value) => {
    const max = Math.max(...currentTimeData.data);
    const ratio = value / max;
    if (ratio >= 0.8) return 'bg-red-500';
    if (ratio >= 0.6) return 'bg-orange-500';
    if (ratio >= 0.4) return 'bg-yellow-500';
    if (ratio >= 0.2) return 'bg-green-400';
    return 'bg-green-500';
  };

  // 模拟警情高发时段数据 (0-23时) - 保持原有的小时数据作为默认
  const hourlyData = generateHourlyData();
  
  // 生成7×24时间热力图数据
  const generateHeatmapData = () => {
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const data = [];
    
    days.forEach((day, dayIndex) => {
      hours.forEach(hour => {
        let value;
        // 模拟不同时间段的警情密度
        if (hour >= 22 || hour <= 6) {
          // 夜间时段，密度较高
          value = Math.random() * 40 + 60;
        } else if (hour >= 7 && hour <= 9) {
          // 早高峰，交通事故多
          value = Math.random() * 30 + 50;
        } else if (hour >= 17 && hour <= 19) {
          // 晚高峰
          value = Math.random() * 35 + 45;
        } else {
          value = Math.random() * 25 + 20;
        }
        
        // 周末夜间娱乐场所警情增加
        if ((dayIndex === 5 || dayIndex === 6) && (hour >= 20 || hour <= 2)) {
          value += Math.random() * 20;
        }
        
        data.push({
          day: day,
          hour: hour,
          value: Math.round(value),
          dayIndex: dayIndex
        });
      });
    });
    
    return data;
  };
  
  const heatmapData = generateHeatmapData();
  
  // 获取热力图颜色
  const getHeatmapColor = (value) => {
    if (value >= 80) return '#DC2626'; // 红色 - 高密度
    if (value >= 60) return '#EA580C'; // 橙红色
    if (value >= 40) return '#D97706'; // 橙色
    if (value >= 25) return '#F59E0B'; // 黄色
    if (value >= 15) return '#EAB308'; // 浅黄色
    if (value >= 5) return '#84CC16';  // 浅绿色
    return '#22C55E'; // 绿色 - 低密度
  };
  
  // 动态对比数据生成函数
  const getComparisonData = () => {
    switch(timeUnit) {
      case 'hour':
        return {
          labels: ['凌晨(00-06)', '早高峰(07-09)', '上午(10-12)', '下午(13-17)', '晚高峰(18-20)', '夜间(21-23)'],
          datasets: [
            {
              label: '工作日',
              data: [15, 45, 35, 40, 50, 30],
              backgroundColor: 'rgba(54, 162, 235, 0.7)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
            {
              label: '周末',
              data: [25, 20, 30, 35, 45, 55],
              backgroundColor: 'rgba(255, 99, 132, 0.7)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            }
          ],
          title: '工作日与周末各时段警情对比',
          comparison1: '工作日',
          comparison2: '周末'
        };
      case 'day':
        return {
          labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          datasets: [
            {
              label: '本周',
              data: [126, 134, 128, 145, 139, 163, 158],
              backgroundColor: 'rgba(54, 162, 235, 0.7)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
            {
              label: '上周',
              data: [118, 125, 132, 140, 135, 155, 148],
              backgroundColor: 'rgba(255, 99, 132, 0.7)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            }
          ],
          title: '本周与上周每日警情对比',
          comparison1: '本周',
          comparison2: '上周'
        };
      case 'week':
        return {
          labels: ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周', '第7周', '第8周'],
          datasets: [
            {
              label: '今年',
              data: [890, 945, 823, 1020, 978, 1156, 1089, 934],
              backgroundColor: 'rgba(54, 162, 235, 0.7)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
            {
              label: '去年同期',
              data: [823, 876, 790, 945, 912, 1089, 1023, 867],
              backgroundColor: 'rgba(255, 99, 132, 0.7)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            }
          ],
          title: '今年与去年同期各周警情对比',
          comparison1: '今年',
          comparison2: '去年同期'
        };
      case 'month':
        return {
          labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          datasets: [
            {
              label: '2025年',
              data: [3450, 3780, 4120, 4890, 4560, 4230, 3890, 3650, 3420, 3780, 4100, 4350],
              backgroundColor: 'rgba(54, 162, 235, 0.7)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
            {
              label: '2024年',
              data: [3280, 3650, 3890, 4560, 4320, 4050, 3720, 3480, 3250, 3590, 3920, 4120],
              backgroundColor: 'rgba(255, 99, 132, 0.7)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            }
          ],
          title: '2025年与2024年各月警情对比',
          comparison1: '2025年',
          comparison2: '2024年'
        };
      default:
        return {
          labels: ['凌晨(00-06)', '早高峰(07-09)', '上午(10-12)', '下午(13-17)', '晚高峰(18-20)', '夜间(21-23)'],
          datasets: [
            {
              label: '工作日',
              data: [15, 45, 35, 40, 50, 30],
              backgroundColor: 'rgba(54, 162, 235, 0.7)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
            {
              label: '周末',
              data: [25, 20, 30, 35, 45, 55],
              backgroundColor: 'rgba(255, 99, 132, 0.7)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            }
          ],
          title: '工作日与周末各时段警情对比',
          comparison1: '工作日',
          comparison2: '周末'
        };
    }
  };
  
  // 获取当前对比数据
  const currentComparisonData = getComparisonData();
  
  // 动态对比图表配置
  const dynamicComparisonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: currentComparisonData.title,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '警情数量',
        },
      },
      x: {
        title: {
          display: true,
          text: currentTimeData.xAxisTitle,
        },
      },
    },
  };

  // 时段对比数据 - 保持向后兼容
  const comparisonData = currentComparisonData;

  // 工作日与周末警情对比数据
  const weekdayData = {
    labels: ['工作日', '周末'],
    datasets: [
      {
        label: '警情总量',
        data: [100, 132], // 假设工作日警情总量为100，周末高出32%
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
      {
        label: '夜间警情(22:00-02:00)',
        data: [20, 50], // 假设工作日夜间警情为20，周末是工作日的2.5倍
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: '早高峰交通类警情(07:00-09:00)',
        data: [30, 10], // 假设工作日早高峰交通类警情为30，周末是工作日的1/3
        backgroundColor: 'rgba(255, 206, 86, 0.5)',
      },
      {
        label: '商业区盗窃类警情',
        data: [10, 18], // 假设工作日商业区盗窃类警情为10，周末是工作日的1.8倍
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  // 节假日对比数据
  const holidayData = {
    labels: ['平日', '节假日'],
    datasets: [
      {
        label: '警情总量',
        data: [120, 174], // 节假日比平日高45%
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
      {
        label: '酒驾类警情',
        data: [8, 25], // 节假日酒驾是平日的3.2倍
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: '景区周边警情',
        data: [15, 42], // 节假日景区警情是平日的2.8倍
        backgroundColor: 'rgba(255, 206, 86, 0.5)',
      },
      {
        label: '娱乐场所警情',
        data: [12, 28], // 节假日娱乐场所警情是平日的2.3倍
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  // 季节性变化数据
  const seasonData = {
    labels: ['春季', '夏季', '秋季', '冬季'],
    datasets: [
      {
        label: '警情总量',
        data: [1250, 1580, 1320, 1100],
        backgroundColor: [
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 99, 132, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(54, 162, 235, 0.5)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(54, 162, 235, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const weekdayOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '工作日与周末警情对比',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const holidayOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '节假日与平日警情对比',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const seasonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '季节性警情变化分析',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // 未来7天警情量预测数据
  const shortTrendData = {
    labels: ['5/7', '5/8', '5/9', '5/10', '5/11', '5/12', '5/13'],
    datasets: [
      {
        label: '警情量预测',
        data: [130, 140, 135, 150, 138, 132, 127],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.3,
        fill: false,
        borderWidth: 3,
      },
      {
        label: '置信区间上限',
        data: [140, 150, 145, 160, 148, 142, 137],
        borderColor: 'rgba(54, 162, 235, 0.3)',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        fill: '+1',
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 1,
        borderDash: [5, 5],
      },
      {
        label: '置信区间下限',
        data: [120, 130, 125, 140, 128, 122, 117],
        borderColor: 'rgba(54, 162, 235, 0.3)',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        fill: false,
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 1,
        borderDash: [5, 5],
      },
    ],
  };

  const shortTrendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          filter: function(item) {
            return !item.text.includes('置信区间');
          }
        }
      },
      title: {
        display: true,
        text: '未来7天警情量预测',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: '日期',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        title: {
          display: true,
          text: '警情量',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        min: 100,
        max: 170,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
  };

  // 优化中期预测：只显示每3天的数据点，减少密度
  const mediumTrendData = {
    labels: ['5/7', '5/10', '5/13', '5/16', '5/19', '5/22', '5/25', '5/28', '5/31', '6/3', '6/6'], // 每3天一个点，共11个点
    datasets: [
      {
        label: '警情量预测',
        data: [138, 142, 145, 139, 135, 148, 152, 146, 140, 144, 141], // 11个优化的数据点
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.4,
        fill: false,
        borderWidth: 3,
      },
      {
        label: '置信区间上限',
        data: [148, 152, 155, 149, 145, 158, 162, 156, 150, 154, 151],
        borderColor: 'rgba(54, 162, 235, 0.3)',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        fill: '+1',
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 1,
        borderDash: [5, 5],
      },
      {
        label: '置信区间下限',
        data: [128, 132, 135, 129, 125, 138, 142, 136, 130, 134, 131],
        borderColor: 'rgba(54, 162, 235, 0.3)',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        fill: false,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 1,
        borderDash: [5, 5],
      },
    ],
  };

  const mediumTrendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          filter: function(item) {
            return !item.text.includes('置信区间');
          }
        }
      },
      title: {
        display: true,
        text: '未来30天警情量预测 (每3天采样)',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          title: function(context) {
            return `日期: ${context[0].label} (代表3天区间)`;
          }
        }
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: '日期 (每3天采样)',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          maxRotation: 45,
          minRotation: 0,
        },
      },
      y: {
        title: {
          display: true,
          text: '警情量',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        min: 120,
        max: 170,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
  };

  // 长期预测数据（8个月）
  const longTrendData = {
    labels: ['5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    datasets: [
      {
        label: '警情量预测',
        data: [4200, 4580, 4890, 4720, 4350, 4180, 3920, 3850],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.3,
        fill: false,
        borderWidth: 3,
      },
      {
        label: '置信区间上限',
        data: [4400, 4780, 5090, 4920, 4550, 4380, 4120, 4050],
        borderColor: 'rgba(54, 162, 235, 0.3)',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        fill: '+1',
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 1,
        borderDash: [5, 5],
      },
      {
        label: '置信区间下限',
        data: [4000, 4380, 4690, 4520, 4150, 3980, 3720, 3650],
        borderColor: 'rgba(54, 162, 235, 0.3)',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        fill: false,
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 1,
        borderDash: [5, 5],
      },
    ],
  };

  const longTrendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          filter: function(item) {
            return !item.text.includes('置信区间');
          }
        }
      },
      title: {
        display: true,
        text: '未来8个月警情量预测',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: '月份',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        title: {
          display: true,
          text: '警情量',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        min: 3500,
        max: 5200,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
  };
  
  // 完整的预警数据
  const getAllWarnings = () => {
    const warnings = {
      short: [
        {
          id: 1,
          date: '2025-05-10',
          level: 'high',
          type: '警情激增',
          description: '预计警情量激增，建议提前部署',
          reason: '周五夜间娱乐活动集中，历史数据显示同期警情增长45%',
          suggestion: '增派巡逻警力，重点关注商业区和娱乐场所',
          priority: 1,
          color: 'bg-red-500'
        },
        {
          id: 2,
          date: '2025-05-08',
          level: 'medium',
          type: '夜间警情',
          description: '周四夜间警情可能高于平均水平',
          reason: '工作日夜间酒驾、纠纷类案件通常在周四达到小高峰',
          suggestion: '22:00后增加路面执勤，重点查处酒驾',
          priority: 2,
          color: 'bg-orange-500'
        },
        {
          id: 3,
          date: '2025-05-11',
          level: 'medium',
          type: '交通警情',
          description: '周六商圈交通警情预警',
          reason: '购物高峰期，停车纠纷和交通事故风险增加',
          suggestion: '商圈周边增设临时指挥岗，疏导交通',
          priority: 3,
          color: 'bg-orange-500'
        },
        {
          id: 4,
          date: '2025-05-12',
          level: 'low',
          type: '防范提醒',
          description: '母亲节期间商场客流量增大',
          reason: '节日购物可能导致盗窃案件轻微上升',
          suggestion: '商场内增加便衣巡逻，提醒商户注意防盗',
          priority: 4,
          color: 'bg-yellow-500'
        }
      ],
      medium: [
        {
          id: 5,
          date: '2025-05-25',
          level: 'high',
          type: '盗窃激增',
          description: '商业促销活动期间，盗窃类警情可能激增',
          reason: '618购物节期间，商场人流密集，历史数据显示盗窃案增长60%',
          suggestion: '商业区增派便衣警察，加强与商户联防',
          priority: 1,
          color: 'bg-red-500'
        },
        {
          id: 6,
          date: '2025-05-15至18',
          level: 'medium',
          type: '纠纷多发',
          description: '连续多日高温天气，纠纷类警情可能增多',
          reason: '气温超过30°C连续4天，情绪波动大，邻里纠纷增多',
          suggestion: '社区民警提前入户走访，排查矛盾隐患',
          priority: 2,
          color: 'bg-orange-500'
        },
        {
          id: 7,
          date: '2025-05-20',
          level: 'medium',
          type: '校园安全',
          description: '小学期末考试期间家长焦虑情绪',
          reason: '期末考试压力可能引发家庭纠纷和校园周边问题',
          suggestion: '学校周边增派警力，开展心理疏导宣传',
          priority: 3,
          color: 'bg-orange-500'
        },
        {
          id: 8,
          date: '2025-05-30',
          level: 'low',
          type: '节日预警',
          description: '端午节前夕聚餐活动增多',
          reason: '聚餐可能导致酒驾案件小幅上升',
          suggestion: '重点路段设卡检查，加强酒驾宣传',
          priority: 4,
          color: 'bg-yellow-500'
        }
      ],
      long: [
        {
          id: 9,
          date: '2025年7月',
          level: 'high',
          type: '暑期高峰',
          description: '暑期高峰月，警情量预计达到4890起',
          reason: '学生放假、气温升高、夜间活动增多等因素叠加',
          suggestion: '制定暑期专项行动方案，增加夜间巡逻',
          priority: 1,
          color: 'bg-red-500'
        },
        {
          id: 10,
          date: '2025年6月',
          level: 'medium',
          type: '毕业季风险',
          description: '毕业季酒驾类警情预计显著增长',
          reason: '毕业聚餐、谢师宴频繁，酒驾风险增加70%',
          suggestion: '高校周边重点整治，开展毕业生安全教育',
          priority: 2,
          color: 'bg-orange-500'
        },
        {
          id: 11,
          date: '2025年12月',
          level: 'medium',
          type: '年末风险',
          description: '年末节日密集，需防范相关风险',
          reason: '圣诞、元旦节庆活动密集，人流量大',
          suggestion: '提前制定节庆安保方案，重点场所安排警力',
          priority: 3,
          color: 'bg-orange-500'
        },
        {
          id: 12,
          date: '2025年8月',
          level: 'medium',
          type: '高温警情',
          description: '持续高温可能引发各类纠纷',
          reason: '极端高温天气影响情绪，纠纷案件通常增长35%',
          suggestion: '社区加强矛盾排查，及时化解纠纷苗头',
          priority: 4,
          color: 'bg-orange-500'
        },
        {
          id: 13,
          date: '2025年9月',
          level: 'low',
          type: '开学季',
          description: '开学季校园周边安全需关注',
          reason: '新生入学，校园周边人流增加，诈骗案件可能上升',
          suggestion: '开展校园安全宣传，提高学生防范意识',
          priority: 5,
          color: 'bg-yellow-500'
        }
      ]
    };
    
    return warnings[trendTab] || warnings.short;
  };
  
  // 预警详情弹窗组件
  const WarningModal = () => {
    const currentWarnings = getAllWarnings();
    
    if (!showWarningModal) return null;
    
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowWarningModal(false);
          }
        }}
      >
        <div className="bg-white rounded-lg max-w-xl max-h-[80vh] overflow-y-auto p-4 m-4"
             onClick={(e) => e.stopPropagation()}>
          {/* 弹窗头部 */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                {trendTab === 'short' ? '短期预警' : trendTab === 'medium' ? '中期预警' : '长期预警'}详情
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                预测时间范围：{trendTab === 'short' ? '未来7天' : trendTab === 'medium' ? '未来30天' : '未来8个月'}
              </p>
            </div>
            <button 
              onClick={() => setShowWarningModal(false)}
              className="text-gray-500 hover:text-gray-700 text-xl font-bold transition-colors"
              title="关闭 (ESC)"
            >
              ×
            </button>
          </div>
          
          {/* 预警统计 */}
          <div className="grid grid-cols-4 gap-1 mb-3">
            <div className="bg-red-50 p-2 rounded text-center">
              <div className="text-lg font-bold text-red-600">
                {currentWarnings.filter(w => w.level === 'high').length}
              </div>
              <div className="text-xs text-red-600">高风险</div>
            </div>
            <div className="bg-orange-50 p-2 rounded text-center">
              <div className="text-lg font-bold text-orange-600">
                {currentWarnings.filter(w => w.level === 'medium').length}
              </div>
              <div className="text-xs text-orange-600">中风险</div>
            </div>
            <div className="bg-yellow-50 p-2 rounded text-center">
              <div className="text-lg font-bold text-yellow-600">
                {currentWarnings.filter(w => w.level === 'low').length}
              </div>
              <div className="text-xs text-yellow-600">低风险</div>
            </div>
            <div className="bg-blue-50 p-2 rounded text-center">
              <div className="text-lg font-bold text-blue-600">
                {currentWarnings.length}
              </div>
              <div className="text-xs text-blue-600">总数</div>
            </div>
          </div>
          
          {/* 预警列表 */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-800 mb-2">详细预警列表</h3>
            {currentWarnings.slice(0, 3).map((warning, index) => (
              <div key={warning.id} className="border rounded p-2 hover:shadow-sm transition-shadow">
                {/* 预警头部 - 紧凑布局 */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2 flex-1">
                    <div className={`w-2 h-2 rounded-full ${warning.color} flex-shrink-0`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1 mb-1">
                        <span className="text-sm font-medium text-gray-800 truncate">{warning.date}</span>
                        <span className={`px-1 py-0.5 rounded text-xs font-medium flex-shrink-0 ${
                          warning.level === 'high' ? 'bg-red-100 text-red-800' :
                          warning.level === 'medium' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {warning.level === 'high' ? '高风险' : warning.level === 'medium' ? '中风险' : '低风险'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 line-clamp-1">{warning.description}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 ml-2">#{index + 1}</div>
                </div>
                
                {/* 预警详情 - 水平布局节省空间 */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-blue-50 p-1.5 rounded">
                    <h4 className="font-medium text-blue-800 mb-1">⚡ 预警原因</h4>
                    <p className="text-blue-700 text-xs line-clamp-2">{warning.reason}</p>
                  </div>
                  <div className="bg-green-50 p-1.5 rounded">
                    <h4 className="font-medium text-green-800 mb-1">💡 处置建议</h4>
                    <p className="text-green-700 text-xs line-clamp-2">{warning.suggestion}</p>
                  </div>
                </div>
                
                {/* 预警优先级 - 简化显示 */}
                <div className="mt-2 flex justify-between items-center">
                  <div className="flex items-center text-xs text-gray-500">
                    <span>优先级：</span>
                    <div className="flex ml-1">
                      {[1, 2, 3, 4, 5].map(level => (
                        <div 
                          key={level}
                          className={`w-1 h-1 rounded-full mr-0.5 ${
                            level <= warning.priority ? 'bg-red-400' : 'bg-gray-200'
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    ID: {warning.id}
                  </div>
                </div>
              </div>
            ))}
            {currentWarnings.length > 3 && (
              <div className="text-center text-xs text-gray-500 py-1">
                还有 {currentWarnings.length - 3} 条预警，请导出查看完整信息
              </div>
            )}
          </div>
          
          {/* 弹窗底部操作 */}
          <div className="flex justify-between items-center mt-4 pt-3 border-t">
            <div className="text-xs text-gray-500">
              共{currentWarnings.length}条预警
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setShowWarningModal(false)}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
              >
                关闭
              </button>
              <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors">
                导出
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout title="时间维度分析">
      {/* 时间维度控制面板 */}
      <div className="bg-white p-4 mb-4 rounded shadow">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-gray-500 mb-2">时间粒度</div>
            <div className="flex border rounded overflow-hidden">
              <div 
                className={`px-3 py-2 text-sm cursor-pointer ${timeUnit === 'hour' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                onClick={() => setTimeUnit('hour')}
              >
                小时
              </div>
              <div 
                className={`px-3 py-2 text-sm cursor-pointer ${timeUnit === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                onClick={() => setTimeUnit('day')}
              >
                日
              </div>
              <div 
                className={`px-3 py-2 text-sm cursor-pointer ${timeUnit === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                onClick={() => setTimeUnit('week')}
              >
                周
              </div>
              <div 
                className={`px-3 py-2 text-sm cursor-pointer ${timeUnit === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                onClick={() => setTimeUnit('month')}
              >
                月
              </div>
            </div>
          </div>
          
          <div>
            <div className="text-sm text-gray-500 mb-2">时间范围</div>
            <div className="flex border rounded overflow-hidden">
              <div 
                className={`px-3 py-2 text-sm cursor-pointer flex-1 text-center ${timeRange === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                onClick={() => setTimeRange('week')}
              >
                近一周
              </div>
              <div 
                className={`px-3 py-2 text-sm cursor-pointer flex-1 text-center ${timeRange === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                onClick={() => setTimeRange('month')}
              >
                近一月
              </div>
              <div 
                className={`px-3 py-2 text-sm cursor-pointer flex-1 text-center ${timeRange === 'quarter' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                onClick={() => setTimeRange('quarter')}
              >
                近三月
              </div>
              <div 
                className={`px-3 py-2 text-sm cursor-pointer flex-1 text-center ${timeRange === 'year' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                onClick={() => setTimeRange('year')}
              >
                近一年
              </div>
            </div>
          </div>
          
          <div>
            <div className="text-sm text-gray-500 mb-2">对比方式</div>
            <div className="flex border rounded overflow-hidden">
              <div 
                className={`px-3 py-2 text-sm cursor-pointer flex-1 text-center ${compareType === 'yoy' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                onClick={() => setCompareType('yoy')}
              >
                同比
              </div>
              <div 
                className={`px-3 py-2 text-sm cursor-pointer flex-1 text-center ${compareType === 'mom' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                onClick={() => setCompareType('mom')}
              >
                环比
              </div>
              <div 
                className={`px-3 py-2 text-sm cursor-pointer flex-1 text-center ${compareType === 'custom' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                onClick={() => setCompareType('custom')}
              >
                自定义
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 时段分析模块 */}
      <div className="bg-white p-4 mb-4 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">时段分析</h2>
          <div className="flex">
            <div 
              className={`px-3 py-1 text-sm cursor-pointer ${analysisTab === 'distribution' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
              onClick={() => setAnalysisTab('distribution')}
            >
              24小时分布
            </div>
            <div 
              className={`px-3 py-1 text-sm cursor-pointer ${analysisTab === 'heatmap' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
              onClick={() => setAnalysisTab('heatmap')}
            >
              时段热力图
            </div>
            <div 
              className={`px-3 py-1 text-sm cursor-pointer ${analysisTab === 'comparison' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
              onClick={() => setAnalysisTab('comparison')}
            >
              时段对比
            </div>
          </div>
        </div>
        
        {analysisTab === 'distribution' && (
          <div>
            <div className="mb-3 text-sm text-gray-500">{currentTimeData.title}</div>
            <div style={{ height: '300px' }}>
              <Bar data={dynamicBarData} options={dynamicChartOptions} />
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <div className="text-sm">
                <span className="font-medium">高发{currentTimeData.unit}：</span>{currentTimeData.peakInfo.time}
              </div>
              <div className="text-sm">
                <span className="font-medium">峰值{currentTimeData.unit}：</span>{currentTimeData.peakInfo.time} ({currentTimeData.peakInfo.value})
              </div>
              <div className="text-sm">
                <span className="font-medium">低谷{currentTimeData.unit}：</span>{currentTimeData.peakInfo.lowTime}
              </div>
              <div className="text-sm text-blue-500 cursor-pointer">
                查看详细分析 →
              </div>
            </div>
          </div>
        )}
        
        {analysisTab === 'heatmap' && (
          <div>
            <div className="mb-3 text-sm text-gray-500">一周内各时段警情密度分布热力图</div>
            {/* 热力图表头 */}
            <div className="grid grid-cols-8 gap-1 mb-2">
              <div className="text-xs font-medium text-gray-500 text-center p-1"></div>
              {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map(day => (
                <div key={day} className="text-xs font-medium text-gray-500 text-center p-1">
                  {day}
                </div>
              ))}
            </div>
            
            {/* 热力图数据 */}
            <div className="overflow-x-auto">
              {Array.from({ length: 24 }, (_, hour) => (
                <div key={hour} className="grid grid-cols-8 gap-1 mb-1">
                  <div className="text-xs text-gray-500 text-right pr-2 py-1">
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                  {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map(day => {
                    const cellData = heatmapData.find(d => d.day === day && d.hour === hour);
                    const value = cellData ? cellData.value : 0;
                    return (
                      <div
                        key={`${day}-${hour}`}
                        className="h-6 w-full rounded cursor-pointer transition-all hover:scale-110 flex items-center justify-center text-xs font-bold text-white"
                        style={{ backgroundColor: getHeatmapColor(value) }}
                        title={`${day} ${hour}:00 - 警情密度: ${value}`}
                      >
                        {value}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            
            {/* 颜色图例 */}
            <div className="flex justify-center items-center space-x-4 mt-4 p-2 bg-gray-50 rounded">
              <span className="text-xs text-gray-500">密度等级:</span>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#22C55E' }}></div>
                <span className="text-xs">低(0-15)</span>
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#F59E0B' }}></div>
                <span className="text-xs">中(16-60)</span>
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#DC2626' }}></div>
                <span className="text-xs">高(61+)</span>
              </div>
            </div>
          </div>
        )}
        
        {analysisTab === 'comparison' && (
          <div>
            <div className="mb-3 text-sm text-gray-500">{currentComparisonData.title}</div>
            <div style={{ height: '300px' }}>
              <Bar data={comparisonData} options={dynamicComparisonOptions} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="bg-blue-50 p-3 rounded">
                <h4 className="font-medium mb-2">{currentComparisonData.comparison1}特征</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {timeUnit === 'hour' && (
                    <>
                      <li>早高峰(07-09)交通警情是周末的2.25倍</li>
                      <li>上午时段相对平稳，警情量适中</li>
                      <li>下午(13-17)商务活动频繁，相关警情略高</li>
                      <li>夜间(21-23)相对安静，警情量较低</li>
                    </>
                  )}
                  {timeUnit === 'day' && (
                    <>
                      <li>本周周四警情量达到峰值(145起)</li>
                      <li>工作日整体警情量相对稳定</li>
                      <li>周六警情量显著高于其他日期</li>
                      <li>周一开始警情量逐步上升</li>
                    </>
                  )}
                  {timeUnit === 'week' && (
                    <>
                      <li>第6周警情量达到年度高峰(1156起)</li>
                      <li>整体呈现波动上升趋势</li>
                      <li>连续3周警情量超过1000起</li>
                      <li>与去年同期相比增长约8.2%</li>
                    </>
                  )}
                  {timeUnit === 'month' && (
                    <>
                      <li>7月份警情量达到年度最高(4890起)</li>
                      <li>夏季月份(6-8月)警情量普遍较高</li>
                      <li>春节期间(2月)警情量相对较高</li>
                      <li>年度总警情量呈稳定增长态势</li>
                    </>
                  )}
                </ul>
              </div>
              <div className="bg-red-50 p-3 rounded">
                <h4 className="font-medium mb-2">{currentComparisonData.comparison2}特征</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {timeUnit === 'hour' && (
                    <>
                      <li>凌晨(00-06)娱乐场所相关警情增多</li>
                      <li>早高峰交通压力小，相关警情显著减少</li>
                      <li>夜间(21-23)是最高峰，娱乐活动集中</li>
                      <li>整体分布较为平均，无明显低谷</li>
                    </>
                  )}
                  {timeUnit === 'day' && (
                    <>
                      <li>上周整体警情量低于本周</li>
                      <li>上周周六警情量相对较高(155起)</li>
                      <li>工作日警情量波动较小</li>
                      <li>周环比增长率为6.8%</li>
                    </>
                  )}
                  {timeUnit === 'week' && (
                    <>
                      <li>去年同期第6周也是高峰期</li>
                      <li>去年整体警情量略低于今年</li>
                      <li>第3周去年警情量明显偏低</li>
                      <li>同比增长趋势相对稳定</li>
                    </>
                  )}
                  {timeUnit === 'month' && (
                    <>
                      <li>2024年7月份同样是年度高峰期</li>
                      <li>2024年整体警情量略低于2025年</li>
                      <li>春节月份(2月)2024年警情量较低</li>
                      <li>年度同比增长率约为5.2%</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* 周期规律分析模块 */}
      <div className="bg-white p-4 mb-4 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">周期规律分析</h2>
          <div className="flex">
            <div 
              className={`px-3 py-1 text-sm cursor-pointer ${patternTab === 'weekday' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
              onClick={() => setPatternTab('weekday')}
            >
              工作日/周末
            </div>
            <div 
              className={`px-3 py-1 text-sm cursor-pointer ${patternTab === 'holiday' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
              onClick={() => setPatternTab('holiday')}
            >
              节假日/平日
            </div>
            <div 
              className={`px-3 py-1 text-sm cursor-pointer ${patternTab === 'season' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
              onClick={() => setPatternTab('season')}
            >
              季节性变化
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div style={{ height: '300px' }}>
            {/* 周期对比图表 */}
            {patternTab === 'weekday' && <Bar data={weekdayData} options={weekdayOptions} />}
            {patternTab === 'holiday' && <Bar data={holidayData} options={holidayOptions} />}
            {patternTab === 'season' && <Bar data={seasonData} options={seasonOptions} />}
          </div>
          
          <div>
            <div className="bg-blue-50 p-3 rounded mb-3">
              <h3 className="font-medium mb-2">周期规律发现</h3>
              <ul className="list-disc pl-5 text-sm space-y-2">
                {patternTab === 'weekday' && (
                  <>
                    <li>周末警情总量比工作日高出32%</li>
                    <li>周末夜间(22:00-02:00)警情是工作日的2.5倍</li>
                    <li>工作日早高峰(07:00-09:00)交通类警情是周末的3倍</li>
                    <li>周末商业区盗窃类警情是工作日的1.8倍</li>
                  </>
                )}
                {patternTab === 'holiday' && (
                  <>
                    <li>节假日警情总量比平日高出45%</li>
                    <li>节假日酒驾类警情是平日的3.2倍</li>
                    <li>节假日前一日夜间警情明显高于平日</li>
                    <li>景区周边警情在节假日增长最为显著</li>
                  </>
                )}
                {patternTab === 'season' && (
                  <>
                    <li>夏季警情总量最高，冬季最低</li>
                    <li>春季交通事故类警情高发期为3-4月</li>
                    <li>夏季夜间纠纷类警情是其他季节的1.5倍</li>
                    <li>冬季盗窃类警情在春节前后有明显高峰</li>
                  </>
                )}
              </ul>
            </div>
            
            <div className="bg-orange-50 p-3 rounded">
              <h3 className="font-medium mb-2">警务建议</h3>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {patternTab === 'weekday' && (
                  <>
                    <li>周末夜间增派警力重点巡逻商业区和娱乐场所</li>
                    <li>工作日早高峰增派交警维持交通秩序</li>
                  </>
                )}
                {patternTab === 'holiday' && (
                  <>
                    <li>节假日期间增设临时警务站点</li>
                    <li>节假日加强酒驾查处力度</li>
                  </>
                )}
                {patternTab === 'season' && (
                  <>
                    <li>夏季夜间加强治安巡逻</li>
                    <li>春季加强交通安全宣传</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* 时序趋势预测模块 */}
      <div className="bg-white p-4 mb-4 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">时序趋势预测</h2>
          <div className="flex">
            <div 
              className={`px-3 py-1 text-sm cursor-pointer ${trendTab === 'short' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
              onClick={() => setTrendTab('short')}
            >
              短期预测(7天)
            </div>
            <div 
              className={`px-3 py-1 text-sm cursor-pointer ${trendTab === 'medium' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
              onClick={() => setTrendTab('medium')}
            >
              中期预测(30天)
            </div>
            <div 
              className={`px-3 py-1 text-sm cursor-pointer ${trendTab === 'long' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
              onClick={() => setTrendTab('long')}
            >
              长期预测(季度)
            </div>
          </div>
        </div>
        
        <div style={{ height: '300px' }}>
          {/* 趋势预测图 */}
          {trendTab === 'short' && <Line data={shortTrendData} options={shortTrendOptions} />}
          {trendTab === 'medium' && <Line data={mediumTrendData} options={mediumTrendOptions} />}
          {trendTab === 'long' && <Line data={longTrendData} options={longTrendOptions} />}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded">
            <h3 className="font-medium mb-2">预测与异常</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>预计未来{trendTab === 'short' ? '7天' : trendTab === 'medium' ? '30天' : '8个月'}警情总量:</span>
                <span className="font-bold">{trendTab === 'short' ? '952' : trendTab === 'medium' ? '4,125' : '33,590'} 起</span>
              </div>
              <div className="flex justify-between">
                <span>预计{trendTab === 'long' ? '月' : '日'}均警情量:</span>
                <span className="font-bold">{trendTab === 'short' ? '136' : trendTab === 'medium' ? '138' : '4,199'} 起</span>
              </div>
              <div className="flex justify-between">
                <span>环比变化率:</span>
                <span className={trendTab === 'long' ? 'font-bold text-red-500' : 'font-bold text-green-500'}>
                  {trendTab === 'short' ? '-2.3%' : trendTab === 'medium' ? '-1.5%' : '+6.8%'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>预测准确率:</span>
                <span className="font-bold">{trendTab === 'short' ? '92.5%' : trendTab === 'medium' ? '87.3%' : '78.6%'}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 p-3 rounded">
            <h3 className="font-medium mb-2 flex items-center">
              <span className="mr-1">⚠️</span> 预测异常点
            </h3>
            <div className="space-y-2 text-sm">
              {trendTab === 'short' && (
                <>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                    <span className="font-medium">2025-05-10:</span>
                    <span className="ml-2">预计警情量激增，建议提前部署</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mr-2"></div>
                    <span className="font-medium">2025-05-08:</span>
                    <span className="ml-2">周四夜间警情可能高于平均水平</span>
                  </div>
                </>
              )}
              {trendTab === 'medium' && (
                <>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                    <span className="font-medium">2025-05-25:</span>
                    <span className="ml-2">商业促销活动期间，盗窃类警情可能激增</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mr-2"></div>
                    <span className="font-medium">2025-05-15至18:</span>
                    <span className="ml-2">连续多日高温天气，纠纷类警情可能增多</span>
                  </div>
                </>
              )}
              {trendTab === 'long' && (
                <>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                    <span className="font-medium">2025年7月:</span>
                    <span className="ml-2">暑期高峰月，警情量预计达到4890起</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mr-2"></div>
                    <span className="font-medium">2025年6月:</span>
                    <span className="ml-2">毕业季酒驾类警情预计显著增长</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mr-2"></div>
                    <span className="font-medium">2025年12月:</span>
                    <span className="ml-2">年末节日密集，需防范相关风险</span>
                  </div>
                </>
              )}
              <div className="mt-3 text-right">
                <button 
                  onClick={() => setShowWarningModal(true)}
                  className="text-blue-500 text-sm hover:text-blue-600 hover:underline transition-colors cursor-pointer"
                >
                  查看全部预警 →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 预警详情弹窗 */}
      <WarningModal />
    </Layout>
  );
};

export default TimeDimensionAnalysis;