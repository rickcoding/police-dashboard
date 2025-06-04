import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, plugins } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie as RechartsPie,
  Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ScatterChart, Scatter, ComposedChart 
} from 'recharts';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const CategoryAnalysis = () => {
  // 状态管理
  const [mainTab, setMainTab] = useState('structure');
  const [structureView, setStructureView] = useState('police');
  const [timeRange, setTimeRange] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [correlationView, setCorrelationView] = useState('network');
  const [featureTab, setFeatureTab] = useState('time');

  // 警情类型数据 - 按警种分类
  const policeTypeData = [
    { id: 1, name: '治安警情', count: 456, ratio: 28.5, trend: '+3.2%' },
    { id: 2, name: '交警警情', count: 378, ratio: 23.6, trend: '-2.1%' },
    { id: 3, name: '刑警警情', count: 302, ratio: 18.9, trend: '+5.7%' },
    { id: 4, name: '经侦警情', count: 165, ratio: 10.3, trend: '+12.5%' },
    { id: 5, name: '户政警情', count: 134, ratio: 8.4, trend: '-0.9%' },
    { id: 6, name: '消防警情', count: 98, ratio: 6.1, trend: '+2.8%' },
    { id: 7, name: '其他警情', count: 67, ratio: 4.2, trend: '-1.3%' }
  ];

  // 警情类型数据 - 按案件性质分类
  const caseTypeData = [
    { id: 1, name: '盗窃案件', count: 520, ratio: 32.5, trend: '+4.1%' },
    { id: 2, name: '交通事故', count: 340, ratio: 21.3, trend: '-1.8%' },
    { id: 3, name: '民事纠纷', count: 280, ratio: 17.5, trend: '+6.2%' },
    { id: 4, name: '噪音投诉', count: 185, ratio: 11.6, trend: '+2.3%' },
    { id: 5, name: '治安案件', count: 142, ratio: 8.9, trend: '-0.5%' },
    { id: 6, name: '诈骗案件', count: 85, ratio: 5.3, trend: '+15.2%' },
    { id: 7, name: '其他案件', count: 48, ratio: 3.0, trend: '-2.1%' }
  ];

  // 警情类型数据 - 按危害程度分类
  const severityTypeData = [
    { id: 1, name: '轻微事件', count: 680, ratio: 42.5, trend: '+2.8%' },
    { id: 2, name: '一般事件', count: 520, ratio: 32.5, trend: '+1.5%' },
    { id: 3, name: '较重事件', count: 240, ratio: 15.0, trend: '+4.2%' },
    { id: 4, name: '重大事件', count: 112, ratio: 7.0, trend: '+8.5%' },
    { id: 5, name: '特大事件', count: 32, ratio: 2.0, trend: '+12.8%' },
    { id: 6, name: '紧急事件', count: 16, ratio: 1.0, trend: '+25.0%' }
  ];

  // 时间变化数据 - 按警种分类
  const timeChangeDataPolice = [
    { month: '1月', 治安警情: 38, 交警警情: 32, 刑警警情: 28, 经侦警情: 15, 户政警情: 12, 消防警情: 8 },
    { month: '2月', 治安警情: 42, 交警警情: 29, 刑警警情: 31, 经侦警情: 18, 户政警情: 14, 消防警情: 10 },
    { month: '3月', 治安警情: 45, 交警警情: 35, 刑警警情: 29, 经侦警情: 16, 户政警情: 13, 消防警情: 9 },
    { month: '4月', 治安警情: 48, 交警警情: 38, 刑警警情: 33, 经侦警情: 19, 户政警情: 15, 消防警情: 11 },
    { month: '5月', 治安警情: 52, 交警警情: 42, 刑警警情: 35, 经侦警情: 21, 户政警情: 16, 消防警情: 13 },
    { month: '6月', 治安警情: 49, 交警警情: 40, 刑警警情: 32, 经侦警情: 17, 户政警情: 14, 消防警情: 12 }
  ];

  // 时间变化数据 - 按案件性质分类
  const timeChangeDataCase = [
    { month: '1月', 盗窃案件: 42, 交通事故: 28, 民事纠纷: 24, 噪音投诉: 16, 治安案件: 12, 诈骗案件: 7 },
    { month: '2月', 盗窃案件: 46, 交通事故: 25, 民事纠纷: 27, 噪音投诉: 19, 治安案件: 13, 诈骗案件: 8 },
    { month: '3月', 盗窃案件: 48, 交通事故: 31, 民事纠纷: 25, 噪音投诉: 17, 治安案件: 11, 诈骗案件: 6 },
    { month: '4月', 盗窃案件: 52, 交通事故: 34, 民事纠纷: 29, 噪音投诉: 20, 治安案件: 14, 诈骗案件: 9 },
    { month: '5月', 盗窃案件: 55, 交通事故: 38, 民事纠纷: 31, 噪音投诉: 22, 治安案件: 15, 诈骗案件: 11 },
    { month: '6月', 盗窃案件: 53, 交通事故: 36, 民事纠纷: 28, 噪音投诉: 18, 治安案件: 13, 诈骗案件: 10 }
  ];

  // 时间变化数据 - 按危害程度分类
  const timeChangeDataSeverity = [
    { month: '1月', 轻微事件: 58, 一般事件: 44, 较重事件: 20, 重大事件: 9, 特大事件: 3, 紧急事件: 1 },
    { month: '2月', 轻微事件: 62, 一般事件: 48, 较重事件: 22, 重大事件: 10, 特大事件: 2, 紧急事件: 1 },
    { month: '3月', 轻微事件: 60, 一般事件: 46, 较重事件: 21, 重大事件: 8, 特大事件: 3, 紧急事件: 2 },
    { month: '4月', 轻微事件: 64, 一般事件: 50, 较重事件: 24, 重大事件: 11, 特大事件: 3, 紧急事件: 1 },
    { month: '5月', 轻微事件: 68, 一般事件: 52, 较重事件: 25, 重大事件: 12, 特大事件: 4, 紧急事件: 2 },
    { month: '6月', 轻微事件: 66, 一般事件: 49, 较重事件: 23, 重大事件: 10, 特大事件: 2, 紧急事件: 1 }
  ];

  // 获取当前时间变化数据
  const getCurrentTimeChangeData = () => {
    switch (structureView) {
      case 'police':
        return timeChangeDataPolice;
      case 'case':
        return timeChangeDataCase;
      case 'severity':
        return timeChangeDataSeverity;
      default:
        return timeChangeDataPolice;
    }
  };

  // 空间分布数据
  const spaceDistributionData = [
    { name: '东部片区', 盗窃类: 120, 交通类: 95, 纠纷类: 76, 噪音类: 42, 治安类: 35, 诈骗类: 25 },
    { name: '西部片区', 盗窃类: 89, 交通类: 102, 纠纷类: 68, 噪音类: 38, 治安类: 29, 诈骗类: 21 },
    { name: '南部片区', 盗窃类: 134, 交通类: 88, 纠纷类: 84, 噪音类: 46, 治安类: 39, 诈骗类: 28 },
    { name: '北部片区', 盗窃类: 78, 交通类: 63, 纠纷类: 49, 噪音类: 24, 治安类: 20, 诈骗类: 15 },
    { name: '中心城区', 盗窃类: 35, 交通类: 30, 纠纷类: 25, 噪音类: 15, 治安类: 11, 诈骗类: 9 }
  ];

  // 环比变化数据
  const trendChangeData = [
    { name: '盗窃类', currentMonth: 456, lastMonth: 441, change: 3.2 },
    { name: '交通类', currentMonth: 378, lastMonth: 386, change: -2.1 },
    { name: '纠纷类', currentMonth: 302, lastMonth: 286, change: 5.7 },
    { name: '噪音类', currentMonth: 165, lastMonth: 162, change: 1.8 },
    { name: '治安类', currentMonth: 134, lastMonth: 135, change: -0.9 },
    { name: '诈骗类', currentMonth: 98, lastMonth: 87, change: 12.5 },
    { name: '其他类', currentMonth: 67, lastMonth: 68, change: -1.3 }
  ];

  // 关联网络数据
  const correlationNetworkData = [
    { from: '盗窃类', to: '治安类', strength: 0.65, x: 100, y: 150 },
    { from: '交通类', to: '噪音类', strength: 0.42, x: 200, y: 100 },
    { from: '纠纷类', to: '治安类', strength: 0.58, x: 150, y: 200 },
    { from: '噪音类', to: '纠纷类', strength: 0.73, x: 250, y: 180 },
    { from: '诈骗类', to: '盗窃类', strength: 0.38, x: 80, y: 120 }
  ];

  // 关联规则矩阵数据
  const correlationRulesData = [
    { category: '盗窃类', 盗窃类: 1.0, 交通类: 0.25, 纠纷类: 0.18, 噪音类: 0.32, 治安类: 0.65, 诈骗类: 0.38 },
    { category: '交通类', 盗窃类: 0.25, 交通类: 1.0, 纠纷类: 0.28, 噪音类: 0.42, 治安类: 0.31, 诈骗类: 0.15 },
    { category: '纠纷类', 盗窃类: 0.18, 交通类: 0.28, 纠纷类: 1.0, 噪音类: 0.73, 治安类: 0.58, 诈骗类: 0.22 },
    { category: '噪音类', 盗窃类: 0.32, 交通类: 0.42, 纠纷类: 0.73, 噪音类: 1.0, 治安类: 0.48, 诈骗类: 0.19 },
    { category: '治安类', 盗窃类: 0.65, 交通类: 0.31, 纠纷类: 0.58, 噪音类: 0.48, 治安类: 1.0, 诈骗类: 0.33 },
    { category: '诈骗类', 盗窃类: 0.38, 交通类: 0.15, 纠纷类: 0.22, 噪音类: 0.19, 治安类: 0.33, 诈骗类: 1.0 }
  ];

  // 时间特征数据（24小时分布）
  const timeFeatureData = [
    { hour: '0时', 盗窃类: 25, 交通类: 5, 纠纷类: 8, 噪音类: 12, 治安类: 15 },
    { hour: '2时', 盗窃类: 35, 交通类: 3, 纠纷类: 4, 噪音类: 8, 治安类: 18 },
    { hour: '4时', 盗窃类: 28, 交通类: 2, 纠纷类: 2, 噪音类: 3, 治安类: 12 },
    { hour: '6时', 盗窃类: 15, 交通类: 12, 纠纷类: 5, 噪音类: 2, 治安类: 8 },
    { hour: '8时', 盗窃类: 18, 交通类: 38, 纠纷类: 15, 噪音类: 5, 治安类: 12 },
    { hour: '10时', 盗窃类: 22, 交通类: 25, 纠纷类: 18, 噪音类: 8, 治安类: 15 },
    { hour: '12时', 盗窃类: 28, 交通类: 32, 纠纷类: 22, 噪音类: 12, 治安类: 18 },
    { hour: '14时', 盗窃类: 32, 交通类: 28, 纠纷类: 25, 噪音类: 15, 治安类: 22 },
    { hour: '16时', 盗窃类: 35, 交通类: 35, 纠纷类: 28, 噪音类: 18, 治安类: 25 },
    { hour: '18时', 盗窃类: 42, 交通类: 45, 纠纷类: 35, 噪音类: 25, 治安类: 32 },
    { hour: '20时', 盗窃类: 38, 交通类: 22, 纠纷类: 42, 噪音类: 35, 治安类: 38 },
    { hour: '22时', 盗窃类: 32, 交通类: 15, 纠纷类: 38, 噪音类: 48, 治安类: 42 }
  ];

  // 空间特征数据（雷达图）
  const spaceFeatureData = [
    { type: '商业密度', 盗窃类: 85, 交通类: 60, 纠纷类: 45, 噪音类: 70, 治安类: 55 },
    { type: '人口密度', 盗窃类: 70, 交通类: 75, 纠纷类: 90, 噪音类: 85, 治安类: 80 },
    { type: '交通便利度', 盗窃类: 80, 交通类: 95, 纠纷类: 65, 噪音类: 60, 治安类: 70 },
    { type: '监控覆盖度', 盗窃类: 45, 交通类: 80, 纠纷类: 55, 噪音类: 50, 治安类: 60 },
    { type: '警力配置', 盗窃类: 60, 交通类: 85, 纠纷类: 70, 噪音类: 55, 治安类: 75 },
    { type: '经济水平', 盗窃类: 75, 交通类: 70, 纠纷类: 50, 噪音类: 65, 治安类: 60 }
  ];

  // 对象特征数据（年龄分布）
  const objectFeatureData = [
    { ageGroup: '18-25岁', 盗窃类: 35, 交通类: 28, 纠纷类: 22, 噪音类: 18, 治安类: 42 },
    { ageGroup: '26-35岁', 盗窃类: 45, 交通类: 38, 纠纷类: 35, 噪音类: 25, 治安类: 32 },
    { ageGroup: '36-45岁', 盗窃类: 28, 交通类: 42, 纠纷类: 48, 噪音类: 35, 治安类: 25 },
    { ageGroup: '46-55岁', 盗窃类: 22, 交通类: 35, 纠纷类: 38, 噪音类: 28, 治安类: 18 },
    { ageGroup: '56-65岁', 盗窃类: 15, 交通类: 25, 纠纷类: 32, 噪音类: 22, 治安类: 12 },
    { ageGroup: '65岁以上', 盗窃类: 8, 交通类: 18, 纠纷类: 25, 噪音类: 15, 治安类: 8 }
  ];

  // 处置特征数据
  const handlingFeatureData = [
    { name: '盗窃类', 平均处置时长: 3.5, 调解成功率: 25, 破案率: 45, 重复率: 15 },
    { name: '交通类', 平均处置时长: 1.2, 调解成功率: 75, 破案率: 95, 重复率: 8 },
    { name: '纠纷类', 平均处置时长: 2.8, 调解成功率: 82, 破案率: 88, 重复率: 25 },
    { name: '噪音类', 平均处置时长: 0.8, 调解成功率: 65, 破案率: 90, 重复率: 40 },
    { name: '治安类', 平均处置时长: 2.2, 调解成功率: 45, 破案率: 75, 重复率: 18 },
    { name: '诈骗类', 平均处置时长: 4.5, 调解成功率: 15, 破案率: 35, 重复率: 12 }
  ];

  // 根据当前视图获取对应的数据
  const getCurrentCategoryData = () => {
    switch (structureView) {
      case 'police':
        return policeTypeData;
      case 'case':
        return caseTypeData;
      case 'severity':
        return severityTypeData;
      default:
        return policeTypeData;
    }
  };

  const currentCategoryData = getCurrentCategoryData();

  // 返回趋势颜色
  const getTrendColor = (trend) => {
    return trend.startsWith('+') ? 'text-red-500' : 'text-green-500';
  };

  // 渲染类型结构时间变化图表
  const renderTimeChangeChart = () => {
    const data = getCurrentTimeChangeData();
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
    
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" fontSize={9} />
          <YAxis fontSize={9} />
          <RechartsTooltip />
          {Object.keys(data[0]).filter(key => key !== 'month').map((key, index) => (
            <Area 
              key={key}
              type="monotone" 
              dataKey={key} 
              stackId="1" 
              stroke={colors[index % colors.length]} 
              fill={colors[index % colors.length]} 
              fillOpacity={0.6} 
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  // 渲染空间分布图表
  const renderSpaceDistributionChart = () => {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={spaceDistributionData} margin={{ top: 5, right: 5, left: 5, bottom: 25 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            height={25}
            fontSize={9}
          />
          <YAxis fontSize={9} />
          <RechartsTooltip />
          <Bar dataKey="盗窃类" fill="#FF6B6B" />
          <Bar dataKey="交通类" fill="#4ECDC4" />
          <Bar dataKey="纠纷类" fill="#45B7D1" />
          <Bar dataKey="噪音类" fill="#FFA07A" />
          <Bar dataKey="治安类" fill="#98D8C8" />
          <Bar dataKey="诈骗类" fill="#F7DC6F" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  // 渲染环比变化图表
  const renderTrendChangeChart = () => {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={trendChangeData} margin={{ top: 5, right: 5, left: 5, bottom: 25 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            height={25}
            fontSize={9}
          />
          <YAxis yAxisId="left" fontSize={9} />
          <YAxis yAxisId="right" orientation="right" fontSize={9} />
          <RechartsTooltip />
          <Bar yAxisId="left" dataKey="currentMonth" fill="#8884d8" name="本月警情数" />
          <Line yAxisId="right" type="monotone" dataKey="change" stroke="#ff7300" strokeWidth={2} name="环比变化%" />
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  // 渲染关联网络图表
  const renderCorrelationNetworkChart = () => {
    // 将关联数据转换为柱状图格式
    const networkData = correlationNetworkData.map(item => ({
      name: `${item.from} → ${item.to}`,
      关联强度: parseFloat((item.strength * 100).toFixed(1)),
      strength: item.strength
    }));

    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={networkData} margin={{ top: 20, right: 30, left: 20, bottom: 90 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            height={90}
            fontSize={10}
            interval={0}
          />
          <YAxis 
            label={{ value: '关联强度(%)', angle: -90, position: 'insideLeft' }}
            fontSize={11}
            domain={[0, 80]}
          />
          <RechartsTooltip 
            formatter={(value, name) => [`${value}%`, '关联强度']}
            labelFormatter={(label) => `警情关联: ${label}`}
          />
          <Bar dataKey="关联强度" name="关联强度" radius={[4, 4, 0, 0]}>
            {networkData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.strength > 0.6 ? '#FF6B6B' : entry.strength > 0.4 ? '#FFA07A' : '#98D8C8'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  };

  // 渲染关联规则矩阵图表
  const renderCorrelationRulesChart = () => {
    // 创建热力图数据 - 选择几个主要的关联规则显示
    const heatmapData = [
      { name: '噪音类 → 纠纷类', value: 73, color: '#FF6B6B' },
      { name: '盗窃类 → 治安类', value: 68, color: '#FF6B6B' },
      { name: '治安类 → 盗窃类', value: 62, color: '#FFA07A' },
      { name: '纠纷类 → 治安类', value: 58, color: '#FFA07A' },
      { name: '交通类 → 噪音类', value: 45, color: '#F7DC6F' },
      { name: '诈骗类 → 盗窃类', value: 38, color: '#98D8C8' }
    ];

    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={heatmapData} 
          layout="horizontal"
          margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            type="number" 
            domain={[0, 80]}
            label={{ value: '关联强度(%)', position: 'insideBottom', offset: -10 }}
            fontSize={11}
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            fontSize={11}
            width={95}
          />
          <RechartsTooltip 
            formatter={(value) => [`${value}%`, '关联强度']}
            labelFormatter={(label) => `关联规则: ${label}`}
          />
          <Bar dataKey="value" name="关联强度" radius={[0, 4, 4, 0]}>
            {heatmapData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  };

  // 渲染特征分析图表
  const renderFeatureChart = () => {
    switch (featureTab) {
      case 'time':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeFeatureData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="hour" fontSize={10} />
              <YAxis fontSize={10} />
              <RechartsTooltip />
              <Line type="monotone" dataKey="盗窃类" stroke="#FF6B6B" strokeWidth={2} />
              <Line type="monotone" dataKey="交通类" stroke="#4ECDC4" strokeWidth={2} />
              <Line type="monotone" dataKey="纠纷类" stroke="#45B7D1" strokeWidth={2} />
              <Line type="monotone" dataKey="噪音类" stroke="#FFA07A" strokeWidth={2} />
              <Line type="monotone" dataKey="治安类" stroke="#98D8C8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'space':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={spaceFeatureData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <PolarGrid />
              <PolarAngleAxis dataKey="type" fontSize={10} />
              <PolarRadiusAxis domain={[0, 100]} fontSize={8} />
              <RechartsTooltip />
              <Radar name="盗窃类" dataKey="盗窃类" stroke="#FF6B6B" fill="#FF6B6B" fillOpacity={0.3} />
              <Radar name="交通类" dataKey="交通类" stroke="#4ECDC4" fill="#4ECDC4" fillOpacity={0.3} />
              <Radar name="纠纷类" dataKey="纠纷类" stroke="#45B7D1" fill="#45B7D1" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        );
      
      case 'object':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={objectFeatureData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="ageGroup" fontSize={10} />
              <YAxis fontSize={10} />
              <RechartsTooltip />
              <Bar dataKey="盗窃类" fill="#FF6B6B" />
              <Bar dataKey="交通类" fill="#4ECDC4" />
              <Bar dataKey="纠纷类" fill="#45B7D1" />
              <Bar dataKey="噪音类" fill="#FFA07A" />
              <Bar dataKey="治安类" fill="#98D8C8" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'handling':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={handlingFeatureData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" fontSize={10} />
              <YAxis yAxisId="left" fontSize={10} />
              <YAxis yAxisId="right" orientation="right" fontSize={10} />
              <RechartsTooltip />
              <Bar yAxisId="left" dataKey="平均处置时长" fill="#8884d8" name="平均处置时长(小时)" />
              <Line yAxisId="right" type="monotone" dataKey="调解成功率" stroke="#ff7300" strokeWidth={2} name="调解成功率%" />
              <Line yAxisId="right" type="monotone" dataKey="破案率" stroke="#00ff00" strokeWidth={2} name="破案率%" />
            </ComposedChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  // 根据 structureView 生成饼图数据
  const generatePieChartData = (view) => {
    let data = getCurrentCategoryData();
    let backgroundColor = [
      'rgba(255, 99, 132, 0.8)',
      'rgba(54, 162, 235, 0.8)',
      'rgba(255, 206, 86, 0.8)',
      'rgba(75, 192, 192, 0.8)',
      'rgba(153, 102, 255, 0.8)',
      'rgba(255, 159, 64, 0.8)',
      'rgba(192, 192, 192, 0.8)'
    ];

    return {
      labels: data.map(item => item.name),
      datasets: [
        {
          label: view === 'police' ? '警种类型' : view === 'case' ? '案件类型' : '危害程度',
          data: data.map(item => item.count),
          backgroundColor: backgroundColor.slice(0, data.length),
          borderWidth: 2,
          borderColor: '#fff'
        },
      ],
    };
  };

  const pieChartData = generatePieChartData(structureView);

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        }
      },
      title: {
        display: true,
        text: structureView === 'police' ? '按警种分类统计' : 
              structureView === 'case' ? '按案件性质分类统计' : 
              '按危害程度分类统计',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      datalabels: {
        formatter: (value, context) => {
          let sum = 0;
          let dataArr = context.chart.data.datasets[0].data;
          dataArr.map(data => {
            sum += data;
          });
          let percentage = (value*100 / sum).toFixed(1)+"%";
          return percentage;
        },
        color: '#fff',
        font: {
          weight: 'bold',
          size: 12
        }
      }
    },
  };

  return (
    <Layout title="类别维度分析">
      {/* 类别控制面板 */}
      <div className="bg-white p-4 mb-4 rounded shadow">
        <div className="grid grid-cols-3 gap-4">
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
            <div className="text-sm text-gray-500 mb-2">区域范围</div>
            <select className="w-full p-2 border rounded bg-gray-100">
              <option value="all">全部辖区</option>
              <option value="east">东部片区</option>
              <option value="west">西部片区</option>
              <option value="south">南部片区</option>
              <option value="north">北部片区</option>
              <option value="center">中心城区</option>
            </select>
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-2">对比方式</div>
            <div className="flex border rounded overflow-hidden">
              <div className="px-3 py-2 text-sm cursor-pointer flex-1 text-center bg-blue-500 text-white">
                同比
              </div>
              <div className="px-3 py-2 text-sm cursor-pointer flex-1 text-center bg-gray-100">
                环比
              </div>
              <div className="px-3 py-2 text-sm cursor-pointer flex-1 text-center bg-gray-100">
                自定义
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 主选项卡 */}
      <div className="bg-white p-4 mb-4 rounded shadow">
        <div className="border-b mb-4">
          <div className="flex">
            <div
              className={`px-4 py-2 cursor-pointer ${mainTab === 'structure' ? 'text-blue-500 border-b-2 border-blue-500 -mb-px' : 'text-gray-500'}`}
              onClick={() => setMainTab('structure')}
            >
              类型结构分析
            </div>
            <div
              className={`px-4 py-2 cursor-pointer ${mainTab === 'correlation' ? 'text-blue-500 border-b-2 border-blue-500 -mb-px' : 'text-gray-500'}`}
              onClick={() => setMainTab('correlation')}
            >
              关联模式分析
            </div>
            <div
              className={`px-4 py-2 cursor-pointer ${mainTab === 'feature' ? 'text-blue-500 border-b-2 border-blue-500 -mb-px' : 'text-gray-500'}`}
              onClick={() => setMainTab('feature')}
            >
              类型特征剖析
            </div>
          </div>
        </div>

        {/* 类型结构分析面板 */}
        {mainTab === 'structure' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">警情类型结构</h2>
              <div className="flex">
                <div
                  className={`px-3 py-1 text-sm cursor-pointer ${structureView === 'police' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
                  onClick={() => setStructureView('police')}
                >
                  按警种
                </div>
                <div
                  className={`px-3 py-1 text-sm cursor-pointer ${structureView === 'case' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
                  onClick={() => setStructureView('case')}
                >
                  按案件
                </div>
                <div
                  className={`px-3 py-1 text-sm cursor-pointer ${structureView === 'severity' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
                  onClick={() => setStructureView('severity')}
                >
                  按危害程度
                </div>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-4">
              <div className="col-span-3 h-72 rounded">
                {/* 警情类型结构图 */}
                <Pie data={pieChartData} options={pieChartOptions} />
              </div>

              <div className="col-span-2">
                <div className="font-medium mb-2">警情类型统计</div>
                <div className="overflow-y-auto max-h-64">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-2 py-2 text-left font-medium text-gray-500">类型</th>
                        <th className="px-2 py-2 text-center font-medium text-gray-500">数量</th>
                        <th className="px-2 py-2 text-center font-medium text-gray-500">占比</th>
                        <th className="px-2 py-2 text-center font-medium text-gray-500">环比</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentCategoryData.map(category => (
                        <tr key={category.id} className="border-b cursor-pointer hover:bg-blue-50"
                          onClick={() => setSelectedCategory(category)}>
                          <td className="px-2 py-2">{category.name}</td>
                          <td className="px-2 py-2 text-center">{category.count}</td>
                          <td className="px-2 py-2 text-center">{category.ratio}%</td>
                          <td className={`px-2 py-2 text-center ${getTrendColor(category.trend)}`}>
                            {category.trend}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 结构特点总结 - 调整为全宽布局 */}
            <div className="mt-4 p-4 bg-blue-50 rounded">
              <div className="font-medium mb-3 text-lg">结构特点总结</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded border border-gray-200">
                  <h4 className="font-medium mb-3 text-gray-700 border-b border-gray-200 pb-2">主要特征分析</h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm">
                    {structureView === 'police' && (
                      <>
                        <li>治安警情占比最高，达28.5%，是当前最主要的警情类型</li>
                        <li>经侦警情环比增长最快，达12.5%，需加强经济犯罪防范</li>
                        <li>交警警情呈下降趋势，环比下降2.1%，交通管理成效显现</li>
                        <li>前三类警情（治安、交警、刑警）占总量的71%，是警务工作重点</li>
                      </>
                    )}
                    {structureView === 'case' && (
                      <>
                        <li>盗窃案件占比最高，达32.5%，财产安全是重点关注领域</li>
                        <li>诈骗案件环比增长最快，达15.2%，需加强防诈骗宣传</li>
                        <li>交通事故呈下降趋势，环比下降1.8%，道路安全持续改善</li>
                        <li>前三类案件（盗窃、交通、纠纷）占总量的71.3%，需重点防控</li>
                      </>
                    )}
                    {structureView === 'severity' && (
                      <>
                        <li>轻微事件占比最高，达42.5%，多数警情危害程度较低</li>
                        <li>紧急事件环比增长最快，达25.0%，需提升应急响应能力</li>
                        <li>一般事件相对稳定，环比增长1.5%，基础防控措施有效</li>
                        <li>重大及以上事件占比10%，需重点关注和预防</li>
                      </>
                    )}
                  </ul>
                </div>
                <div className="bg-white p-4 rounded border border-gray-200">
                  <h4 className="font-medium mb-3 text-gray-700 border-b border-gray-200 pb-2">趋势与建议</h4>
                  <div className="space-y-3 text-sm">
                    {structureView === 'police' && (
                      <>
                        <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
                          <div className="font-medium text-blue-700">治安警情防控建议</div>
                          <p className="text-gray-600 mt-1">加强社区巡防，提升技防覆盖，完善群防群治体系</p>
                        </div>
                        <div className="bg-orange-50 p-3 rounded border-l-4 border-orange-500">
                          <div className="font-medium text-orange-700">经侦警情重点关注</div>
                          <p className="text-gray-600 mt-1">加强金融监管，提升经济犯罪打击力度，做好风险预警</p>
                        </div>
                      </>
                    )}
                    {structureView === 'case' && (
                      <>
                        <div className="bg-red-50 p-3 rounded border-l-4 border-red-500">
                          <div className="font-medium text-red-700">盗窃案件防控重点</div>
                          <p className="text-gray-600 mt-1">强化重点部位防护，提升技防水平，加强巡逻防控</p>
                        </div>
                        <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-500">
                          <div className="font-medium text-yellow-700">诈骗案件预防宣传</div>
                          <p className="text-gray-600 mt-1">加大反诈宣传力度，提升群众防范意识，完善预警机制</p>
                        </div>
                      </>
                    )}
                    {structureView === 'severity' && (
                      <>
                        <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
                          <div className="font-medium text-green-700">轻微事件快速处置</div>
                          <p className="text-gray-600 mt-1">优化处置流程，提升处置效率，防止小事变大事</p>
                        </div>
                        <div className="bg-red-50 p-3 rounded border-l-4 border-red-500">
                          <div className="font-medium text-red-700">重大事件预防机制</div>
                          <p className="text-gray-600 mt-1">完善预警体系，加强风险研判，提升应急处置能力</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 图表区域 - 优化布局，减少留白 */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="bg-white border rounded p-2">
                <div className="font-medium mb-1 text-center text-sm">类型结构时间变化</div>
                <div style={{ width: '100%', height: '140px' }}>
                  {renderTimeChangeChart()}
                </div>
              </div>
              <div className="bg-white border rounded p-2">
                <div className="font-medium mb-1 text-center text-sm">类型结构空间分布</div>
                <div style={{ width: '100%', height: '140px' }}>
                  {renderSpaceDistributionChart()}
                </div>
              </div>
              <div className="bg-white border rounded p-2">
                <div className="font-medium mb-1 text-center text-sm">警情类型环比变化</div>
                <div style={{ width: '100%', height: '140px' }}>
                  {renderTrendChangeChart()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 关联模式分析面板 */}
        {mainTab === 'correlation' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">警情关联模式分析</h2>
              <div className="flex">
                <div
                  className={`px-3 py-1 text-sm cursor-pointer ${correlationView === 'network' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
                  onClick={() => setCorrelationView('network')}
                >
                  关联网络
                </div>
                <div
                  className={`px-3 py-1 text-sm cursor-pointer ${correlationView === 'rules' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
                  onClick={() => setCorrelationView('rules')}
                >
                  关联规则
                </div>
                <div
                  className={`px-3 py-1 text-sm cursor-pointer ${correlationView === 'sequence' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
                  onClick={() => setCorrelationView('sequence')}
                >
                  序列模式
                </div>
              </div>
            </div>

            {/* 主内容区域 - 重新设计为2:3的比例 */}
            <div className="grid grid-cols-5 gap-4 mb-4">
              {/* 左侧图表区域 */}
              <div className="col-span-3 bg-white border rounded">
                <div className="p-4 border-b border-gray-200">
                  <div className="font-medium text-center text-lg">
                    {correlationView === 'network' ? '警情类型关联网络分析' :
                      correlationView === 'rules' ? '警情关联规则强度矩阵' :
                        '警情序列模式分析'}
                  </div>
                </div>
                
                {/* 图表区域 - 修正高度 */}
                <div className="p-2" style={{ paddingTop: '24px' }}>
                  <div style={{ width: '100%', height: '280px' }}>
                    {correlationView === 'network' && (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={correlationNetworkData.map(item => ({
                          name: `${item.from} → ${item.to}`,
                          关联强度: parseFloat((item.strength * 100).toFixed(1)),
                          strength: item.strength
                        }))} margin={{ top: 0, right: 15, left: 20, bottom: 40 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="name" 
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            fontSize={12}
                            interval={0}
                          />
                          <YAxis 
                            label={{ value: '关联强度(%)', angle: -90, position: 'insideLeft' }}
                            fontSize={12}
                            domain={[0, 80]}
                          />
                          <RechartsTooltip 
                            formatter={(value, name) => [`${value}%`, '关联强度']}
                            labelFormatter={(label) => `警情关联: ${label}`}
                          />
                          <Bar dataKey="关联强度" name="关联强度" radius={[4, 4, 0, 0]}>
                            {correlationNetworkData.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={entry.strength > 0.6 ? '#FF6B6B' : entry.strength > 0.4 ? '#FFA07A' : '#98D8C8'} 
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                    {correlationView === 'rules' && (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                          data={[
                            { name: '噪音类 → 纠纷类', value: 73, color: '#FF6B6B' },
                            { name: '盗窃类 → 治安类', value: 68, color: '#FF6B6B' },
                            { name: '治安类 → 盗窃类', value: 62, color: '#FFA07A' },
                            { name: '纠纷类 → 治安类', value: 58, color: '#FFA07A' },
                            { name: '交通类 → 噪音类', value: 45, color: '#F7DC6F' },
                            { name: '诈骗类 → 盗窃类', value: 38, color: '#98D8C8' }
                          ]} 
                          layout="horizontal"
                          margin={{ top: 20, right: 20, left: 15, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis 
                            type="number" 
                            domain={[0, 80]}
                            label={{ value: '关联强度(%)', position: 'insideBottom', offset: -10 }}
                            fontSize={12}
                          />
                          <YAxis 
                            type="category" 
                            dataKey="name" 
                            fontSize={11}
                            width={120}
                          />
                          <RechartsTooltip 
                            formatter={(value) => [`${value}%`, '关联强度']}
                            labelFormatter={(label) => `关联规则: ${label}`}
                          />
                          <Bar dataKey="value" name="关联强度" radius={[0, 4, 4, 0]}>
                            {[
                              { name: '噪音类 → 纠纷类', value: 73, color: '#FF6B6B' },
                              { name: '盗窃类 → 治安类', value: 68, color: '#FF6B6B' },
                              { name: '治安类 → 盗窃类', value: 62, color: '#FFA07A' },
                              { name: '纠纷类 → 治安类', value: 58, color: '#FFA07A' },
                              { name: '交通类 → 噪音类', value: 45, color: '#F7DC6F' },
                              { name: '诈骗类 → 盗窃类', value: 38, color: '#98D8C8' }
                            ].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                    {correlationView === 'sequence' && (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={timeFeatureData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="hour" fontSize={12} />
                          <YAxis fontSize={12} label={{ value: '警情数量', angle: -90, position: 'insideLeft' }} />
                          <RechartsTooltip />
                          <Line type="monotone" dataKey="盗窃类" stroke="#FF6B6B" strokeWidth={3} dot={{ r: 4 }} />
                          <Line type="monotone" dataKey="交通类" stroke="#4ECDC4" strokeWidth={3} dot={{ r: 4 }} />
                          <Line type="monotone" dataKey="纠纷类" stroke="#45B7D1" strokeWidth={3} dot={{ r: 4 }} />
                          <Line type="monotone" dataKey="噪音类" stroke="#FFA07A" strokeWidth={3} dot={{ r: 4 }} />
                          <Line type="monotone" dataKey="治安类" stroke="#98D8C8" strokeWidth={3} dot={{ r: 4 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
                
                {/* 图表下方补充信息区域 - 精确控制高度 */}
                <div className="px-4 pb-3">
                  <div className="grid grid-cols-2 gap-2">
                    {/* 关联强度排行 */}
                    <div className="bg-gray-50 p-2 rounded">
                      <h4 className="font-medium mb-1 text-gray-700 text-sm">关联强度排行</h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">噪音类 → 纠纷类</span>
                          <span className="text-red-600 font-medium">73%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">盗窃类 → 治安类</span>
                          <span className="text-red-600 font-medium">65%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">纠纷类 → 治安类</span>
                          <span className="text-orange-600 font-medium">58%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">交通类 → 噪音类</span>
                          <span className="text-orange-600 font-medium">42%</span>
                        </div>
                      </div>
                    </div>

                    {/* 分析概要 */}
                    <div className="bg-blue-50 p-2 rounded">
                      <h4 className="font-medium mb-1 text-blue-700 text-sm">
                        {correlationView === 'network' ? '网络概要' :
                          correlationView === 'rules' ? '规则概要' :
                            '序列概要'}
                      </h4>
                      <div className="space-y-1 text-xs text-gray-600">
                        {correlationView === 'network' && (
                          <>
                            <div className="flex justify-between">
                              <span>关联节点:</span>
                              <span className="font-medium">6个</span>
                            </div>
                            <div className="flex justify-between">
                              <span>强关联:</span>
                              <span className="font-medium">2对</span>
                            </div>
                            <div className="flex justify-between">
                              <span>网络密度:</span>
                              <span className="font-medium">0.67</span>
                            </div>
                            <div className="flex justify-between">
                              <span>关联评分:</span>
                              <span className="font-medium">优秀</span>
                            </div>
                          </>
                        )}
                        {correlationView === 'rules' && (
                          <>
                            <div className="flex justify-between">
                              <span>有效规则:</span>
                              <span className="font-medium">6条</span>
                            </div>
                            <div className="flex justify-between">
                              <span>强规则:</span>
                              <span className="font-medium">2条</span>
                            </div>
                            <div className="flex justify-between">
                              <span>置信度:</span>
                              <span className="font-medium">59.8%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>规则质量:</span>
                              <span className="font-medium">良好</span>
                            </div>
                          </>
                        )}
                        {correlationView === 'sequence' && (
                          <>
                            <div className="flex justify-between">
                              <span>序列模式:</span>
                              <span className="font-medium">5个</span>
                            </div>
                            <div className="flex justify-between">
                              <span>频繁模式:</span>
                              <span className="font-medium">3个</span>
                            </div>
                            <div className="flex justify-between">
                              <span>平均间隔:</span>
                              <span className="font-medium">2.3小时</span>
                            </div>
                            <div className="flex justify-between">
                              <span>模式质量:</span>
                              <span className="font-medium">稳定</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 右侧分析区域 - 紧凑布局 */}
              <div className="col-span-2 space-y-4">
                {/* 关键关联发现 */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded border">
                  <h3 className="font-medium mb-3 text-blue-800 border-b border-blue-200 pb-1">关键关联发现</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between bg-white p-2 rounded shadow-sm">
                      <span className="text-gray-700">噪音类 → 纠纷类</span>
                      <span className="text-red-600 font-medium">73%</span>
                    </div>
                    <div className="flex items-center justify-between bg-white p-2 rounded shadow-sm">
                      <span className="text-gray-700">盗窃类 → 治安类</span>
                      <span className="text-red-600 font-medium">65%</span>
                    </div>
                    <div className="flex items-center justify-between bg-white p-2 rounded shadow-sm">
                      <span className="text-gray-700">交通类 → 噪音类</span>
                      <span className="text-orange-600 font-medium">42%</span>
                    </div>
                    <div className="flex items-center justify-between bg-white p-2 rounded shadow-sm">
                      <span className="text-gray-700">纠纷类 → 治安类</span>
                      <span className="text-orange-600 font-medium">58%</span>
                    </div>
                  </div>
                </div>

                {/* 预警指标 */}
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded border">
                  <h3 className="font-medium mb-3 text-yellow-800 border-b border-yellow-200 pb-1">预警指标</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-white p-3 rounded shadow-sm text-center">
                      <div className="text-xs text-gray-500 mb-1">关联强度阈值</div>
                      <div className="text-lg font-bold text-red-600">&gt;60%</div>
                    </div>
                    <div className="bg-white p-3 rounded shadow-sm text-center">
                      <div className="text-xs text-gray-500 mb-1">共现频次</div>
                      <div className="text-lg font-bold text-orange-600">&gt;50次/月</div>
                    </div>
                    <div className="bg-white p-3 rounded shadow-sm text-center">
                      <div className="text-xs text-gray-500 mb-1">预测准确率</div>
                      <div className="text-lg font-bold text-green-600">85.2%</div>
                    </div>
                    <div className="bg-white p-3 rounded shadow-sm text-center">
                      <div className="text-xs text-gray-500 mb-1">预警频次</div>
                      <div className="text-lg font-bold text-blue-600">&gt;50次/月</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 类型特征剖析面板 */}
        {mainTab === 'feature' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">警情类型特征剖析</h2>
              <div className="flex">
                <div
                  className={`px-3 py-1 text-sm cursor-pointer ${featureTab === 'time' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
                  onClick={() => setFeatureTab('time')}
                >
                  时间特征
                </div>
                <div
                  className={`px-3 py-1 text-sm cursor-pointer ${featureTab === 'space' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
                  onClick={() => setFeatureTab('space')}
                >
                  空间特征
                </div>
                <div
                  className={`px-3 py-1 text-sm cursor-pointer ${featureTab === 'object' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
                  onClick={() => setFeatureTab('object')}
                >
                  对象特征
                </div>
                <div
                  className={`px-3 py-1 text-sm cursor-pointer ${featureTab === 'handling' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
                  onClick={() => setFeatureTab('handling')}
                >
                  处置特征
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="col-span-2 bg-white border rounded p-2">
                <div style={{ width: '100%', height: '240px' }}>
                  {renderFeatureChart()}
                </div>
              </div>

              <div>
                <select className="w-full p-2 border rounded bg-gray-100 mb-3">
                  <option value="all">选择警情类型</option>
                  {currentCategoryData.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>

                <div className="bg-blue-50 p-3 rounded">
                  <h3 className="font-medium mb-2">特征总结</h3>
                  <div className="space-y-2 text-sm">
                    {featureTab === 'time' && (
                      <ul className="list-disc pl-5">
                        <li>盗窃类警情高发时段为凌晨0:00-5:00</li>
                        <li>交通类警情集中在早晚高峰期</li>
                        <li>噪音类警情主要发生在22:00-24:00</li>
                        <li>周末纠纷类警情比工作日高32%</li>
                        <li>夏季是全年警情高发期</li>
                      </ul>
                    )}

                    {featureTab === 'space' && (
                      <ul className="list-disc pl-5">
                        <li>盗窃类警情主要集中在商业区和交通枢纽</li>
                        <li>噪音类警情分布在居民区和娱乐场所周边</li>
                        <li>交通类警情集中在主要交叉口和快速路</li>
                        <li>纠纷类警情在老旧小区占比较高</li>
                        <li>诈骗类警情分布较为分散</li>
                      </ul>
                    )}

                    {featureTab === 'object' && (
                      <ul className="list-disc pl-5">
                        <li>盗窃类警情主要针对财物</li>
                        <li>纠纷类警情多涉及邻里或家庭</li>
                        <li>交通类警情事主年龄分布广泛</li>
                        <li>诈骗类警情受害者以中老年人为主</li>
                        <li>治安类警情涉案人员以青年人为主</li>
                      </ul>
                    )}

                    {featureTab === 'handling' && (
                      <ul className="list-disc pl-5">
                        <li>盗窃类警情平均处置时长3.5小时</li>
                        <li>纠纷类警情调解成功率达82%</li>
                        <li>交通类警情处置效率最高</li>
                        <li>诈骗类警情侦破难度大，破案率仅35%</li>
                        <li>噪音类警情重复率高达40%</li>
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-3 rounded">
                <h3 className="font-medium mb-2">典型案例特征</h3>
                <div className="bg-white p-2 rounded shadow-sm mb-2">
                  <div className="font-medium text-sm">入室盗窃案例</div>
                  <div className="text-xs text-gray-600 mt-1">
                    <p>时间特征：凌晨2:00-4:00，居民深睡时段</p>
                    <p>空间特征：一楼或顶楼居民住宅，低安防小区</p>
                    <p>作案特点：翻窗入室，窗户安全措施不足</p>
                    <p>处置要点：现场勘查，调取监控，走访询问</p>
                  </div>
                </div>
                <div className="bg-white p-2 rounded shadow-sm">
                  <div className="font-medium text-sm">醉酒滋事案例</div>
                  <div className="text-xs text-gray-600 mt-1">
                    <p>时间特征：周末晚间20:00-24:00</p>
                    <p>空间特征：餐饮聚集区、酒吧街周边</p>
                    <p>对象特点：中青年男性为主，多为群体性</p>
                    <p>处置要点：及时到场劝阻分离，避免事态扩大</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-3 rounded">
                <h3 className="font-medium mb-2">警务策略建议</h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-white p-2 rounded shadow-sm">
                    <div className="font-medium">针对盗窃类警情</div>
                    <p className="text-gray-600 text-xs mt-1">
                      增加夜间巡逻密度，加强视频监控覆盖，开展社区防盗宣传，提升群众防范意识。
                    </p>
                  </div>

                  <div className="bg-white p-2 rounded shadow-sm">
                    <div className="font-medium">针对交通类警情</div>
                    <p className="text-gray-600 text-xs mt-1">
                      在事故多发路段增设警示标志，早晚高峰增派交警，优化信号灯配时，加强交通安全宣传。
                    </p>
                  </div>

                  <div className="bg-white p-2 rounded shadow-sm">
                    <div className="font-medium">针对纠纷类警情</div>
                    <p className="text-gray-600 text-xs mt-1">
                      建立社区调解机制，培训专业调解员，提高首次调解成功率，防止问题反复。
                    </p>
                  </div>

                  <div className="bg-white p-2 rounded shadow-sm">
                    <div className="font-medium">针对噪音类警情</div>
                    <p className="text-gray-600 text-xs mt-1">
                      加强对娱乐场所管理，制定夜间管控标准，建立联动执法机制，提高处置效率。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 选中类型详情模态框 */}
      {selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl">
            <div className="p-5 border-b border-gray-200 flex justify-between">
              <div className="font-bold text-lg">警情类型详情 - {selectedCategory.name}</div>
              <button className="text-2xl" onClick={() => setSelectedCategory(null)}>&times;</button>
            </div>
            <div className="p-5 grid grid-cols-2 gap-4">
              <div>
                <div className="bg-white border rounded p-2 mb-3" style={{ height: '180px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <RechartsTooltip />
                      <RechartsPie 
                        data={[
                          { name: '已处置', value: Math.round(selectedCategory.count * 0.925) },
                          { name: '处置中', value: Math.round(selectedCategory.count * 0.075) }
                        ]}
                        cx="50%" 
                        cy="50%" 
                        outerRadius={60}
                        dataKey="value"
                      >
                        {[
                          { name: '已处置', value: Math.round(selectedCategory.count * 0.925) },
                          { name: '处置中', value: Math.round(selectedCategory.count * 0.075) }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#4ECDC4' : '#FFA07A'} />
                        ))}
                      </RechartsPie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-xs text-gray-500">警情总数</div>
                    <div className="text-lg font-bold">{selectedCategory.count}</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-xs text-gray-500">占总警情比例</div>
                    <div className="text-lg font-bold">{selectedCategory.ratio}%</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-xs text-gray-500">环比变化</div>
                    <div className={`text-lg font-bold ${getTrendColor(selectedCategory.trend)}`}>
                      {selectedCategory.trend}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-xs text-gray-500">处置率</div>
                    <div className="text-lg font-bold">92.5%</div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">警情类型分析</h3>
                <div className="space-y-3 text-sm">
                  <div className="mb-2">
                    <div className="font-medium">时间特征</div>
                    <p className="text-gray-600 mt-1">
                      {selectedCategory.name === '盗窃类' ? '夜间高发，凌晨达峰值' :
                        selectedCategory.name === '交通类' ? '早晚高峰时段集中' :
                          selectedCategory.name === '纠纷类' ? '周末晚间高发' :
                            selectedCategory.name === '噪音类' ? '22:00-24:00最多' :
                              '全天分布较均匀'}
                    </p>
                  </div>
                  <div className="mb-2">
                    <div className="font-medium">空间特征</div>
                    <p className="text-gray-600 mt-1">
                      {selectedCategory.name === '盗窃类' ? '商业区及交通枢纽集中' :
                        selectedCategory.name === '交通类' ? '主要道路交叉口' :
                          selectedCategory.name === '纠纷类' ? '居民区为主' :
                            selectedCategory.name === '噪音类' ? '居民区及娱乐场所周边' :
                              '分布较为均匀'}
                    </p>
                  </div>
                  <div className="mb-2">
                    <div className="font-medium">人员特征</div>
                    <p className="text-gray-600 mt-1">
                      {selectedCategory.name === '盗窃类' ? '18-35岁男性为主' :
                        selectedCategory.name === '交通类' ? '年龄分布广泛' :
                          selectedCategory.name === '纠纷类' ? '邻里、家庭成员' :
                            selectedCategory.name === '噪音类' ? '群体性高' :
                              '无明显特征'}
                    </p>
                  </div>
                  <div className="mb-2">
                    <div className="font-medium">处置特点</div>
                    <p className="text-gray-600 mt-1">
                      {selectedCategory.name === '盗窃类' ? '破案难度大，取证为关键' :
                        selectedCategory.name === '交通类' ? '处置效率高，程序规范' :
                          selectedCategory.name === '纠纷类' ? '调解是主要方式' :
                            selectedCategory.name === '噪音类' ? '处置简单但重复率高' :
                              '处置方式多样化'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-gray-200 flex justify-end">
              <button
                className="bg-gray-200 px-4 py-2 rounded mr-2"
                onClick={() => setSelectedCategory(null)}
              >
                关闭
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded">
                详细分析
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CategoryAnalysis;