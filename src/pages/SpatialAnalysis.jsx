import React, { useEffect, useState, useRef } from 'react';
import Layout from '../components/Layout';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.heat'; // 引入 leaflet.heat 的方式
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ScatterChart, Scatter, Cell } from 'recharts';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const SpatialAnalysis = () => {
  const [mapView, setMapView] = useState('heatmap');
  const [timeRange, setTimeRange] = useState('today');
  const [areaTab, setAreaTab] = useState('hotspot');
  const [roadTab, setRoadTab] = useState('accident');
  const [selectedArea, setSelectedArea] = useState(null);
  const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);
  const mapRef = useRef(null);

  const areaData = [
    { id: 1, name: 'XX商圈', count: 32, type: '盗窃', risk: 'high', latitude: 31.22, longitude: 121.47 },
    { id: 2, name: 'XX路口', count: 28, type: '交通事故', risk: 'medium', latitude: 31.20, longitude: 121.45 },
    { id: 3, name: 'XX广场', count: 24, type: '扰序', risk: 'medium', latitude: 31.23, longitude: 121.48 },
    { id: 4, name: 'XX小区', count: 19, type: '噪音', risk: 'low', latitude: 31.21, longitude: 121.46 },
    { id: 5, name: 'XX学校周边', count: 15, type: '打架斗殴', risk: 'low', latitude: 31.24, longitude: 121.49 }
  ];

  // 添加路网分析数据
  const accidentData = [
    { name: '解放路-东段', value: 28, riskLevel: '高', color: '#EF4444' },
    { name: '人民大道-中段', value: 24, riskLevel: '高', color: '#EF4444' },
    { name: '建设街-南段', value: 19, riskLevel: '中', color: '#F97316' },
    { name: '环城路-北段', value: 16, riskLevel: '中', color: '#F97316' },
    { name: '文化大道-西段', value: 12, riskLevel: '低', color: '#10B981' },
    { name: '滨江路-全段', value: 8, riskLevel: '低', color: '#10B981' }
  ];

  const densityData = [
    { name: '解放路', density: 85, incidents: 42 },
    { name: '人民大道', density: 78, incidents: 38 },
    { name: '建设街', density: 65, incidents: 31 },
    { name: '环城路', density: 52, incidents: 25 },
    { name: '文化大道', density: 45, incidents: 22 },
    { name: '滨江路', density: 38, incidents: 18 },
    { name: '商业街', density: 72, incidents: 35 },
    { name: '学院路', density: 41, incidents: 20 }
  ];

  const intersectionData = [
    { name: '解放路×人民大道', x: 85, y: 92, size: 450, risk: '极高' },
    { name: '建设街×环城路', x: 72, y: 78, size: 380, risk: '高' },
    { name: '文化大道×滨江路', x: 58, y: 65, size: 320, risk: '中' },
    { name: '商业街×学院路', x: 45, y: 52, size: 280, risk: '中' },
    { name: '工业路×科技街', x: 32, y: 38, size: 220, risk: '低' },
    { name: '新华路×向阳街', x: 25, y: 28, size: 180, risk: '低' }
  ];

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 高风险区域详情数据
  const highRiskAreasData = [
    {
      id: 1,
      name: 'XX商圈',
      type: '商业集中区',
      riskLevel: '高危',
      riskScore: 88,
      location: '市中心商业区',
      area: '2.5平方公里',
      population: '约15万人流量/日',
      caseCount: 32,
      mainType: '盗窃类',
      timeRange: '近30天',
      factors: [
        { name: '人流密度', score: 92, description: '日均15万人次，远超安全阈值' },
        { name: '案件频率', score: 85, description: '近30天发生32起，环比增长28%' },
        { name: '监控覆盖', score: 65, description: '覆盖率75%，存在监控盲区' },
        { name: '警力配置', score: 72, description: '现有警力配置略显不足' }
      ],
      suggestions: [
        '在主要商圈出入口增设2个临时警务点',
        '增加便衣警察在高峰时段巡逻',
        '协调商场保安加强内部巡查',
        '在监控盲区增设高清摄像头',
        '建立商户联防机制和快速响应体系'
      ],
      recentIncidents: [
        { time: '2025-05-06 15:30', location: 'XX商场北门', type: '手机被盗', status: '已处理' },
        { time: '2025-05-05 16:45', location: 'XX商场地下停车场', type: '车内物品被盗', status: '侦办中' },
        { time: '2025-05-04 14:20', location: 'XX商圈步行街', type: '钱包被盗', status: '已处理' },
        { time: '2025-05-03 17:10', location: 'XX购物中心', type: '扒窃', status: '已处理' }
      ],
      environmentFactors: {
        businessDensity: 85,
        populationDensity: 92,
        trafficFlow: 88,
        lightingCondition: 70,
        securityLevel: 65
      }
    },
    {
      id: 2,
      name: 'XX路口',
      type: '交通枢纽区',
      riskLevel: '高危',
      riskScore: 82,
      location: '城市主干道交叉口',
      area: '0.8平方公里',
      population: '约8万车流量/日',
      caseCount: 28,
      mainType: '交通事故',
      timeRange: '近30天',
      factors: [
        { name: '交通流量', score: 90, description: '日均8万车次，超饱和状态' },
        { name: '事故频率', score: 85, description: '近30天发生28起事故' },
        { name: '道路条件', score: 75, description: '路面状况良好，标线清晰' },
        { name: '信号配时', score: 68, description: '高峰期配时需要优化' }
      ],
      suggestions: [
        '优化信号灯配时，延长高峰期绿灯时间',
        '在路口增设LED警示标志',
        '早晚高峰增派交警现场指挥',
        '设置更多减速带和警示标线',
        '建立实时交通监控和预警系统'
      ],
      recentIncidents: [
        { time: '2025-05-06 08:15', location: 'XX路口南侧', type: '追尾事故', status: '已处理' },
        { time: '2025-05-05 17:30', location: 'XX路口东侧', type: '刮擦事故', status: '已处理' },
        { time: '2025-05-04 07:45', location: 'XX路口北侧', type: '追尾事故', status: '已处理' },
        { time: '2025-05-03 18:20', location: 'XX路口西侧', type: '轻微碰撞', status: '已处理' }
      ],
      environmentFactors: {
        trafficFlow: 90,
        roadCondition: 75,
        signalSystem: 68,
        visibilityLevel: 80,
        weatherImpact: 85
      }
    },
    {
      id: 3,
      name: 'XX夜市',
      type: '娱乐休闲区',
      riskLevel: '中危',
      riskScore: 75,
      location: '老城区夜市街道',
      area: '1.2平方公里',
      population: '约3万人流量/夜',
      caseCount: 24,
      mainType: '治安事件',
      timeRange: '近30天',
      factors: [
        { name: '夜间人流', score: 80, description: '夜间人流密集，管理复杂' },
        { name: '治安状况', score: 70, description: '偶发治安事件，整体可控' },
        { name: '环境秩序', score: 75, description: '摊位管理有序，但噪音较大' },
        { name: '应急响应', score: 72, description: '应急处置能力较好' }
      ],
      suggestions: [
        '增加夜间巡逻警力和频次',
        '协调夜市管理方加强秩序维护',
        '在主要通道增设监控探头',
        '建立商户联防机制',
        '设置应急处置点和报警设备'
      ],
      recentIncidents: [
        { time: '2025-05-05 22:30', location: 'XX夜市C区', type: '酒后滋事', status: '已处理' },
        { time: '2025-05-04 23:15', location: 'XX夜市入口', type: '商贩纠纷', status: '已调解' },
        { time: '2025-05-03 21:45', location: 'XX夜市B区', type: '钱包被盗', status: '侦办中' },
        { time: '2025-05-02 22:50', location: 'XX夜市停车场', type: '车辆刮擦', status: '已处理' }
      ],
      environmentFactors: {
        crowdDensity: 80,
        noiseLevel: 85,
        lightingCondition: 65,
        managementLevel: 72,
        securityPatrol: 70
      }
    }
  ];

  // 区域风险详情评分卡组件
  const AreaRiskDetailModal = ({ isOpen, onClose, areasData }) => {
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
    if (!isOpen || !areasData || areasData.length === 0) return null;
    
    const currentArea = areasData[currentIndex];
    
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
    
    const getStatusColor = (status) => {
      switch (status) {
        case '已处理': return 'text-green-600 bg-green-100';
        case '侦办中': return 'text-orange-600 bg-orange-100';
        case '已调解': return 'text-blue-600 bg-blue-100';
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
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold">高风险区域详情</h2>
              <div className="flex space-x-1">
                {areasData.map((_, index) => (
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
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-2 rounded mb-2 border">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-gray-800 mb-1">{currentArea.name}</h3>
                  <p className="text-xs text-gray-600 mb-1">{currentArea.location} · {currentArea.type}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                    <div>📍 {currentArea.area}</div>
                    <div>👥 {currentArea.population}</div>
                    <div>⏱️ {currentArea.timeRange}</div>
                    <div>📊 {currentArea.caseCount} 起</div>
                  </div>
                </div>
                <div className="text-right ml-2">
                  <div className={`inline-block px-1.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(currentArea.riskLevel)}`}>
                    {currentArea.riskLevel}
                  </div>
                  <div className="mt-1">
                    <div className={`text-xl font-bold ${getScoreColor(currentArea.riskScore)}`}>
                      {currentArea.riskScore}
                    </div>
                    <div className="text-xs text-gray-500">风险评分</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 风险因子分析和处置建议 */}
            <div className="grid grid-cols-1 gap-2 mb-2">
              <div className="bg-white border rounded p-2">
                <h4 className="font-bold text-gray-800 mb-2 flex items-center text-xs">
                  🔍 风险因子分析
                </h4>
                <div className="space-y-2">
                  {currentArea.factors.map((factor, index) => (
                    <div key={index} className="border-b pb-1 last:border-b-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-gray-700 text-xs">{factor.name}</span>
                        <span className={`font-bold text-xs ${getScoreColor(factor.score)}`}>
                          {factor.score}分
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div 
                          className={`h-1 rounded-full ${
                            factor.score >= 80 ? 'bg-red-500' : 
                            factor.score >= 60 ? 'bg-orange-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${factor.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 处置建议 */}
              <div className="bg-white border rounded p-2">
                <h4 className="font-bold text-gray-800 mb-2 flex items-center text-xs">
                  💡 防控建议
                </h4>
                <div className="space-y-1">
                  {currentArea.suggestions.slice(0, 3).map((suggestion, index) => (
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
            
            {/* 环境因子和近期案件 - 改为单列布局 */}
            <div className="space-y-2">
              {/* 环境因子评估 */}
              <div className="bg-white border rounded p-2">
                <h4 className="font-bold text-gray-800 mb-2 flex items-center text-xs">
                  🌍 环境因子评估
                </h4>
                <div className="grid grid-cols-2 gap-1">
                  {Object.entries(currentArea.environmentFactors).slice(0, 4).map(([key, value], index) => {
                    const factorNames = {
                      businessDensity: '商业密度',
                      populationDensity: '人口密度',
                      trafficFlow: '交通流量',
                      lightingCondition: '照明条件',
                      securityLevel: '安防水平',
                      roadCondition: '道路状况',
                      signalSystem: '信号系统',
                      visibilityLevel: '能见度',
                      weatherImpact: '天气影响',
                      crowdDensity: '人群密度',
                      noiseLevel: '噪音水平',
                      managementLevel: '管理水平',
                      securityPatrol: '安保巡逻'
                    };
                    return (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-xs text-gray-700">{factorNames[key] || key}</span>
                        <div className="flex items-center space-x-1">
                          <div className="w-12 bg-gray-200 rounded-full h-1">
                            <div 
                              className={`h-1 rounded-full ${
                                value >= 80 ? 'bg-red-500' : 
                                value >= 60 ? 'bg-orange-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${value}%` }}
                            />
                          </div>
                          <span className={`text-xs font-medium ${getScoreColor(value)}`}>
                            {value}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* 近期案件记录 */}
              <div className="bg-white border rounded p-2">
                <h4 className="font-bold text-gray-800 mb-2 flex items-center text-xs">
                  📋 近期案件记录
                </h4>
                <div className="space-y-1">
                  {currentArea.recentIncidents.slice(0, 3).map((incident, index) => (
                    <div key={index} className="border-b pb-1 last:border-b-0">
                      <div className="flex justify-between items-start">
                        <div className="text-xs font-medium text-gray-800">{incident.type}</div>
                        <div className={`px-1 py-0.5 rounded text-xs ${getStatusColor(incident.status)}`}>
                          {incident.status}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">{incident.time}</div>
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
                onClick={() => setCurrentIndex(Math.min(areasData.length - 1, currentIndex + 1))}
                disabled={currentIndex === areasData.length - 1}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
              >
                下一个
              </button>
            </div>
            <div className="flex space-x-1">
              <button className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">
                生成报告
              </button>
              <button className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs">
                制定方案
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 渲染路网分析图表
  const renderRoadChart = () => {
    switch (roadTab) {
      case 'accident':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={accidentData} margin={{ top: 10, right: 10, left: 15, bottom: 45 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={40}
                fontSize={11}
                interval={0}
                tick={{ fontSize: 11 }}
                axisLine={{ stroke: '#d0d0d0' }}
                tickLine={{ stroke: '#d0d0d0' }}
              />
              <YAxis 
                label={{ value: '警情数量', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                tick={{ fontSize: 11 }}
                axisLine={{ stroke: '#d0d0d0' }}
                tickLine={{ stroke: '#d0d0d0' }}
              />
              <Tooltip 
                formatter={(value, name) => [value + ' 起', '警情数量']}
                labelFormatter={(label) => `路段: ${label}`}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.98)',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="value" name="警情数量" radius={[2, 2, 0, 0]}>
                {accidentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'density':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={densityData} margin={{ top: 10, right: 15, left: 15, bottom: 45 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={40}
                fontSize={11}
                interval={0}
                tick={{ fontSize: 11 }}
                axisLine={{ stroke: '#d0d0d0' }}
                tickLine={{ stroke: '#d0d0d0' }}
              />
              <YAxis 
                yAxisId="left"
                label={{ value: '密度指数', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                tick={{ fontSize: 11 }}
                axisLine={{ stroke: '#3B82F6' }}
                tickLine={{ stroke: '#3B82F6' }}
                domain={[0, 100]}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                label={{ value: '警情数量', angle: 90, position: 'insideRight', style: { textAnchor: 'middle' } }}
                tick={{ fontSize: 11 }}
                axisLine={{ stroke: '#EF4444' }}
                tickLine={{ stroke: '#EF4444' }}
                domain={[0, 50]}
              />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'density') return [value, '密度指数'];
                  return [value + ' 起', '警情数量'];
                }}
                labelFormatter={(label) => `路段: ${label}`}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.98)',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="density" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4, stroke: '#fff' }}
                activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2, fill: '#fff' }}
                name="density"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="incidents" 
                stroke="#EF4444" 
                strokeWidth={3}
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 4, stroke: '#fff' }}
                activeDot={{ r: 6, stroke: '#EF4444', strokeWidth: 2, fill: '#fff' }}
                name="incidents"
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'intersect':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 10, bottom: 35, left: 15 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="交通流量"
                label={{ value: '交通流量指数', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle' } }}
                tick={{ fontSize: 11 }}
                axisLine={{ stroke: '#d0d0d0' }}
                tickLine={{ stroke: '#d0d0d0' }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="警情频率"
                label={{ value: '警情频率指数', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                tick={{ fontSize: 11 }}
                axisLine={{ stroke: '#d0d0d0' }}
                tickLine={{ stroke: '#d0d0d0' }}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                formatter={(value, name) => {
                  if (name === 'x') return [value, '交通流量指数'];
                  if (name === 'y') return [value, '警情频率指数'];
                  return [value, '风险等级'];
                }}
                labelFormatter={(label, payload) => {
                  if (payload && payload.length > 0) {
                    const data = payload[0].payload;
                    return `交叉口: ${data.name}`;
                  }
                  return label;
                }}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.98)',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Scatter name="交叉口" data={intersectionData} fill="#8884d8">
                {intersectionData.map((entry, index) => {
                  let color = '#10B981'; // 绿色-低
                  if (entry.risk === '极高') color = '#DC2626';
                  else if (entry.risk === '高') color = '#EF4444';
                  else if (entry.risk === '中') color = '#F97316';
                  
                  return (
                    <Cell key={`cell-${index}`} fill={color} />
                  );
                })}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  useEffect(() => {
    if (mapView === 'heatmap' && mapRef.current) {
      // 清除之前的图层
      mapRef.current.eachLayer(layer => {
        if (layer instanceof L.HeatLayer) {
          mapRef.current.removeLayer(layer);
        }
        if (layer instanceof L.Circle) {
          mapRef.current.removeLayer(layer);
        }
      });

      // 模拟热力图数据
      const generateMockData = () => {
        const data = [];
        for (let i = 0; i < 500; i++) {
          const latitude = 31.1043 + Math.random() * 0.2;
          const longitude = 121.3614 + Math.random() * 0.2;
          const intensity = Math.random();
          data.push([latitude, longitude, intensity]);
        }
        return data;
      };

      const heatData = generateMockData();

      // 创建热力图层
      const heatLayer = L.heatLayer(heatData, {
        radius: 25,
        blur: 15,
        maxZoom: 13,
      });

      // 添加热力图层到地图
      heatLayer.addTo(mapRef.current);

      // 添加高发区域
      areaData.forEach(area => {
        L.circle([area.latitude, area.longitude], {
          radius: area.count * 5, // 半径根据警情数调整
          fillColor: 'red',
          fillOpacity: 0.3,
          stroke: false,
        }).addTo(mapRef.current);
      });
    }
  }, [mapView, areaData]);

  return (
    <Layout title="空间维度分析">
      {/* 地图控制面板 */}
      <div className="bg-white p-4 mb-4 rounded shadow">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-gray-500 mb-2">地图视图</div>
            <div className="flex border rounded overflow-hidden">
              <div 
                className={`px-3 py-2 text-sm cursor-pointer flex-1 text-center ${mapView === 'heatmap' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                onClick={() => setMapView('heatmap')}
              >
                热力图
              </div>
              <div 
                className={`px-3 py-2 text-sm cursor-pointer flex-1 text-center ${mapView === 'cluster' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                onClick={() => setMapView('cluster')}
              >
                聚类图
              </div>
              <div 
                className={`px-3 py-2 text-sm cursor-pointer flex-1 text-center ${mapView === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                onClick={() => setMapView('grid')}
              >
                网格图
              </div>
            </div>
          </div>
          
          <div>
            <div className="text-sm text-gray-500 mb-2">时间范围</div>
            <div className="flex border rounded overflow-hidden">
              <div 
                className={`px-3 py-2 text-sm cursor-pointer flex-1 text-center ${timeRange === 'today' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                onClick={() => setTimeRange('today')}
              >
                今日
              </div>
              <div 
                className={`px-3 py-2 text-sm cursor-pointer flex-1 text-center ${timeRange === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                onClick={() => setTimeRange('week')}
              >
                本周
              </div>
              <div 
                className={`px-3 py-2 text-sm cursor-pointer flex-1 text-center ${timeRange === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                onClick={() => setTimeRange('month')}
              >
                本月
              </div>
              <div 
                className={`px-3 py-2 text-sm cursor-pointer flex-1 text-center ${timeRange === 'year' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                onClick={() => setTimeRange('year')}
              >
                全年
              </div>
            </div>
          </div>
          
          <div>
            <div className="text-sm text-gray-500 mb-2">警情类型</div>
            <select className="w-full p-2 border rounded bg-gray-100">
              <option value="all">全部警情</option>
              <option value="theft">盗窃警情</option>
              <option value="traffic">交通警情</option>
              <option value="dispute">纠纷警情</option>
              <option value="noise">噪音警情</option>
              <option value="other">其他警情</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* 地图主视图 */}
      <div className="bg-white p-4 mb-4 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">警情空间分布</h2>
          <div className="flex items-center">
            <div className="px-2 py-1 bg-gray-100 rounded text-sm mr-2">
              显示: {timeRange === 'today' ? '今日' : timeRange === 'week' ? '本周' : timeRange === 'month' ? '本月' : '全年'}
            </div>
            <div className="px-2 py-1 bg-gray-100 rounded text-sm">
              视图: {mapView === 'heatmap' ? '热力图' : mapView === 'cluster' ? '聚类图' : '网格图'}
            </div>
          </div>
        </div>
        
        <div className="relative h-96 rounded mb-3">
          {/* 地图占位区 - 实际应用中会使用真实地图组件 */}
          <MapContainer
            center={[31.2043, 121.4614]}
            zoom={12}
            style={{ height: '100%', width: '100%' }}
            whenCreated={(map) => {
              mapRef.current = map;
            }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </MapContainer>
          
          {/* 地图控件 */}
          <div className="absolute top-2 right-2 bg-white p-1 rounded shadow">
            <div className="p-1 cursor-pointer">➕</div>
            <div className="p-1 cursor-pointer">➖</div>
            <div className="p-1 cursor-pointer">🔍</div>
          </div>
          
          {/* 地图图例 */}
          {mapView !== 'heatmap' && (
            <div className="absolute bottom-2 left-2 bg-white p-2 rounded shadow text-xs">
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                <span>高密度警情区</span>
              </div>
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 rounded-full bg-orange-500 mr-1"></div>
                <span>中密度警情区</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                <span>低密度警情区</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="p-2 bg-gray-50 rounded">
            <div className="text-2xl font-bold">{timeRange === 'today' ? '12' : timeRange === 'week' ? '32' : timeRange === 'month' ? '56' : '128'}</div>
            <div className="text-sm text-gray-500">热点区域</div>
          </div>
          <div className="p-2 bg-gray-50 rounded cursor-pointer hover:shadow-lg transition-shadow relative"
               onClick={() => setIsRiskModalOpen(true)}>
            <div className="text-2xl font-bold text-red-500">5</div>
            <div className="text-sm text-gray-500">高风险区域</div>
            <div className="text-xs text-blue-500 mt-1">点击查看详情</div>
            <div className="absolute top-2 right-2 w-8 h-8 bg-red-100 text-red-500 rounded-full flex items-center justify-center opacity-20 text-lg">⚠️</div>
          </div>
          <div className="p-2 bg-gray-50 rounded">
            <div className="text-2xl font-bold">42.5%</div>
            <div className="text-sm text-gray-500">热点警情占比</div>
          </div>
          <div className="p-2 bg-gray-50 rounded">
            <div className="text-2xl font-bold">3</div>
            <div className="text-sm text-gray-500">新增热点</div>
          </div>
        </div>
      </div>
      
      {/* 热点区域分析 */}
      <div className="bg-white p-4 mb-4 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">区域特征分析</h2>
          <div className="flex">
            <div 
              className={`px-3 py-1 text-sm cursor-pointer ${areaTab === 'hotspot' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
              onClick={() => setAreaTab('hotspot')}
            >
              热点区域
            </div>
            <div 
              className={`px-3 py-1 text-sm cursor-pointer ${areaTab === 'feature' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
              onClick={() => setAreaTab('feature')}
            >
              区域特征
            </div>
            <div 
              className={`px-3 py-1 text-sm cursor-pointer ${areaTab === 'compare' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
              onClick={() => setAreaTab('compare')}
            >
              区域对比
            </div>
          </div>
        </div>
        
        {areaTab === 'hotspot' && (
          <div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left font-medium text-gray-500">区域名称</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">警情数</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">主要类型</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">风险等级</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">操作</th>
                </tr>
              </thead>
              <tbody>
                {areaData.map(area => (
                  <tr key={area.id} className="border-b">
                    <td className="px-4 py-3">{area.name}</td>
                    <td className="px-4 py-3">{area.count}</td>
                    <td className="px-4 py-3">{area.type}</td>
                    <td className="px-4 py-3">
                      <span className={`${getRiskColor(area.risk)} text-xs px-2 py-0.5 rounded-full`}>
                        {area.risk === 'high' ? '高' : area.risk === 'medium' ? '中' : '低'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button 
                        className="bg-blue-50 text-blue-500 text-xs px-2 py-1 rounded"
                        onClick={() => setSelectedArea(area)}
                      >
                        详情
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {areaTab === 'feature' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-500 mb-2">区域特征雷达图</div>
                <div className="text-sm text-gray-400">展示区域警情的多维度特征</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-blue-50 p-3 rounded">
                <h3 className="font-medium mb-2">区域特征总结</h3>
                <ul className="list-disc pl-5 text-sm space-y-2">
                  <li>商业区警情集中在白天和傍晚时段</li>
                  <li>居民区噪音投诉在夜间20:00-23:00最多</li>
                  <li>交通枢纽周边交通警情在早晚高峰集中</li>
                  <li>学校周边打架斗殴警情在放学时段高发</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-3 rounded">
                <h3 className="font-medium mb-2">环境关联因素</h3>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>人口密度与警情数量呈正相关</li>
                  <li>商铺密度与盗窃警情量存在强相关性</li>
                  <li>娱乐场所数量与治安事件关联度高</li>
                  <li>道路拥堵程度与交通事故频率关联明显</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {areaTab === 'compare' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-500 mb-2">区域警情对比图</div>
                <div className="text-sm text-gray-400">比较不同区域的警情特征</div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded">
              <h3 className="font-medium mb-3">区域对比结果</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-2 rounded shadow-sm">
                  <div className="text-sm font-medium mb-1">商业区 vs 居民区</div>
                  <div className="text-xs text-gray-500">
                    商业区盗窃类警情是居民区的2.8倍，居民区噪音纠纷是商业区的3.5倍
                  </div>
                </div>
                <div className="bg-white p-2 rounded shadow-sm">
                  <div className="text-sm font-medium mb-1">老城区 vs 新城区</div>
                  <div className="text-xs text-gray-500">
                    老城区总体警情密度高于新城区32%，但新城区交通事故率更高
                  </div>
                </div>
                <div className="bg-white p-2 rounded shadow-sm">
                  <div className="text-sm font-medium mb-1">东部 vs 西部</div>
                  <div className="text-xs text-gray-500">
                    东部区域夜间警情比西部高45%，西部区域白天警情量更大
                  </div>
                </div>
                <div className="bg-white p-2 rounded shadow-sm">
                  <div className="text-sm font-medium mb-1">北部 vs 南部</div>
                  <div className="text-xs text-gray-500">
                    南部区域娱乐场所周边警情显著高于北部，北部交通类警情更多
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* 路网分析 */}
      <div className="bg-white p-4 mb-4 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">路网分析</h2>
          <div className="flex">
            <div 
              className={`px-3 py-1 text-sm cursor-pointer ${roadTab === 'accident' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
              onClick={() => setRoadTab('accident')}
            >
              事故多发路段
            </div>
            <div 
              className={`px-3 py-1 text-sm cursor-pointer ${roadTab === 'density' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
              onClick={() => setRoadTab('density')}
            >
              路网警情密度
            </div>
            <div 
              className={`px-3 py-1 text-sm cursor-pointer ${roadTab === 'intersect' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
              onClick={() => setRoadTab('intersect')}
            >
              交叉口分析
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 bg-white border rounded px-2 py-2">
            <div style={{ width: '100%', height: '320px' }}>
              {renderRoadChart()}
            </div>
          </div>
          
          <div>
            <div className="text-sm font-medium mb-2">
              {roadTab === 'accident' ? '事故多发路段TOP5' : 
               roadTab === 'density' ? '警情密度最高路段TOP5' : 
               '风险最高交叉口TOP5'}
            </div>
            <div className="space-y-2">
              {roadTab === 'accident' && accidentData.slice(0, 5).map((item, index) => (
                <div key={index} className="bg-white border rounded p-2">
                  <div className="font-medium text-sm">{item.name}</div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-gray-500">警情：{item.value}起</span>
                    <span className={`${item.riskLevel === '高' ? 'text-red-500' : item.riskLevel === '中' ? 'text-orange-500' : 'text-green-500'}`}>
                      风险：{item.riskLevel}
                    </span>
                  </div>
                </div>
              ))}
              
              {roadTab === 'density' && densityData.slice(0, 5).map((item, index) => (
                <div key={index} className="bg-white border rounded p-2">
                  <div className="font-medium text-sm">{item.name}</div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-gray-500">密度：{item.density}</span>
                    <span className="text-blue-500">警情：{item.incidents}起</span>
                  </div>
                </div>
              ))}
              
              {roadTab === 'intersect' && intersectionData.slice(0, 5).map((item, index) => (
                <div key={index} className="bg-white border rounded p-2">
                  <div className="font-medium text-sm">{item.name}</div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-gray-500">流量：{item.x}</span>
                    <span className={`${item.risk === '极高' || item.risk === '高' ? 'text-red-500' : item.risk === '中' ? 'text-orange-500' : 'text-green-500'}`}>
                      风险：{item.risk}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* 动态时空演变分析 */}
      <div className="bg-white p-4 mb-4 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">动态时空演变分析</h2>
          <div className="flex items-center space-x-2">
            <button 
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
              onClick={() => {
                // 模拟播放动画
                const button = document.querySelector('.animation-btn');
                if (button) {
                  button.textContent = '播放中...';
                  button.disabled = true;
                  setTimeout(() => {
                    button.textContent = '重新播放';
                    button.disabled = false;
                  }, 5000);
                }
              }}
            >
              <span className="animation-btn">播放动画</span>
            </button>
            <select className="px-3 py-1 bg-gray-100 text-sm rounded border">
              <option value="1h">1小时间隔</option>
              <option value="3h">3小时间隔</option>
              <option value="6h">6小时间隔</option>
              <option value="12h">12小时间隔</option>
              <option value="1d">1天间隔</option>
              <option value="1w">1周间隔</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* 时空热力图动画 */}
          <div className="col-span-2">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 h-80 relative overflow-hidden">
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-gray-700">警情时空分布动态演变</h3>
                <div className="text-sm text-gray-500">当前时间：2025-05-07 14:30</div>
              </div>
              
              {/* 模拟热力图动画区域 */}
              <div className="relative h-60 bg-white rounded border">
                {/* 模拟城市区域 */}
                <div className="absolute inset-2">
                  {/* 商业区热点 */}
                  <div className="absolute top-8 left-12 w-16 h-12 bg-red-400 rounded-full opacity-70 animate-pulse">
                    <div className="absolute inset-0 bg-red-300 rounded-full animate-ping"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-white font-bold">
                      商圈
                    </div>
                  </div>
                  
                  {/* 交通枢纽热点 */}
                  <div className="absolute top-16 right-16 w-12 h-12 bg-orange-400 rounded-full opacity-60 animate-pulse" style={{animationDelay: '0.5s'}}>
                    <div className="absolute inset-0 bg-orange-300 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-white font-bold">
                      路口
                    </div>
                  </div>
                  
                  {/* 居民区热点 */}
                  <div className="absolute bottom-12 left-20 w-10 h-10 bg-yellow-400 rounded-full opacity-50 animate-pulse" style={{animationDelay: '1s'}}>
                    <div className="absolute inset-0 bg-yellow-300 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-white font-bold">
                      小区
                    </div>
                  </div>
                  
                  {/* 娱乐区热点 */}
                  <div className="absolute bottom-8 right-12 w-14 h-10 bg-purple-400 rounded-full opacity-60 animate-pulse" style={{animationDelay: '1.5s'}}>
                    <div className="absolute inset-0 bg-purple-300 rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-white font-bold">
                      夜市
                    </div>
                  </div>
                  
                  {/* 连接线动画 */}
                  <svg className="absolute inset-0 w-full h-full">
                    <defs>
                      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{stopColor: '#3B82F6', stopOpacity: 0}} />
                        <stop offset="50%" style={{stopColor: '#3B82F6', stopOpacity: 0.8}} />
                        <stop offset="100%" style={{stopColor: '#3B82F6', stopOpacity: 0}} />
                      </linearGradient>
                    </defs>
                    <path d="M 80 50 Q 150 80 240 70" stroke="url(#lineGradient)" strokeWidth="2" fill="none" className="animate-pulse" />
                    <path d="M 120 180 Q 180 120 280 140" stroke="url(#lineGradient)" strokeWidth="2" fill="none" className="animate-pulse" style={{animationDelay: '0.5s'}} />
                  </svg>
                </div>
                
                {/* 时间轴控制器 */}
                <div className="absolute bottom-2 left-2 right-2 bg-white bg-opacity-90 rounded p-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-600">00:00</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 relative">
                      <div className="bg-blue-500 h-2 rounded-full w-1/2 relative">
                        <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow"></div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-600">24:00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 实时统计面板 */}
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-red-50 to-red-100 p-3 rounded-lg">
              <div className="text-sm text-red-600 font-medium">当前活跃热点</div>
              <div className="text-2xl font-bold text-red-700">4个</div>
              <div className="text-xs text-red-500">较1小时前 +1</div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-3 rounded-lg">
              <div className="text-sm text-orange-600 font-medium">热点强度指数</div>
              <div className="text-2xl font-bold text-orange-700">78</div>
              <div className="text-xs text-orange-500">中等强度</div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">扩散速度</div>
              <div className="text-2xl font-bold text-blue-700">2.3</div>
              <div className="text-xs text-blue-500">km/h</div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-lg">
              <div className="text-sm text-green-600 font-medium">预测准确率</div>
              <div className="text-2xl font-bold text-green-700">85%</div>
              <div className="text-xs text-green-500">模型可信度高</div>
            </div>
          </div>
        </div>
        
        {/* 演变趋势图表 */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white border rounded-lg p-3">
            <h4 className="font-medium mb-3 text-gray-700">热点强度变化趋势</h4>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                  { time: '06:00', 商圈: 20, 路口: 45, 小区: 15, 夜市: 5 },
                  { time: '09:00', 商圈: 65, 路口: 80, 小区: 25, 夜市: 8 },
                  { time: '12:00', 商圈: 85, 路口: 60, 小区: 30, 夜市: 12 },
                  { time: '15:00', 商圈: 90, 路口: 70, 小区: 20, 夜市: 15 },
                  { time: '18:00', 商圈: 75, 路口: 95, 小区: 40, 夜市: 25 },
                  { time: '21:00', 商圈: 60, 路口: 50, 小区: 35, 夜市: 80 },
                  { time: '24:00', 商圈: 30, 路口: 25, 小区: 45, 夜市: 90 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" tick={{fontSize: 10}} />
                  <YAxis tick={{fontSize: 10}} />
                  <Tooltip />
                  <Line type="monotone" dataKey="商圈" stroke="#EF4444" strokeWidth={2} dot={{r: 3}} />
                  <Line type="monotone" dataKey="路口" stroke="#F97316" strokeWidth={2} dot={{r: 3}} />
                  <Line type="monotone" dataKey="小区" stroke="#EAB308" strokeWidth={2} dot={{r: 3}} />
                  <Line type="monotone" dataKey="夜市" stroke="#8B5CF6" strokeWidth={2} dot={{r: 3}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white border rounded-lg p-3">
            <h4 className="font-medium mb-3 text-gray-700">热点迁移路径分析</h4>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={[
                  { x: 20, y: 30, z: 400, name: '商圈早高峰' },
                  { x: 60, y: 80, z: 600, name: '路口早高峰' },
                  { x: 40, y: 20, z: 300, name: '小区午间' },
                  { x: 80, y: 60, z: 500, name: '商圈午间' },
                  { x: 90, y: 85, z: 700, name: '路口晚高峰' },
                  { x: 30, y: 90, z: 800, name: '夜市夜间' },
                  { x: 50, y: 40, z: 350, name: '小区夜间' }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="x" name="东西向位置" tick={{fontSize: 10}} />
                  <YAxis dataKey="y" name="南北向位置" tick={{fontSize: 10}} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter dataKey="z" fill="#3B82F6" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* 分析结果和建议 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium mb-3 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              时空演变规律发现
            </h3>
            <ul className="list-disc pl-5 text-sm space-y-2 text-gray-700">
              <li><strong>潮汐效应：</strong>商业区警情热点在工作日呈现明显的潮汐变化，早晚高峰向周边扩散</li>
              <li><strong>时间迁移：</strong>热点从白天的商业区逐步向夜间的娱乐区转移，迁移速度约2.3km/h</li>
              <li><strong>周期性：</strong>每24小时为一个完整周期，周末模式与工作日存在显著差异</li>
              <li><strong>空间聚集：</strong>高风险区域呈现"核心-边缘"的圈层扩散模式</li>
            </ul>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium mb-3 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              智能预测与建议
            </h3>
            <ul className="list-disc pl-5 text-sm space-y-2 text-gray-700">
              <li><strong>短期预测：</strong>预计18:00-20:00时段XX路口将形成新的警情高发区</li>
              <li><strong>警力调配：</strong>建议在热点迁移路径上提前部署机动警力，响应时间可缩短35%</li>
              <li><strong>重点防控：</strong>XX夜市区域夜间警情呈上升趋势，建议22:00后增加巡防频次</li>
              <li><strong>长期规划：</strong>根据热点演变趋势，建议在城东新区增设警务站点</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* 选中区域详情模态框 */}
      {selectedArea && (
        <AreaRiskDetailModal
          isOpen={selectedArea !== null}
          onClose={() => setSelectedArea(null)}
          areasData={highRiskAreasData}
        />
      )}
      
      {/* 区域风险详情弹窗 */}
      <AreaRiskDetailModal 
        isOpen={isRiskModalOpen}
        onClose={() => setIsRiskModalOpen(false)}
        areasData={highRiskAreasData}
      />
    </Layout>
  );
};

export default SpatialAnalysis;