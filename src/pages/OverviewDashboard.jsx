import React, { useState } from 'react';
import Layout from '../components/Layout';
import { MapContainer, TileLayer } from 'react-leaflet';
import HeatmapLayer from '../components/HeatmapLayer';
import 'leaflet/dist/leaflet.css';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import 'chart.js/auto';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

const heatmapData = [
  [39.9042, 116.4074, 0.8], // 示例数据：纬度，经度，权重
  [39.9142, 116.4174, 0.6],
  [39.9242, 116.4274, 0.9],
  [39.9342, 116.4374, 0.7],
];

// 生成24小时×7天的热力图数据
const generateTimeHeatmapData = () => {
  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const data = [];
  
  days.forEach((day, dayIndex) => {
    hours.forEach(hour => {
      // 模拟不同时间段的警情密度
      let density;
      if (hour >= 22 || hour <= 6) {
        // 夜间时段，密度较高（盗窃、醉酒等）
        density = Math.random() * 40 + 60;
      } else if (hour >= 7 && hour <= 9) {
        // 早高峰，交通事故多
        density = Math.random() * 30 + 50;
      } else if (hour >= 17 && hour <= 19) {
        // 晚高峰
        density = Math.random() * 35 + 45;
      } else if (hour >= 10 && hour <= 16) {
        // 白天时段，相对较低
        density = Math.random() * 25 + 20;
      } else {
        density = Math.random() * 20 + 10;
      }
      
      // 周末夜间娱乐场所警情增加
      if ((dayIndex === 5 || dayIndex === 6) && (hour >= 20 || hour <= 2)) {
        density += Math.random() * 20;
      }
      
      data.push({
        day: day,
        hour: hour,
        density: Math.round(density),
        dayIndex: dayIndex,
        timeSlot: `${hour}:00`
      });
    });
  });
  
  return data;
};

const timeHeatmapData = generateTimeHeatmapData();

const TimeHeatmap = () => {
  const [selectedCell, setSelectedCell] = useState(null);
  
  // 获取密度值对应的颜色
  const getDensityColor = (density) => {
    if (density >= 80) return '#DC2626'; // 红色 - 高密度
    if (density >= 60) return '#EA580C'; // 橙红色
    if (density >= 40) return '#D97706'; // 橙色
    if (density >= 25) return '#F59E0B'; // 黄色
    if (density >= 15) return '#EAB308'; // 浅黄色
    if (density >= 5) return '#84CC16';  // 浅绿色
    return '#22C55E'; // 绿色 - 低密度
  };

  // 渲染热力图单元格
  const renderHeatmapCells = () => {
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    return (
      <div className="grid grid-cols-8 gap-1 p-4">
        {/* 表头 */}
        <div className="text-xs font-medium text-gray-500 text-center"></div>
        {days.map(day => (
          <div key={day} className="text-xs font-medium text-gray-500 text-center p-1">
            {day}
          </div>
        ))}
        
        {/* 热力图数据 */}
        {hours.map(hour => (
          <React.Fragment key={hour}>
            <div className="text-xs text-gray-500 text-right pr-2 py-1">
              {hour}:00
            </div>
            {days.map(day => {
              const cellData = timeHeatmapData.find(d => d.day === day && d.hour === hour);
              const density = cellData ? cellData.density : 0;
              return (
                <div
                  key={`${day}-${hour}`}
                  className="h-6 w-full rounded cursor-pointer transition-all hover:scale-110 hover:z-10 relative"
                  style={{ backgroundColor: getDensityColor(density) }}
                  onMouseEnter={() => setSelectedCell({ day, hour, density })}
                  onMouseLeave={() => setSelectedCell(null)}
                  title={`${day} ${hour}:00 - 警情密度: ${density}`}
                >
                  {selectedCell && selectedCell.day === day && selectedCell.hour === hour && (
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs p-2 rounded whitespace-nowrap z-20">
                      {day} {hour}:00<br/>
                      警情密度: {density}
                    </div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">警情时间分布热力图</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-500">密度等级:</span>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#22C55E' }}></div>
              <span className="text-xs">低</span>
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#F59E0B' }}></div>
              <span className="text-xs">中</span>
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#DC2626' }}></div>
              <span className="text-xs">高</span>
            </div>
          </div>
          <div className="text-blue-500 text-sm cursor-pointer">切换视图</div>
        </div>
      </div>
      <div className="overflow-x-auto">
        {renderHeatmapCells()}
      </div>
      
      {/* 统计信息 */}
      <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="font-medium text-gray-700">高峰时段</div>
          <div className="text-lg font-bold text-red-600">22:00-06:00</div>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="font-medium text-gray-700">平均密度</div>
          <div className="text-lg font-bold text-blue-600">
            {Math.round(timeHeatmapData.reduce((sum, d) => sum + d.density, 0) / timeHeatmapData.length)}
          </div>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="font-medium text-gray-700">周末增幅</div>
          <div className="text-lg font-bold text-orange-600">+25%</div>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="font-medium text-gray-700">最高密度</div>
          <div className="text-lg font-bold text-red-600">
            {Math.max(...timeHeatmapData.map(d => d.density))}
          </div>
        </div>
      </div>
    </div>
  );
};

// 高危预警详情数据
const highRiskWarnings = [
  {
    id: 1,
    title: 'XX商圈盗窃案件高发预警',
    location: 'XX商圈周边区域',
    riskLevel: '高危',
    riskScore: 85,
    alertType: '盗窃案件集中',
    description: '系统检测到XX商圈区域近期盗窃类警情数量明显上升，环比增长35%',
    timeRange: '近7天',
    caseCount: 12,
    trendStatus: 'increasing',
    factors: [
      { name: '案件频率', score: 90, description: '近7天发生12起，超出正常水平' },
      { name: '时间集中度', score: 80, description: '主要集中在14:00-18:00时段' },
      { name: '地点集中度', score: 85, description: '集中在商场周边200米范围内' },
      { name: '手法相似度', score: 82, description: '作案手法高度相似，疑似同伙' }
    ],
    suggestions: [
      '建议在14:00-18:00时段增加2组巡逻警力',
      '在商场主要出入口增设临时执勤点',
      '协调商场保安加强内部巡查',
      '发布市民防范提醒公告'
    ],
    relatedCases: [
      { time: '2025-05-06 15:30', location: 'XX商场北门', type: '手机被盗' },
      { time: '2025-05-05 16:45', location: 'XX商场西侧街道', type: '钱包被盗' },
      { time: '2025-05-04 14:20', location: 'XX商场地下停车场', type: '车内物品被盗' }
    ]
  },
  {
    id: 2,
    title: 'XX路口交通事故频发预警',
    location: 'XX路与XX街交叉口',
    riskLevel: '高危',
    riskScore: 78,
    alertType: '交通事故多发',
    description: '该路口近期交通事故频发，已连续5天发生事故',
    timeRange: '近5天',
    caseCount: 8,
    trendStatus: 'increasing',
    factors: [
      { name: '事故频率', score: 85, description: '近5天发生8起，超出警戒线' },
      { name: '伤亡程度', score: 70, description: '多为轻微刮擦，但影响交通' },
      { name: '时间规律', score: 75, description: '主要集中在早晚高峰期' },
      { name: '天气因素', score: 80, description: '雨天事故率明显上升' }
    ],
    suggestions: [
      '在早晚高峰增派交警现场指挥',
      '检查信号灯配时是否合理',
      '增设警示标志和减速带',
      '雨天加强路面维护'
    ],
    relatedCases: [
      { time: '2025-05-06 08:15', location: 'XX路口南侧', type: '追尾事故' },
      { time: '2025-05-05 17:30', location: 'XX路口东侧', type: '刮擦事故' },
      { time: '2025-05-04 07:45', location: 'XX路口北侧', type: '追尾事故' }
    ]
  },
  {
    id: 3,
    title: 'XX夜市治安隐患预警',
    location: 'XX夜市及周边',
    riskLevel: '中危',
    riskScore: 72,
    alertType: '治安隐患',
    description: '夜市区域人员流动性大，近期治安案件有所上升',
    timeRange: '近10天',
    caseCount: 15,
    trendStatus: 'stable',
    factors: [
      { name: '人员密度', score: 80, description: '夜间人流量大，管理困难' },
      { name: '治安案件', score: 65, description: '酒后滋事、纠纷增多' },
      { name: '环境复杂度', score: 70, description: '摊位密集，视线受阻' },
      { name: '管理水平', score: 74, description: '现有管理力度有待加强' }
    ],
    suggestions: [
      '增加夜间巡逻频次',
      '协调夜市管理方加强秩序维护',
      '在主要通道增设监控探头',
      '建立商户联防机制'
    ],
    relatedCases: [
      { time: '2025-05-05 22:30', location: 'XX夜市C区', type: '酒后滋事' },
      { time: '2025-05-04 23:15', location: 'XX夜市入口', type: '商贩纠纷' },
      { time: '2025-05-03 21:45', location: 'XX夜市B区', type: '钱包被盗' }
    ]
  }
];

// 预警详情评分卡组件
const WarningDetailModal = ({ isOpen, onClose, warnings }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // 处理点击遮罩关闭
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  // 处理ESC键关闭 - 必须在条件返回之前
  React.useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      // 阻止背景滚动
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);
  
  // 条件返回必须在所有Hooks之后
  if (!isOpen || !warnings || warnings.length === 0) return null;
  
  const currentWarning = warnings[currentIndex];
  
  const getRiskLevelColor = (level) => {
    switch (level) {
      case '高危': return 'text-red-600 bg-red-100';
      case '中危': return 'text-orange-600 bg-orange-100';
      case '低危': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-green-600';
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      style={{ zIndex: 9999 }}
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-lg max-w-xl w-full max-h-[60vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="flex justify-between items-center p-2 border-b bg-white sticky top-0 z-10">
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold">高危预警详情</h2>
            <div className="flex space-x-1">
              {warnings.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-blue-500' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-lg font-bold w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            ×
          </button>
        </div>
        
        {/* 主要信息卡片 */}
        <div className="p-2">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 p-2 rounded-lg mb-2 border">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className="text-sm font-bold text-gray-800 mb-1">{currentWarning.title}</h3>
                <p className="text-xs text-gray-600 mb-1">{currentWarning.description}</p>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>📍 {currentWarning.location}</span>
                  <span>⏱️ {currentWarning.timeRange}</span>
                  <span>📊 {currentWarning.caseCount} 起</span>
                </div>
              </div>
              <div className="text-right ml-2">
                <div className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(currentWarning.riskLevel)}`}>
                  {currentWarning.riskLevel}
                </div>
                <div className="mt-1">
                  <div className={`text-xl font-bold ${getScoreColor(currentWarning.riskScore)}`}>
                    {currentWarning.riskScore}
                  </div>
                  <div className="text-xs text-gray-500">风险评分</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 风险因子分析 */}
          <div className="space-y-2 mb-2">
            <div className="bg-white border rounded-lg p-2">
              <h4 className="font-bold text-gray-800 mb-2 flex items-center text-xs">
                🔍 风险因子分析
              </h4>
              <div className="space-y-2">
                {currentWarning.factors.slice(0, 3).map((factor, index) => (
                  <div key={index} className="border-b pb-1 last:border-b-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-700 text-xs">{factor.name}</span>
                      <span className={`font-bold text-xs ${getScoreColor(factor.score)}`}>
                        {factor.score}分
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1 mb-1">
                      <div 
                        className={`h-1 rounded-full ${
                          factor.score >= 80 ? 'bg-red-500' : 
                          factor.score >= 60 ? 'bg-orange-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${factor.score}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600">{factor.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 处置建议 */}
            <div className="bg-white border rounded-lg p-2">
              <h4 className="font-bold text-gray-800 mb-2 flex items-center text-xs">
                💡 处置建议
              </h4>
              <div className="space-y-1">
                {currentWarning.suggestions.slice(0, 3).map((suggestion, index) => (
                  <div key={index} className="flex items-start space-x-1">
                    <div className="w-4 h-4 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 text-xs">{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* 相关案件 */}
          <div className="bg-white border rounded-lg p-2">
            <h4 className="font-bold text-gray-800 mb-2 flex items-center text-xs">
              📋 相关案件记录
            </h4>
            <div className="overflow-x-auto">
              <div className="space-y-1">
                {currentWarning.relatedCases.slice(0, 2).map((caseItem, index) => (
                  <div key={index} className="border-b pb-1 last:border-b-0">
                    <div className="flex justify-between items-start text-xs">
                      <div className="flex-1">
                        <div className="font-medium">{caseItem.type}</div>
                        <div className="text-gray-500">{caseItem.time}</div>
                        <div className="text-gray-600">{caseItem.location}</div>
                      </div>
                      <button className="text-blue-500 hover:text-blue-700 text-xs">
                        详情
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* 底部操作 */}
        <div className="border-t p-2 flex justify-between">
          <div className="flex space-x-1">
            <button 
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
            >
              上一个
            </button>
            <button 
              onClick={() => setCurrentIndex(Math.min(warnings.length - 1, currentIndex + 1))}
              disabled={currentIndex === warnings.length - 1}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
            >
              下一个
            </button>
          </div>
          <div className="flex space-x-1">
            <button className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">
              导出报告
            </button>
            <button className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs">
              发起处置
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 预警信息详情评分卡组件
const AlertDetailModal = ({ isOpen, onClose, alert }) => {
  // 处理点击遮罩关闭
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  // 处理ESC键关闭
  React.useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);
  
  if (!isOpen || !alert) return null;
  
  const getRiskLevelColor = (level) => {
    switch (level) {
      case '高危': return 'text-red-600 bg-red-100';
      case '中危': return 'text-orange-600 bg-orange-100';
      case '低危': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-green-600';
  };
  
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case '已处理': return 'text-green-600 bg-green-100';
      case '侦办中': return 'text-orange-600 bg-orange-100';
      case '已立案': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      style={{ zIndex: 9999 }}
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-lg max-w-xl w-full max-h-[60vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="flex justify-between items-center p-2 border-b bg-white sticky top-0 z-10">
          <h2 className="text-base font-bold">预警详情分析</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-lg font-bold w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            ×
          </button>
        </div>
        
        {/* 主要信息卡片 */}
        <div className="p-2">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 p-2 rounded-lg mb-2 border">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className="text-sm font-bold text-gray-800 mb-1">{alert.title}</h3>
                <p className="text-xs text-gray-600 mb-1">{alert.description}</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div>📍 {alert.location}</div>
                  <div>📏 {alert.affectedArea}</div>
                  <div>⏱️ {alert.timeRange}</div>
                  <div>📊 {alert.caseCount} 起</div>
                </div>
              </div>
              <div className="text-right ml-2">
                <div className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(alert.level)}`}>
                  {alert.level}
                </div>
                <div className="mt-1">
                  <div className={`text-xl font-bold ${getScoreColor(alert.riskScore)}`}>
                    {alert.riskScore}
                  </div>
                  <div className="text-xs text-gray-500">风险评分</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 原因分析 */}
          <div className="space-y-2 mb-2">
            <div className="bg-white border rounded-lg p-2">
              <h4 className="font-bold text-gray-800 mb-2 flex items-center text-xs">
                🔍 预警原因分析
              </h4>
              <div className="space-y-2">
                {alert.causes.slice(0, 3).map((cause, index) => (
                  <div key={index} className="border-b pb-1 last:border-b-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-700 text-xs">{cause.factor}</span>
                      <div className="flex items-center space-x-1">
                        <span className={`px-1 py-0.5 rounded-full text-xs ${getSeverityColor(cause.severity)}`}>
                          {cause.severity === 'high' ? '高' : cause.severity === 'medium' ? '中' : '低'}
                        </span>
                        <span className="font-bold text-blue-600 text-xs">{cause.contribution}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">{cause.description}</p>
                  </div>
                ))}
              </div>
            </div>
          
            {/* 事件时间线 */}
            <div className="bg-white border rounded-lg p-2">
              <h4 className="font-bold text-gray-800 mb-2 flex items-center text-xs">
                📅 事件时间线
              </h4>
              <div className="space-y-2">
                {alert.timeline.slice(0, 3).map((day, index) => {
                  // 计算时间线编号：从最老的事件开始编号（倒序）
                  const timelineNumber = Math.min(alert.timeline.length, 3) - index;
                  return (
                    <div key={index} className="relative">
                      <div className="flex items-start space-x-2">
                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {timelineNumber}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-800 text-xs flex items-center space-x-2">
                            <span>{day.date}</span>
                            <span className="bg-red-100 text-red-600 px-1 py-0.5 rounded text-xs">
                              {day.count}起
                            </span>
                          </div>
                          <div className="text-xs text-gray-600">
                            {day.events.slice(0, 2).join('、')}
                          </div>
                        </div>
                      </div>
                      {index < Math.min(alert.timeline.length - 1, 2) && (
                        <div className="absolute left-3 top-6 w-0.5 h-4 bg-gray-200"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* 处置建议和相关案件 */}
          <div className="space-y-2">
            {/* 处置建议 */}
            <div className="bg-white border rounded-lg p-2">
              <h4 className="font-bold text-gray-800 mb-2 flex items-center text-xs">
                💡 处置建议
              </h4>
              <div className="space-y-1">
                {alert.suggestions.slice(0, 3).map((suggestion, index) => (
                  <div key={index} className="flex items-start space-x-1">
                    <div className="w-4 h-4 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 text-xs">{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 相关案件 */}
            <div className="bg-white border rounded-lg p-2">
              <h4 className="font-bold text-gray-800 mb-2 flex items-center text-xs">
                📋 相关案件记录
              </h4>
              <div className="space-y-1">
                {alert.relatedCases.slice(0, 2).map((caseItem, index) => (
                  <div key={index} className="border-b pb-1 last:border-b-0">
                    <div className="flex justify-between items-start text-xs">
                      <div className="flex-1">
                        <div className="font-medium">{caseItem.type}</div>
                        <div className="text-gray-500">{caseItem.time}</div>
                        <div className="text-gray-600">{caseItem.location}</div>
                      </div>
                      <div className={`px-1 py-0.5 rounded-full text-xs ${getStatusColor(caseItem.status)}`}>
                        {caseItem.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* 底部操作 */}
        <div className="border-t p-2 flex justify-between">
          <div className="text-xs text-gray-500">
            发布时间：{alert.publishTime}
          </div>
          <div className="flex space-x-1">
            <button className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">
              生成报告
            </button>
            <button className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs">
              执行处置
            </button>
            <button className="px-2 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 text-xs">
              升级预警
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const OverviewDashboard = () => {
  // 预警详情弹窗状态
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  
  // 预警信息详情弹窗状态
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  
  // 趋势分析选项卡状态
  const [trendTab, setTrendTab] = useState('24h');
  
  // 类型分布选项卡状态
  const [typeTab, setTypeTab] = useState('police');

  // 24小时警情趋势分析数据
  const trend24hData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: '警情量',
        data: [5, 3, 2, 1, 1, 2, 3, 5, 8, 12, 15, 20, 25, 30, 35, 40, 38, 32, 28, 25, 20, 15, 10, 6],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.4,
      },
    ],
  };

  // 7天警情趋势分析数据
  const trend7dData = {
    labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    datasets: [
      {
        label: '警情量',
        data: [128, 142, 135, 156, 168, 185, 172],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.4,
      },
    ],
  };

  // 30天警情趋势分析数据
  const trend30dData = {
    labels: Array.from({ length: 30 }, (_, i) => `${i + 1}日`),
    datasets: [
      {
        label: '警情量',
        data: [
          145, 132, 128, 156, 142, 168, 175, 189, 165, 152,
          138, 147, 159, 172, 185, 178, 162, 149, 156, 168,
          174, 182, 195, 188, 176, 163, 158, 165, 172, 168
        ],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.4,
      },
    ],
  };

  // 按警种分类数据
  const typePoliceData = {
    labels: ['刑事类', '治安类', '交通类', '其他'],
    datasets: [
      {
        data: [35, 25, 20, 20],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  // 按案件类型分类数据
  const typeCaseData = {
    labels: ['盗窃', '诈骗', '交通事故', '纠纷', '噪音', '其他'],
    datasets: [
      {
        data: [28, 18, 20, 15, 12, 7],
        backgroundColor: ['#FF6384', '#FF9F40', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        hoverBackgroundColor: ['#FF6384', '#FF9F40', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  };

  // 按区域分类数据
  const typeAreaData = {
    labels: ['商业区', '居民区', '工业区', '学校周边', '交通枢纽', '其他'],
    datasets: [
      {
        data: [32, 28, 15, 12, 8, 5],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40', '#9966FF'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40', '#9966FF'],
      },
    ],
  };

  // 预警信息数据
  const alertsData = [
    {
      id: 1,
      title: 'XX商圈盗窃案件高发预警',
      level: '高危',
      type: '盗窃案件集中',
      location: 'XX商圈区域',
      publishTime: '2025-05-06 09:30',
      description: '系统检测到XX商圈区域近期盗窃类警情数量明显上升，环比增长35%。建议增派警力巡逻。',
      riskScore: 85,
      timeRange: '近7天',
      affectedArea: '2.5平方公里',
      caseCount: 12,
      trendDirection: '上升',
      causes: [
        {
          factor: '人流量激增',
          description: '商圈客流量环比增长40%，为盗窃活动提供了更多机会',
          contribution: '35%',
          severity: 'high'
        },
        {
          factor: '监控盲区',
          description: '发现商圈周边存在3个监控死角，成为案件高发点',
          contribution: '25%',
          severity: 'medium'
        },
        {
          factor: '巡逻密度不足',
          description: '现有巡逻频次无法覆盖高峰时段的安全需求',
          contribution: '20%',
          severity: 'medium'
        },
        {
          factor: '团伙作案',
          description: '疑似有组织团伙利用人流掩护进行连环作案',
          contribution: '20%',
          severity: 'high'
        }
      ],
      timeline: [
        { date: '2025-05-06', count: 3, events: ['手机被盗', '钱包被盗', '背包被盗'] },
        { date: '2025-05-05', count: 2, events: ['购物袋被盗', '车内物品被盗'] },
        { date: '2025-05-04', count: 2, events: ['手机被盗', '现金被盗'] },
        { date: '2025-05-03', count: 3, events: ['钱包被盗', '手机被盗', '首饰被盗'] },
        { date: '2025-05-02', count: 1, events: ['背包被盗'] },
        { date: '2025-05-01', count: 1, events: ['购物袋被盗'] }
      ],
      suggestions: [
        '在商圈主要出入口增设2个临时警务点',
        '增加便衣警察在14:00-18:00时段巡逻',
        '协调商场保安加强内部巡查',
        '在监控死角增设高清摄像头',
        '发布市民防范提醒公告'
      ],
      relatedCases: [
        { id: 'C001', time: '2025-05-06 15:30', type: '手机被盗', location: 'XX商场北门', suspect: '男性，约25岁', status: '侦办中' },
        { id: 'C002', time: '2025-05-05 16:45', type: '钱包被盗', location: 'XX商场地下停车场', suspect: '女性，约30岁', status: '已处理' },
        { id: 'C003', time: '2025-05-04 14:20', type: '背包被盗', location: 'XX商圈步行街', suspect: '男性，约20岁', status: '已处理' }
      ]
    },
    {
      id: 2,
      title: 'XX小区周边车辆被盗风险提升',
      level: '中危',
      type: '车辆盗窃',
      location: 'XX小区周边',
      publishTime: '2025-05-05 16:45',
      description: 'XX小区周边近一周内发生3起车内财物被盗案件，时间集中在夜间，建议加强夜间巡逻。',
      riskScore: 72,
      timeRange: '近7天',
      affectedArea: '1.2平方公里',
      caseCount: 3,
      trendDirection: '上升',
      causes: [
        {
          factor: '夜间照明不足',
          description: '小区周边停车区域夜间照明设施老化，光线昏暗',
          contribution: '40%',
          severity: 'high'
        },
        {
          factor: '监控设备缺失',
          description: '部分停车区域缺少监控设备或存在故障',
          contribution: '30%',
          severity: 'medium'
        },
        {
          factor: '巡逻时间间隔过长',
          description: '夜间巡逻间隔时间较长，给作案留出时间窗口',
          contribution: '20%',
          severity: 'medium'
        },
        {
          factor: '居民安全意识薄弱',
          description: '部分车主习惯在车内放置贵重物品且未锁车',
          contribution: '10%',
          severity: 'low'
        }
      ],
      timeline: [
        { date: '2025-05-05', count: 1, events: ['车内现金被盗'] },
        { date: '2025-05-03', count: 1, events: ['车内电子设备被盗'] },
        { date: '2025-05-01', count: 1, events: ['车内包裹被盗'] }
      ],
      suggestions: [
        '增加夜间巡逻频次，特别是22:00-06:00时段',
        '协调物业更换或增设照明设备',
        '在重点停车区域增设监控摄像头',
        '开展居民安全防范宣传教育',
        '建立小区安全群防群治机制'
      ],
      relatedCases: [
        { id: 'C004', time: '2025-05-05 23:30', type: '车内现金被盗', location: 'XX小区B栋停车场', suspect: '未知', status: '侦办中' },
        { id: 'C005', time: '2025-05-03 02:15', type: '车内电子设备被盗', location: 'XX小区C栋附近', suspect: '男性，约35岁', status: '已立案' },
        { id: 'C006', time: '2025-05-01 01:45', type: '车内包裹被盗', location: 'XX小区A栋地下车库', suspect: '未知', status: '已处理' }
      ]
    }
  ];

  // 获取当前趋势数据
  const getCurrentTrendData = () => {
    switch (trendTab) {
      case '24h': return trend24hData;
      case '7d': return trend7dData;
      case '30d': return trend30dData;
      default: return trend24hData;
    }
  };

  // 获取当前类型数据
  const getCurrentTypeData = () => {
    switch (typeTab) {
      case 'police': return typePoliceData;
      case 'case': return typeCaseData;
      case 'area': return typeAreaData;
      default: return typePoliceData;
    }
  };

  // 图表配置选项
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 6,
        displayColors: true,
        callbacks: {
          label: function(context) {
            if (context.chart.config.type === 'pie') {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((context.parsed * 100) / total).toFixed(1);
              return `${context.label}: ${context.parsed}起 (${percentage}%)`;
            }
            return `${context.dataset.label}: ${context.parsed}起`;
          }
        }
      }
    },
    scales: trendTab ? {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#666',
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#666',
          font: {
            size: 11
          }
        },
        beginAtZero: true
      }
    } : undefined
  };

  // 饼图配置选项
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12
          },
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              const dataset = data.datasets[0];
              const total = dataset.data.reduce((a, b) => a + b, 0);
              return data.labels.map((label, i) => {
                const value = dataset.data[i];
                const percentage = ((value * 100) / total).toFixed(1);
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: dataset.backgroundColor[i],
                  strokeStyle: dataset.backgroundColor[i],
                  lineWidth: 0,
                  pointStyle: 'circle',
                  hidden: false,
                  index: i
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 6,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed * 100) / total).toFixed(1);
            return `${context.label}: ${context.parsed}起 (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <Layout title="综合态势总览">
      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="bg-white p-4 rounded shadow relative">
          <div className="text-gray-500 text-sm mb-1">今日警情总数</div>
          <div className="text-3xl font-bold mb-2">128</div>
          <div className="flex items-center text-red-500 text-sm">
            <span className="mr-1">↑</span> 12.5% 较昨日
          </div>
          <div className="absolute top-4 right-4 w-12 h-12 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center opacity-20 text-2xl">📊</div>
        </div>
        <div className="bg-white p-4 rounded shadow relative">
          <div className="text-gray-500 text-sm mb-1">警情处置率</div>
          <div className="text-3xl font-bold mb-2">85.7%</div>
          <div className="flex items-center text-green-500 text-sm">
            <span className="mr-1">↑</span> 3.2% 较昨日
          </div>
          <div className="absolute top-4 right-4 w-12 h-12 bg-green-100 text-green-500 rounded-full flex items-center justify-center opacity-20 text-2xl">✓</div>
        </div>
        <div className="bg-white p-4 rounded shadow relative">
          <div className="text-gray-500 text-sm mb-1">平均响应时间</div>
          <div className="text-3xl font-bold mb-2">4.8分钟</div>
          <div className="flex items-center text-green-500 text-sm">
            <span className="mr-1">↓</span> 8.6% 较昨日
          </div>
          <div className="absolute top-4 right-4 w-12 h-12 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center opacity-20 text-2xl">⏱️</div>
        </div>
        <div className="bg-white p-4 rounded shadow relative cursor-pointer hover:shadow-lg transition-shadow"
             onClick={() => setIsWarningModalOpen(true)}>
          <div className="text-gray-500 text-sm mb-1">活跃预警</div>
          <div className="text-3xl font-bold mb-2">18</div>
          <div className="flex items-center text-orange-500 text-sm">
            <span>⚠️</span> 高危预警 5 个
          </div>
          <div className="text-xs text-blue-500 mt-2">点击查看详情</div>
          <div className="absolute top-4 right-4 w-12 h-12 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center opacity-20 text-2xl">⚠️</div>
        </div>
      </div>

      {/* 警情热力分布和实时警情列表 */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* 警情热力分布 - 占2/3宽度 */}
        <div className="col-span-2 bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold">警情热力分布</h2>
            <div className="flex">
              <div className="mr-2 text-blue-500 text-sm cursor-pointer">今日</div>
              <div className="mr-2 text-gray-400 text-sm cursor-pointer">本周</div>
              <div className="text-gray-400 text-sm cursor-pointer">本月</div>
            </div>
          </div>
          <div className="relative h-96">
            <MapContainer
              center={[39.9042, 116.4074]} // 设置地图中心点（北京为例）
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <HeatmapLayer points={heatmapData} />
            </MapContainer>
          </div>
        </div>

        {/* 实时警情列表 - 占1/3宽度 */}
        <div className="col-span-1 bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold">实时警情</h2>
            <div className="text-blue-500 text-sm cursor-pointer">查看全部</div>
          </div>
          <div className="overflow-y-auto h-96">
            <div className="border-b py-3">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-red-500 mr-3"></div>
                <div className="flex-1">
                  <div className="font-medium">XX商圈手机被盗警情</div>
                  <div className="text-xs text-gray-500 mt-1">
                    地点：XX商场附近 | 时间：14:25
                  </div>
                </div>
                <div className="text-xs text-gray-400">5分钟前</div>
              </div>
            </div>
            <div className="border-b py-3">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-orange-500 mr-3"></div>
                <div className="flex-1">
                  <div className="font-medium">XX路口交通事故</div>
                  <div className="text-xs text-gray-500 mt-1">
                    地点：XX路与XX街交叉口 | 时间：14:10
                  </div>
                </div>
                <div className="text-xs text-gray-400">20分钟前</div>
              </div>
            </div>
            <div className="border-b py-3">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                <div className="flex-1">
                  <div className="font-medium">XX小区噪音扰民</div>
                  <div className="text-xs text-gray-500 mt-1">
                    地点：XX小区3栋 | 时间：13:45
                  </div>
                </div>
                <div className="text-xs text-gray-400">45分钟前</div>
              </div>
            </div>
            <div className="border-b py-3">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-orange-500 mr-3"></div>
                <div className="flex-1">
                  <div className="font-medium">XX广场扰序事件</div>
                  <div className="text-xs text-gray-500 mt-1">
                    地点：XX广场南门 | 时间：13:30
                  </div>
                </div>
                <div className="text-xs text-gray-400">1小时前</div>
              </div>
            </div>
            <div className="border-b py-3">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-red-500 mr-3"></div>
                <div className="flex-1">
                  <div className="font-medium">XX银行可疑人员报警</div>
                  <div className="text-xs text-gray-500 mt-1">
                    地点：XX银行XX支行 | 时间：13:15
                  </div>
                </div>
                <div className="text-xs text-gray-400">1小时前</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 警情趋势和类型分布 */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold">警情趋势分析</h2>
            <div className="flex">
              <div 
                className={`px-2 py-1 cursor-pointer ${trendTab === '24h' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'}`}
                onClick={() => setTrendTab('24h')}
              >
                24小时
              </div>
              <div 
                className={`px-2 py-1 cursor-pointer ${trendTab === '7d' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'}`}
                onClick={() => setTrendTab('7d')}
              >
                7天
              </div>
              <div 
                className={`px-2 py-1 cursor-pointer ${trendTab === '30d' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'}`}
                onClick={() => setTrendTab('30d')}
              >
                30天
              </div>
            </div>
          </div>
          <div className="h-64">
            <Line data={getCurrentTrendData()} options={chartOptions} />
          </div>
          {/* 趋势分析统计信息 */}
          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            {trendTab === '24h' && (
              <>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-medium text-gray-700">高峰时段</div>
                  <div className="text-lg font-bold text-red-600">15:00-17:00</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-medium text-gray-700">平均警情量</div>
                  <div className="text-lg font-bold text-blue-600">18起/小时</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-medium text-gray-700">环比昨日</div>
                  <div className="text-lg font-bold text-green-600">+12.5%</div>
                </div>
              </>
            )}
            {trendTab === '7d' && (
              <>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-medium text-gray-700">高峰日期</div>
                  <div className="text-lg font-bold text-red-600">周六</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-medium text-gray-700">日均警情量</div>
                  <div className="text-lg font-bold text-blue-600">155起/天</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-medium text-gray-700">环比上周</div>
                  <div className="text-lg font-bold text-orange-600">+8.3%</div>
                </div>
              </>
            )}
            {trendTab === '30d' && (
              <>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-medium text-gray-700">最高峰值</div>
                  <div className="text-lg font-bold text-red-600">195起</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-medium text-gray-700">月均警情量</div>
                  <div className="text-lg font-bold text-blue-600">165起/天</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-medium text-gray-700">环比上月</div>
                  <div className="text-lg font-bold text-green-600">-3.2%</div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold">警情类型分布</h2>
            <div className="flex">
              <div 
                className={`px-2 py-1 cursor-pointer ${typeTab === 'police' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'}`}
                onClick={() => setTypeTab('police')}
              >
                按警种
              </div>
              <div 
                className={`px-2 py-1 cursor-pointer ${typeTab === 'case' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'}`}
                onClick={() => setTypeTab('case')}
              >
                按案件
              </div>
              <div 
                className={`px-2 py-1 cursor-pointer ${typeTab === 'area' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'}`}
                onClick={() => setTypeTab('area')}
              >
                按区域
              </div>
            </div>
          </div>
          <div className="h-64">
            <Pie data={getCurrentTypeData()} options={pieChartOptions} />
          </div>
          {/* 类型分布统计信息 */}
          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            {typeTab === 'police' && (
              <>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-medium text-gray-700">主要类型</div>
                  <div className="text-lg font-bold text-red-600">刑事类</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-medium text-gray-700">占比最高</div>
                  <div className="text-lg font-bold text-blue-600">35%</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-medium text-gray-700">增长最快</div>
                  <div className="text-lg font-bold text-orange-600">治安类</div>
                </div>
              </>
            )}
            {typeTab === 'case' && (
              <>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-medium text-gray-700">高发案件</div>
                  <div className="text-lg font-bold text-red-600">盗窃</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-medium text-gray-700">案件总数</div>
                  <div className="text-lg font-bold text-blue-600">100起</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-medium text-gray-700">破案率</div>
                  <div className="text-lg font-bold text-green-600">85.7%</div>
                </div>
              </>
            )}
            {typeTab === 'area' && (
              <>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-medium text-gray-700">热点区域</div>
                  <div className="text-lg font-bold text-red-600">商业区</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-medium text-gray-700">覆盖区域</div>
                  <div className="text-lg font-bold text-blue-600">6个</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-medium text-gray-700">风险等级</div>
                  <div className="text-lg font-bold text-orange-600">中高</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 预警信息和热点区域 */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold">预警信息</h2>
            <div className="text-blue-500 text-sm cursor-pointer hover:text-blue-700 transition-colors"
                 onClick={() => {
                   // 显示第一个预警作为示例
                   setSelectedAlert(alertsData[0]);
                   setIsAlertModalOpen(true);
                 }}>
              查看全部
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r cursor-pointer hover:bg-red-100 transition-colors"
                 onClick={() => {
                   setSelectedAlert(alertsData[0]);
                   setIsAlertModalOpen(true);
                 }}>
              <div className="flex justify-between mb-1">
                <div className="font-medium flex items-center text-red-600">
                  <span className="mr-1">⚠️</span> XX商圈盗窃案件高发预警
                </div>
                <div className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">高危</div>
              </div>
              <div className="text-sm mb-2">
                系统检测到XX商圈区域近期盗窃类警情数量明显上升，环比增长35%。建议增派警力巡逻。
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <div>发布时间：2025-05-06 09:30</div>
                <div className="text-blue-500 hover:text-blue-700 transition-colors">点击查看详情</div>
              </div>
            </div>
            <div className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded-r cursor-pointer hover:bg-orange-100 transition-colors"
                 onClick={() => {
                   setSelectedAlert(alertsData[1]);
                   setIsAlertModalOpen(true);
                 }}>
              <div className="flex justify-between mb-1">
                <div className="font-medium flex items-center text-orange-600">
                  <span className="mr-1">⚠️</span> XX小区周边车辆被盗风险提升
                </div>
                <div className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">中危</div>
              </div>
              <div className="text-sm mb-2">
                XX小区周边近一周内发生3起车内财物被盗案件，时间集中在夜间，建议加强夜间巡逻。
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <div>发布时间：2025-05-05 16:45</div>
                <div className="text-blue-500 hover:text-blue-700 transition-colors">点击查看详情</div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold">热点区域分析</h2>
            <div className="text-blue-500 text-sm cursor-pointer">查看全部</div>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left font-medium text-gray-500">区域名称</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500">警情数</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500">主要类型</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500">风险等级</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-3">XX商圈</td>
                <td className="px-4 py-3">32</td>
                <td className="px-4 py-3">盗窃</td>
                <td className="px-4 py-3"><span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">高</span></td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-3">XX路口</td>
                <td className="px-4 py-3">28</td>
                <td className="px-4 py-3">交通事故</td>
                <td className="px-4 py-3"><span className="bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full">中</span></td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-3">XX广场</td>
                <td className="px-4 py-3">24</td>
                <td className="px-4 py-3">扰序</td>
                <td className="px-4 py-3"><span className="bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full">中</span></td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-3">XX小区</td>
                <td className="px-4 py-3">19</td>
                <td className="px-4 py-3">噪音</td>
                <td className="px-4 py-3"><span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">低</span></td>
              </tr>
              <tr>
                <td className="px-4 py-3">XX学校周边</td>
                <td className="px-4 py-3">15</td>
                <td className="px-4 py-3">打架斗殴</td>
                <td className="px-4 py-3"><span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">低</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 时间分布热力图 */}
      <div className="mb-4">
        <TimeHeatmap />
      </div>
      
      {/* 预警详情弹窗 */}
      <WarningDetailModal 
        isOpen={isWarningModalOpen}
        onClose={() => setIsWarningModalOpen(false)}
        warnings={highRiskWarnings}
      />
      
      {/* 预警信息详情弹窗 */}
      <AlertDetailModal 
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        alert={selectedAlert}
      />
    </Layout>
  );
};

export default OverviewDashboard;