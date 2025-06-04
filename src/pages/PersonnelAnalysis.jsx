import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, Radar, ComposedChart, Area, AreaChart
} from 'recharts';
import Layout from '../components/Layout';

const PersonnelAnalysis = () => {
  // 状态管理
  const [mainTab, setMainTab] = useState('portrait');
  const [portraitTab, setPortraitTab] = useState('age');
  const [resourceTab, setResourceTab] = useState('distribution');
  const [performanceTab, setPerformanceTab] = useState('efficiency');
  const [timeRange, setTimeRange] = useState('month');
  const [selectedGroup, setSelectedGroup] = useState(null);
  
  // 人群画像数据
  const ageGroupData = [
    { id: 1, group: '未成年人(<18岁)', count: 152, ratio: 7.6, trend: '+3.2%' },
    { id: 2, group: '青年(18-35岁)', count: 845, ratio: 42.3, trend: '+5.7%' },
    { id: 3, group: '中年(36-59岁)', count: 624, ratio: 31.2, trend: '-1.3%' },
    { id: 4, group: '老年(≥60岁)', count: 379, ratio: 18.9, trend: '+8.6%' }
  ];
  
  // 身份类型数据
  const identityData = [
    { id: 1, type: '本地居民', count: 1105, ratio: 55.3, trend: '+0.7%' },
    { id: 2, type: '外来务工', count: 472, ratio: 23.6, trend: '+2.3%' },
    { id: 3, type: '流动人口', count: 287, ratio: 14.3, trend: '+6.8%' },
    { id: 4, type: '游客', count: 136, ratio: 6.8, trend: '+15.2%' }
  ];

  // 角色分布数据
  const roleData = [
    { id: 1, role: '报警人', count: 1245, ratio: 38.6, trend: '-1.2%' },
    { id: 2, role: '事主/受害人', count: 1058, ratio: 32.8, trend: '+3.5%' },
    { id: 3, role: '嫌疑人/违法人', count: 845, ratio: 26.2, trend: '+2.8%' },
    { id: 4, role: '证人', count: 78, ratio: 2.4, trend: '+0.3%' }
  ];

  // 特殊群体数据
  const specialGroupData = [
    { id: 1, group: '未成年人', count: 152, ratio: 7.6, trend: '+3.2%' },
    { id: 2, group: '老年人', count: 379, ratio: 18.9, trend: '+8.6%' },
    { id: 3, group: '残障人士', count: 45, ratio: 2.3, trend: '+1.5%' },
    { id: 4, group: '精神障碍患者', count: 28, ratio: 1.4, trend: '+0.7%' }
  ];
  
  // 警力分布数据
  const policeResourceData = [
    { id: 1, area: '东部片区', police: 56, ratio: 1.2, workload: 132 },
    { id: 2, area: '西部片区', police: 42, ratio: 0.9, workload: 156 },
    { id: 3, area: '南部片区', police: 48, ratio: 1.0, workload: 142 },
    { id: 4, area: '北部片区', police: 38, ratio: 0.8, workload: 162 },
    { id: 5, area: '中心城区', police: 65, ratio: 1.4, workload: 115 }
  ];
  
  // 民警绩效数据
  const policePerformanceData = [
    { id: 1, police: '刑侦大队', avgTime: 4.2, caseCount: 186, solveRate: 72.5 },
    { id: 2, police: '治安大队', avgTime: 2.8, caseCount: 245, solveRate: 85.3 },
    { id: 3, police: '交警大队', avgTime: 0.8, caseCount: 324, solveRate: 93.8 },
    { id: 4, police: '巡警大队', avgTime: 1.5, caseCount: 278, solveRate: 89.2 },
    { id: 5, police: '社区警务', avgTime: 3.6, caseCount: 195, solveRate: 82.6 }
  ];
  
  // 警力资源地图数据
  const resourceMapData = [
    { area: '东部片区', police: 56, alerts: 68, load: 132, lat: 31.2400, lng: 121.5300 },
    { area: '西部片区', police: 42, alerts: 65, load: 156, lat: 31.2200, lng: 121.4800 },
    { area: '南部片区', police: 48, alerts: 68, load: 142, lat: 31.2100, lng: 121.5100 },
    { area: '北部片区', police: 38, alerts: 62, load: 162, lat: 31.2500, lng: 121.5200 },
    { area: '中心城区', police: 65, alerts: 75, load: 115, lat: 31.2300, lng: 121.5100 }
  ];

  // 时间趋势数据
  const timeTrendData = [
    { time: '00:00', 未成年人: 12, 青年: 58, 中年: 25, 老年: 8 },
    { time: '04:00', 未成年人: 5, 青年: 32, 中年: 18, 老年: 15 },
    { time: '08:00', 未成年人: 25, 青年: 85, 中年: 65, 老年: 28 },
    { time: '12:00', 未成年人: 45, 青年: 125, 中年: 95, 老年: 42 },
    { time: '16:00', 未成年人: 55, 青年: 145, 中年: 105, 老年: 38 },
    { time: '20:00', 未成年人: 38, 青年: 165, 中年: 125, 老年: 55 },
  ];

  // 群体特征雷达数据
  const groupRadarData = [
    { subject: '财产类警情', 未成年人: 35, 青年: 85, 中年: 65, 老年: 45 },
    { subject: '治安类警情', 未成年人: 45, 青年: 90, 中年: 55, 老年: 25 },
    { subject: '交通类警情', 未成年人: 25, 青年: 70, 中年: 85, 老年: 35 },
    { subject: '纠纷类警情', 未成年人: 15, 青年: 60, 中年: 75, 老年: 65 },
    { subject: '诈骗类警情', 未成年人: 20, 青年: 40, 中年: 55, 老年: 80 },
    { subject: '噪音类警情', 未成年人: 30, 青年: 55, 中年: 70, 老年: 45 }
  ];

  // 民警绩效雷达数据
  const performanceRadarData = [
    { metric: '处置效率', 刑侦大队: 65, 治安大队: 80, 交警大队: 95, 巡警大队: 85, 社区警务: 70 },
    { metric: '案件数量', 刑侦大队: 70, 治安大队: 85, 交警大队: 100, 巡警大队: 90, 社区警务: 75 },
    { metric: '处置质量', 刑侦大队: 85, 治安大队: 90, 交警大队: 95, 巡警大队: 88, 社区警务: 80 },
    { metric: '群众满意度', 刑侦大队: 75, 治安大队: 85, 交警大队: 92, 巡警大队: 88, 社区警务: 82 },
    { metric: '工作负荷', 刑侦大队: 85, 治安大队: 75, 交警大队: 70, 巡警大队: 80, 社区警务: 85 }
  ];
  
  // 返回趋势颜色
  const getTrendColor = (trend = '') => {
    if (typeof trend !== 'string') return 'text-gray-500';
    return trend.startsWith('+') ? 'text-red-500' : 'text-green-500';
  };
  
  // 返回匹配度颜色
  const getMatchColor = (ratio) => {
    if (ratio >= 1.2) return 'text-green-600';
    if (ratio >= 0.8) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  // 颜色配置
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff6b6b'];

  // 渲染警力资源图表
  const renderResourceChart = () => {
    switch (resourceTab) {
      case 'distribution':
        const sortedDistributionData = [...policeResourceData].sort((a,b) => b.police - a.police);
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={sortedDistributionData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="area" fontSize={12} />
              <YAxis yAxisId="left" fontSize={12} />
              <YAxis yAxisId="right" orientation="right" fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="police" name="警力数量" fill="#8884d8" />
              <Line yAxisId="right" type="monotone" dataKey="ratio" name="配置比例" stroke="#ff7300" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        );
      case 'match':
        const sortedMatchData = [...policeResourceData].sort((a,b) => b.ratio - a.ratio);
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedMatchData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="area" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip formatter={(value) => [`${value}`, '匹配度']} />
              <Legend />
              <Bar dataKey="ratio" name="警情匹配度" radius={[4, 4, 0, 0]}>
                {sortedMatchData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.ratio >= 1.2 ? '#4ade80' : entry.ratio >= 0.8 ? '#fbbf24' : '#f87171'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
      case 'workload': // AreaChart, no direct bar sorting needed as per current request focus
        const sortedWorkloadData = [...policeResourceData].sort((a,b) => b.workload - a.workload);
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sortedWorkloadData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="area" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip formatter={(value) => [`${value}`, '工作负荷']} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="workload" 
                name="工作负荷指数"
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'optimize':
        const optimizeData = [
          { area: '西部片区', current: 42, optimized: 50, improvement: 19 },
          { area: '北部片区', current: 38, optimized: 44, improvement: 16 },
          { area: '南部片区', current: 48, optimized: 46, improvement: -4 },
          { area: '东部片区', current: 56, optimized: 53, improvement: -5 },
          { area: '中心城区', current: 65, optimized: 61, improvement: -6 }
        ];
        const sortedOptimizeData = [...optimizeData].sort((a,b) => b.optimized - a.optimized);
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedOptimizeData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="area" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="current" name="当前配置" fill="#94a3b8" />
              <Bar dataKey="optimized" name="优化配置" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  // 渲染民警绩效图表
  const renderPerformanceChart = () => {
    switch (performanceTab) {
      case 'efficiency':
        const sortedEfficiencyData = [...policePerformanceData].sort((a, b) => b.avgTime - a.avgTime);
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedEfficiencyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="police" fontSize={11} angle={-45} textAnchor="end" height={80} />
              <YAxis fontSize={12} label={{ value: '时长(小时)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => [`${value}小时`, '处置时长']} />
              <Legend />
              <Bar dataKey="avgTime" name="平均处置时长" radius={[4, 4, 0, 0]}>
                {sortedEfficiencyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.avgTime < 1.5 ? '#4ade80' : entry.avgTime < 3 ? '#fbbf24' : '#f87171'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
      case 'count':
        const sortedCaseCountData = [...policePerformanceData].sort((a, b) => b.caseCount - a.caseCount);
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedCaseCountData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="police" fontSize={11} angle={-45} textAnchor="end" height={80} />
              <YAxis fontSize={12} />
              <Tooltip formatter={(value) => [`${value}起`, '处置数量']} />
              <Legend />
              <Bar dataKey="caseCount" name="警情处置数量" fill="#82ca9d" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'rate':
        const sortedRateData = [...policePerformanceData].sort((a, b) => b.solveRate - a.solveRate);
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedRateData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="police" fontSize={11} angle={-45} textAnchor="end" height={80} />
              <YAxis fontSize={12} domain={[0, 100]} label={{ value: '处置率(%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => [`${value}%`, '处置率']} />
              <Legend />
              <Bar dataKey="solveRate" name="警情处置率" radius={[4, 4, 0, 0]}>
                {sortedRateData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.solveRate > 90 ? '#4ade80' : entry.solveRate > 80 ? '#fbbf24' : '#f87171'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
      case 'satisfaction':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={performanceRadarData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" fontSize={11} />
              <PolarRadiusAxis domain={[0, 100]} fontSize={10} />
              <Tooltip />
              <Radar name="交警大队" dataKey="交警大队" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
              <Radar name="巡警大队" dataKey="巡警大队" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
              <Radar name="治安大队" dataKey="治安大队" stroke="#ffc658" fill="#ffc658" fillOpacity={0.3} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <Layout title="人员维度分析">
      {/* 人员维度控制面板 */}
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
      
      {/* 主选项卡 */}
      <div className="bg-white p-4 mb-4 rounded shadow">
        <div className="border-b mb-4">
          <div className="flex">
            <div 
              className={`px-4 py-2 cursor-pointer ${mainTab === 'portrait' ? 'text-blue-500 border-b-2 border-blue-500 -mb-px' : 'text-gray-500'}`}
              onClick={() => setMainTab('portrait')}
            >
              群体画像分析
            </div>
            <div 
              className={`px-4 py-2 cursor-pointer ${mainTab === 'resource' ? 'text-blue-500 border-b-2 border-blue-500 -mb-px' : 'text-gray-500'}`}
              onClick={() => setMainTab('resource')}
            >
              警力资源分析
            </div>
            <div 
              className={`px-4 py-2 cursor-pointer ${mainTab === 'performance' ? 'text-blue-500 border-b-2 border-blue-500 -mb-px' : 'text-gray-500'}`}
              onClick={() => setMainTab('performance')}
            >
              民警绩效评估
            </div>
          </div>
        </div>
        
        {/* 群体画像分析面板 */}
        {mainTab === 'portrait' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">警情涉及人员分析</h2>
              <div className="flex">
                <div 
                  className={`px-3 py-1 text-sm cursor-pointer ${portraitTab === 'age' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
                  onClick={() => setPortraitTab('age')}
                >
                  年龄分布
                </div>
                <div 
                  className={`px-3 py-1 text-sm cursor-pointer ${portraitTab === 'identity' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
                  onClick={() => setPortraitTab('identity')}
                >
                  身份类型
                </div>
                <div 
                  className={`px-3 py-1 text-sm cursor-pointer ${portraitTab === 'role' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
                  onClick={() => setPortraitTab('role')}
                >
                  角色分布
                </div>
                <div 
                  className={`px-3 py-1 text-sm cursor-pointer ${portraitTab === 'special' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
                  onClick={() => setPortraitTab('special')}
                >
                  特殊群体
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-5 gap-4">
              <div className="col-span-3 bg-white border rounded p-3" style={{ height: '380px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={
                      portraitTab === 'age'
                        ? [...ageGroupData].sort((a,b) => b.count - a.count)
                        : portraitTab === 'identity'
                          ? [...identityData].sort((a,b) => b.count - a.count)
                          : portraitTab === 'role'
                            ? [...roleData].sort((a,b) => b.count - a.count)
                            : portraitTab === 'special'
                              ? [...specialGroupData].sort((a,b) => b.count - a.count)
                              : []
                    }
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey={
                        portraitTab === 'age'
                          ? 'group'
                          : portraitTab === 'identity'
                            ? 'type'
                            : portraitTab === 'role'
                              ? 'role'
                              : portraitTab === 'special'
                                ? 'group'
                                : ''
                      }
                      fontSize={11}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="涉及人数" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="col-span-2 flex flex-col">
                <div>
                  <div className="font-medium mb-2">
                    {portraitTab === 'age' ? '年龄段分布' : 
                     portraitTab === 'identity' ? '身份类型分布' : 
                     portraitTab === 'role' ? '角色分布' :
                     '特殊群体分布'}
                  </div>
                  <div className="overflow-y-auto max-h-[250px] mb-3">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-2 py-2 text-left font-medium text-gray-500">
                            {portraitTab === 'age' ? '年龄段' : 
                             portraitTab === 'identity' ? '身份类型' : 
                             portraitTab === 'role' ? '角色类型' :
                             '群体类型'}
                          </th>
                          <th className="px-2 py-2 text-center font-medium text-gray-500">数量</th>
                          <th className="px-2 py-2 text-center font-medium text-gray-500">占比</th>
                          <th className="px-2 py-2 text-center font-medium text-gray-500">环比</th>
                        </tr>
                      </thead>
                      <tbody>
                        {portraitTab === 'age' && ageGroupData.map(group => (
                          <tr key={group.id} className="border-b cursor-pointer hover:bg-blue-50"
                              onClick={() => setSelectedGroup(group)}>
                            <td className="px-2 py-2">{group.group}</td>
                            <td className="px-2 py-2 text-center">{group.count}</td>
                            <td className="px-2 py-2 text-center">{group.ratio}%</td>
                            <td className={`px-2 py-2 text-center ${getTrendColor(group.trend)}`}>
                              {group.trend}
                            </td>
                          </tr>
                        ))}
                        
                        {portraitTab === 'identity' && identityData.map(item => (
                          <tr key={item.id} className="border-b cursor-pointer hover:bg-blue-50"
                              onClick={() => setSelectedGroup(item)}>
                            <td className="px-2 py-2">{item.type}</td>
                            <td className="px-2 py-2 text-center">{item.count}</td>
                            <td className="px-2 py-2 text-center">{item.ratio}%</td>
                            <td className={`px-2 py-2 text-center ${getTrendColor(item.trend)}`}>
                              {item.trend}
                            </td>
                          </tr>
                        ))}
                        
                        {portraitTab === 'role' && roleData.map(item => (
                          <tr key={item.id} className="border-b cursor-pointer hover:bg-blue-50"
                              onClick={() => setSelectedGroup(item)}>
                            <td className="px-2 py-2">{item.role}</td>
                            <td className="px-2 py-2 text-center">{item.count}</td>
                            <td className="px-2 py-2 text-center">{item.ratio}%</td>
                            <td className={`px-2 py-2 text-center ${getTrendColor(item.trend)}`}>
                              {item.trend}
                            </td>
                          </tr>
                        ))}
                        
                        {portraitTab === 'special' && specialGroupData.map(item => (
                          <tr key={item.id} className="border-b cursor-pointer hover:bg-blue-50"
                              onClick={() => setSelectedGroup(item)}>
                            <td className="px-2 py-2">{item.group}</td>
                            <td className="px-2 py-2 text-center">{item.count}</td>
                            <td className="px-2 py-2 text-center">{item.ratio}%</td>
                            <td className={`px-2 py-2 text-center ${getTrendColor(item.trend)}`}>
                              {item.trend}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="p-3 bg-blue-50 rounded text-sm flex-grow">
                  <div className="font-medium mb-1">群体特征分析</div>
                  <ul className="list-disc pl-5 space-y-1">
                    {portraitTab === 'age' && (
                      <>
                        <li>青年群体(18-35岁)是警情涉及的主要人群，占比42.3%</li>
                        <li>老年群体警情占比增长最快，环比增长8.6%</li>
                        <li>中年群体警情数量呈下降趋势，环比下降1.3%</li>
                        <li>未成年人相关警情多以校园欺凌和网络诈骗为主</li>
                      </>
                    )}
                    
                    {portraitTab === 'identity' && (
                      <>
                        <li>本地居民仍是警情涉及的主体，占比55.3%</li>
                        <li>游客相关警情环比增长最快，达15.2%</li>
                        <li>流动人口警情主要集中在商业区和城乡结合部</li>
                        <li>外来务工人员警情多与治安和纠纷类相关</li>
                      </>
                    )}
                    
                    {portraitTab === 'role' && (
                      <>
                        <li>报警人是警情中最多的角色类型，占比38.6%</li>
                        <li>受害人警情占比持续上升，环比增长3.5%</li>
                        <li>嫌疑人以18-35岁青年男性为主</li>
                        <li>证人占比最低，反映取证难度大</li>
                      </>
                    )}
                    
                    {portraitTab === 'special' && (
                      <>
                        <li>老年人相关警情呈快速上升趋势，环比增长8.6%</li>
                        <li>未成年人警情中，网络诈骗占比提升明显</li>
                        <li>残障人士相关警情主要是财产和权益受损</li>
                        <li>精神障碍患者相关警情处置难度大，需专业力量协助</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Grid for 群体特征关联 and 警务策略建议 */}
            {/* This lower grid's height also contributes to the overall perceived balance */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-blue-50 p-3 rounded h-full">
                <h3 className="font-medium mb-2">群体特征关联</h3>
                <div className="space-y-2 text-sm">
                  <ul className="list-disc pl-5">
                    {portraitTab === 'age' && (
                      <>
                        <li>未成年人相关警情高发区域为学校周边和网吧</li>
                        <li>青年群体警情集中在商业区和娱乐场所</li>
                        <li>中年群体警情主要与经济纠纷和交通事故相关</li>
                        <li>老年群体警情多为诈骗和社区纠纷类</li>
                        <li>节假日期间青年群体警情占比提升5-8个百分点</li>
                      </>
                    )}
                    
                    {portraitTab === 'identity' && (
                      <>
                        <li>本地居民警情主要集中在社区和居民区</li>
                        <li>外来务工人员警情高发区域为工业区和城乡结合部</li>
                        <li>流动人口警情与治安类事件关联度高</li>
                        <li>游客警情主要集中在景区、车站和商业区</li>
                        <li>节假日期间游客相关警情激增，占比提升10个百分点</li>
                      </>
                    )}
                    
                    {portraitTab === 'role' && (
                      <>
                        <li>报警人年龄分布广泛，以中青年为主</li>
                        <li>事主/受害人中老年人占比高于其人口比例</li>
                        <li>嫌疑人中未成年人占比逐年提升</li>
                        <li>多角色警情（事主、嫌疑人同时存在）处置难度大</li>
                        <li>嫌疑人教育水平与犯罪复杂程度呈正相关</li>
                      </>
                    )}
                    
                    {portraitTab === 'special' && (
                      <>
                        <li>老年人警情中诈骗占比高达42%</li>
                        <li>未成年人警情中网络相关占比35%</li>
                        <li>特殊群体警情处置平均耗时是普通警情的1.8倍</li>
                        <li>残障人士警情处置满意度较低，为68%</li>
                        <li>精神障碍患者相关警情重复率高，为28%</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
              
              <div className="bg-green-50 p-3 rounded h-full">
                <h3 className="font-medium mb-2">警务策略建议</h3>
                <div className="space-y-2 text-sm">
                  {portraitTab === 'age' && (
                    <ul className="list-disc pl-5">
                      <li>加强校园周边巡防，开展未成年人保护宣传</li>
                      <li>在娱乐场所集中区域增加警力，预防青年群体案事件</li>
                      <li>针对老年人开展反诈骗专项宣传，增强防范意识</li>
                      <li>对不同年龄段群体采取差异化的宣传教育方式</li>
                    </ul>
                  )}
                  
                  {portraitTab === 'identity' && (
                    <ul className="list-disc pl-5">
                      <li>加强对外来人口聚集区域的巡查力度</li>
                      <li>在旅游旺季增加景区和交通枢纽警力配置</li>
                      <li>针对流动人口开展法律法规宣传教育</li>
                      <li>建立本地居民与外来人口的融合互助机制</li>
                    </ul>
                  )}
                  
                  {portraitTab === 'role' && (
                    <ul className="list-disc pl-5">
                      <li>提升证人保护机制，鼓励群众作证</li>
                      <li>针对青少年嫌疑人开展预防性教育</li>
                      <li>优化受害人关怀服务，提高救助效率</li>
                      <li>对常见报警人建立警情信息反馈机制</li>
                    </ul>
                  )}
                  
                  {portraitTab === 'special' && (
                    <ul className="list-disc pl-5">
                      <li>组建专门队伍处理特殊群体相关警情</li>
                      <li>对接专业社会力量，提供针对性服务</li>
                      <li>在社区开展老年人反诈骗专项宣传</li>
                      <li>建立精神障碍患者档案，实现精准预警</li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 警力资源分析面板 */}
        {mainTab === 'resource' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">警力资源分析</h2>
              <div className="flex">
                <div 
                  className={`px-3 py-1 text-sm cursor-pointer ${resourceTab === 'distribution' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
                  onClick={() => setResourceTab('distribution')}
                >
                  警力分布
                </div>
                <div 
                  className={`px-3 py-1 text-sm cursor-pointer ${resourceTab === 'match' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
                  onClick={() => setResourceTab('match')}
                >
                  警情匹配度
                </div>
                <div 
                  className={`px-3 py-1 text-sm cursor-pointer ${resourceTab === 'workload' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
                  onClick={() => setResourceTab('workload')}
                >
                  工作负荷
                </div>
                <div 
                  className={`px-3 py-1 text-sm cursor-pointer ${resourceTab === 'optimize' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
                  onClick={() => setResourceTab('optimize')}
                >
                  优化建议
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-5 gap-4">
              <div className="col-span-3 bg-white border rounded p-3" style={{ height: '400px' }}>
                {renderResourceChart()}
              </div>
              
              <div className="col-span-2 flex flex-col">
                <div>
                  <div className="font-medium mb-2">
                    {resourceTab === 'distribution' ? '各区域警力分布' : 
                     resourceTab === 'match' ? '警情警力匹配度' : 
                     resourceTab === 'workload' ? '警力工作负荷' :
                     '优化调整建议'}
                  </div>
                  <div className="overflow-y-auto max-h-[250px] mb-3">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                        <th className="px-2 py-2 text-left font-medium text-gray-500">
                            {resourceTab === 'distribution' ? '区域' : 
                             resourceTab === 'match' ? '区域' : 
                             resourceTab === 'workload' ? '区域' :
                             '调整方向'}
                          </th>
                          <th className="px-2 py-2 text-center font-medium text-gray-500">
                            {resourceTab === 'distribution' ? '警力数量' : 
                             resourceTab === 'match' ? '匹配度' : 
                             resourceTab === 'workload' ? '工作负荷' :
                             '调整幅度'}
                          </th>
                          <th className="px-2 py-2 text-center font-medium text-gray-500">
                            {resourceTab === 'distribution' ? '占比' : 
                             resourceTab === 'match' ? '状态' : 
                             resourceTab === 'workload' ? '状态' :
                             '预期效果'}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {resourceTab === 'distribution' && policeResourceData.map(item => (
                          <tr key={item.id} className="border-b cursor-pointer hover:bg-blue-50">
                            <td className="px-2 py-2">{item.area}</td>
                            <td className="px-2 py-2 text-center">{item.police}</td>
                            <td className="px-2 py-2 text-center">{Math.round(item.police/policeResourceData.reduce((sum, i) => sum + i.police, 0)*100)}%</td>
                          </tr>
                        ))}
                        
                        {resourceTab === 'match' && policeResourceData.map(item => (
                          <tr key={item.id} className="border-b cursor-pointer hover:bg-blue-50">
                            <td className="px-2 py-2">{item.area}</td>
                            <td className="px-2 py-2 text-center">{item.ratio}</td>
                            <td className={`px-2 py-2 text-center ${getMatchColor(item.ratio)}`}>
                              {item.ratio >= 1.2 ? '充足' : item.ratio >= 0.8 ? '一般' : '不足'}
                            </td>
                          </tr>
                        ))}
                        
                        {resourceTab === 'workload' && policeResourceData.map(item => (
                          <tr key={item.id} className="border-b cursor-pointer hover:bg-blue-50">
                            <td className="px-2 py-2">{item.area}</td>
                            <td className="px-2 py-2 text-center">{item.workload}</td>
                            <td className={`px-2 py-2 text-center ${item.workload > 150 ? 'text-red-500' : item.workload > 130 ? 'text-yellow-500' : 'text-green-500'}`}>
                              {item.workload > 150 ? '过载' : item.workload > 130 ? '较高' : '正常'}
                            </td>
                          </tr>
                        ))}
                        
                        {resourceTab === 'optimize' && (
                          <>
                            <tr className="border-b cursor-pointer hover:bg-blue-50">
                              <td className="px-2 py-2">西部片区</td>
                              <td className="px-2 py-2 text-center text-red-500">+8</td>
                              <td className="px-2 py-2 text-center">匹配度提升22%</td>
                            </tr>
                            <tr className="border-b cursor-pointer hover:bg-blue-50">
                              <td className="px-2 py-2">北部片区</td>
                              <td className="px-2 py-2 text-center text-red-500">+6</td>
                              <td className="px-2 py-2 text-center">匹配度提升18%</td>
                            </tr>
                            <tr className="border-b cursor-pointer hover:bg-blue-50">
                              <td className="px-2 py-2">中心城区</td>
                              <td className="px-2 py-2 text-center text-green-500">-4</td>
                              <td className="px-2 py-2 text-center">资源优化利用</td>
                            </tr>
                            <tr className="border-b cursor-pointer hover:bg-blue-50">
                              <td className="px-2 py-2">东部片区</td>
                              <td className="px-2 py-2 text-center text-green-500">-3</td>
                              <td className="px-2 py-2 text-center">资源调配优化</td>
                            </tr>
                            <tr className="border-b cursor-pointer hover:bg-blue-50">
                              <td className="px-2 py-2">南部片区</td>
                              <td className="px-2 py-2 text-center text-green-500">-2</td>
                              <td className="px-2 py-2 text-center">保持基本平衡</td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-8 p-4 bg-blue-50 rounded text-sm flex-grow">
                    <div className="font-medium mb-1">资源分析结论</div>
                    <ul className="list-disc pl-5 space-y-1">
                      {resourceTab === 'distribution' && (
                        <>
                          <li>中心城区警力配置最多，占比26.1%</li>
                          <li>东部片区次之，占比22.5%</li>
                          <li>北部片区警力最少，仅占15.3%</li>
                          <li>整体警力分布呈现"中心集中、周边分散"特点</li>
                        </>
                      )}
                      
                      {resourceTab === 'match' && (
                        <>
                          <li>中心城区警情警力匹配度最高，达1.4</li>
                          <li>北部片区匹配度最低，仅为0.8</li>
                          <li>西部片区匹配度较低，为0.9，警力资源紧张</li>
                          <li>40%区域警力配置与警情数量不匹配</li>
                        </>
                      )}
                      
                      {resourceTab === 'workload' && (
                        <>
                          <li>北部片区警力工作负荷最高，达162</li>
                          <li>西部片区次之，为156，警力处于过载状态</li>
                          <li>中心城区警力工作负荷最低，为115</li>
                          <li>警力工作负荷与警情警力匹配度呈负相关</li>
                        </>
                      )}
                      
                      {resourceTab === 'optimize' && (
                        <>
                          <li>建议西部片区和北部片区增加警力配置</li>
                          <li>中心城区可适当调减警力至其他区域</li>
                          <li>优化后预计整体匹配度提升15%</li>
                          <li>优化后预计超负荷警力比例下降28%</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-blue-50 p-3 rounded h-full">
                <h3 className="font-medium mb-2">警情分布特征</h3>
                <div className="space-y-2 text-sm">
                  {resourceTab === 'distribution' && (
                    <ul className="list-disc pl-5">
                      <li>居民区与商业区警力布控密度最高</li>
                      <li>交通干道沿线次之，主要为交警力量</li>
                      <li>警力配置呈现明显的时间段差异</li>
                      <li>周末警力配置较工作日提升12%</li>
                      <li>特殊时期（节假日、重大活动）警力配置动态调整</li>
                    </ul>
                  )}
                  
                  {resourceTab === 'match' && (
                    <ul className="list-disc pl-5">
                      <li>商业区警情多、警力配置高，匹配度较好</li>
                      <li>城乡结合部警情多、警力配置低，匹配度较差</li>
                      <li>匹配度与警情类型关联度高</li>
                      <li>交通类警情与警力匹配度最高</li>
                      <li>纠纷类警情与警力匹配度最低</li>
                    </ul>
                  )}
                  
                  {resourceTab === 'workload' && (
                    <ul className="list-disc pl-5">
                      <li>北部片区警力平均每周加班12小时</li>
                      <li>西部片区警力出勤率达142%</li>
                      <li>工作负荷与警员离职率呈正相关</li>
                      <li>高负荷区域警情处置时间平均延长25%</li>
                      <li>长期高负荷运转影响警务质量和满意度</li>
                    </ul>
                  )}
                  
                  {resourceTab === 'optimize' && (
                    <ul className="list-disc pl-5">
                      <li>调整后预计警情响应时间平均缩短18%</li>
                      <li>调整后预计警员工作满意度提升15%</li>
                      <li>调整成本较低，主要为人员调配</li>
                      <li>分阶段实施可降低对警务工作的影响</li>
                      <li>调整周期建议为3个月，可根据效果动态优化</li>
                    </ul>
                  )}
                </div>
              </div>
              
              <div className="bg-green-50 p-3 rounded h-full">
                <h3 className="font-medium mb-2">优化策略建议</h3>
                <div className="space-y-2 text-sm">
                  {resourceTab === 'distribution' && (
                    <ul className="list-disc pl-5">
                      <li>建立警力分布与人口密度、警情密度的关联模型</li>
                      <li>制定科学的警力分布评估标准</li>
                      <li>适当增加边远地区警力配置</li>
                      <li>探索警种融合机制，提高整体警务效能</li>
                    </ul>
                  )}
                  
                  {resourceTab === 'match' && (
                    <ul className="list-disc pl-5">
                      <li>定期评估警情警力匹配度，动态调整配置</li>
                      <li>西部片区和北部片区建议增加警力配置</li>
                      <li>建立警情预测模型，实现前置警力部署</li>
                      <li>引入社会力量参与治安防控，缓解警力不足</li>
                    </ul>
                  )}
                  
                  {resourceTab === 'workload' && (
                    <ul className="list-disc pl-5">
                      <li>制定警力工作负荷标准，避免长期过载</li>
                      <li>建立警力支援机制，及时调配增援</li>
                      <li>采用科技手段提升警务效能，减轻人力负担</li>
                      <li>探索警务协作新模式，优化资源配置</li>
                    </ul>
                  )}
                  
                  {resourceTab === 'optimize' && (
                    <ul className="list-disc pl-5">
                      <li>先增加西部和北部片区警力，后调减中心城区</li>
                      <li>引入智能预警系统，提升警力调配科学性</li>
                      <li>建立季度警力配置评估与调整机制</li>
                      <li>加强区域间警务协作，提高整体应对能力</li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 民警绩效评估面板 */}        
        {mainTab === 'performance' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">民警绩效评估</h2>
              <div className="flex">
                <div 
                  className={`px-3 py-1 text-sm cursor-pointer ${performanceTab === 'efficiency' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
                  onClick={() => setPerformanceTab('efficiency')}
                >
                  警情处置效率
                </div>
                <div 
                  className={`px-3 py-1 text-sm cursor-pointer ${performanceTab === 'count' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
                  onClick={() => setPerformanceTab('count')}
                >
                  警情处置数量
                </div>
                <div 
                  className={`px-3 py-1 text-sm cursor-pointer ${performanceTab === 'rate' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
                  onClick={() => setPerformanceTab('rate')}
                >
                  警情处置率
                </div>
                <div 
                  className={`px-3 py-1 text-sm cursor-pointer ${performanceTab === 'satisfaction' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
                  onClick={() => setPerformanceTab('satisfaction')}
                >
                  群众满意度
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-5 gap-4">
              <div className="col-span-3 bg-white border rounded p-3" style={{ height: '380px' }}>
                {renderPerformanceChart()}
              </div>
              
              <div className="col-span-2 flex flex-col">
                <div> {/* This div wraps the title and the table an helps with flex structure */} 
                  <div className="font-medium mb-2">
                    {performanceTab === 'efficiency' ? '处置效率排名' : 
                    performanceTab === 'count' ? '处置数量排名' : 
                    performanceTab === 'rate' ? '处置率排名' :
                    '满意度排名'}
                  </div>
                  <div className="overflow-y-auto max-h-[250px] mb-3">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-2 py-2 text-left font-medium text-gray-500">警种</th>
                          <th className="px-2 py-2 text-center font-medium text-gray-500">
                            {performanceTab === 'efficiency' ? '平均时长(小时)' : 
                             performanceTab === 'count' ? '处置数量' : 
                             performanceTab === 'rate' ? '处置率' :
                             '满意度'}
                          </th>
                          <th className="px-2 py-2 text-center font-medium text-gray-500">
                            {performanceTab === 'efficiency' ? '状态' : 
                             performanceTab === 'count' ? '占比' : 
                             performanceTab === 'rate' ? '状态' :
                             '评价'}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {performanceTab === 'efficiency' && [...policePerformanceData].sort((a, b) => a.avgTime - b.avgTime).map(item => (
                          <tr key={item.id} className="border-b cursor-pointer hover:bg-blue-50">
                            <td className="px-2 py-2">{item.police}</td>
                            <td className="px-2 py-2 text-center">{item.avgTime}</td>
                            <td className={`px-2 py-2 text-center ${item.avgTime < 1.5 ? 'text-green-500' : item.avgTime < 3 ? 'text-yellow-500' : 'text-red-500'}`}>
                              {item.avgTime < 1.5 ? '优秀' : item.avgTime < 3 ? '良好' : '一般'}
                            </td>
                          </tr>
                        ))}
                        
                        {performanceTab === 'count' && [...policePerformanceData].sort((a, b) => b.caseCount - a.caseCount).map(item => (
                          <tr key={item.id} className="border-b cursor-pointer hover:bg-blue-50">
                            <td className="px-2 py-2">{item.police}</td>
                            <td className="px-2 py-2 text-center">{item.caseCount}</td>
                            <td className="px-2 py-2 text-center">
                              {Math.round(item.caseCount/policePerformanceData.reduce((sum, i) => sum + i.caseCount, 0)*100)}%
                            </td>
                          </tr>
                        ))}
                        
                        {performanceTab === 'rate' && [...policePerformanceData].sort((a, b) => b.solveRate - a.solveRate).map(item => (
                          <tr key={item.id} className="border-b cursor-pointer hover:bg-blue-50">
                            <td className="px-2 py-2">{item.police}</td>
                            <td className="px-2 py-2 text-center">{item.solveRate}%</td>
                            <td className={`px-2 py-2 text-center ${item.solveRate > 90 ? 'text-green-500' : item.solveRate > 80 ? 'text-yellow-500' : 'text-red-500'}`}>
                              {item.solveRate > 90 ? '优秀' : item.solveRate > 80 ? '良好' : '一般'}
                            </td>
                          </tr>
                        ))}
                        
                        {performanceTab === 'satisfaction' && (
                          <>
                            <tr className="border-b cursor-pointer hover:bg-blue-50">
                              <td className="px-2 py-2">交警大队</td>
                              <td className="px-2 py-2 text-center">92.6%</td>
                              <td className="px-2 py-2 text-center text-green-500">优秀</td>
                            </tr>
                            <tr className="border-b cursor-pointer hover:bg-blue-50">
                              <td className="px-2 py-2">巡警大队</td>
                              <td className="px-2 py-2 text-center">90.8%</td>
                              <td className="px-2 py-2 text-center text-green-500">优秀</td>
                            </tr>
                            <tr className="border-b cursor-pointer hover:bg-blue-50">
                              <td className="px-2 py-2">治安大队</td>
                              <td className="px-2 py-2 text-center">87.2%</td>
                              <td className="px-2 py-2 text-center text-yellow-500">良好</td>
                            </tr>
                            <tr className="border-b cursor-pointer hover:bg-blue-50">
                              <td className="px-2 py-2">社区警务</td>
                              <td className="px-2 py-2 text-center">85.4%</td>
                              <td className="px-2 py-2 text-center text-yellow-500">良好</td>
                            </tr>
                            <tr className="border-b cursor-pointer hover:bg-blue-50">
                              <td className="px-2 py-2">刑侦大队</td>
                              <td className="px-2 py-2 text-center">78.3%</td>
                              <td className="px-2 py-2 text-center text-red-500">一般</td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 rounded text-sm flex-grow">
                    <div className="font-medium mb-1">绩效分析结论</div>
                    <ul className="list-disc pl-5 space-y-1">
                      {performanceTab === 'efficiency' && (
                        <>
                          <li>交警大队警情处置效率最高，平均用时0.8小时</li>
                          <li>刑侦大队处置时长最长，反映案件复杂性</li>
                          <li>处置效率与警情类型关联度高</li>
                          <li>整体处置效率环比提升5.2%</li>
                        </>
                      )}
                      
                      {performanceTab === 'count' && (
                        <>
                          <li>交警大队处置警情数量最多，占比26.2%</li>
                          <li>刑侦大队处置数量最少，主要处理复杂案件</li>
                          <li>处置数量与辖区特点和警种职能相关</li>
                          <li>处置总量环比增长3.8%</li>
                        </>
                      )}
                      
                      {performanceTab === 'rate' && (
                        <>
                          <li>交警大队警情处置率最高，达93.8%</li>
                          <li>刑侦大队处置率相对较低，为72.5%</li>
                          <li>整体警情处置率为84.7%</li>
                          <li>处置率环比提升2.5个百分点</li>
                        </>
                      )}
                      
                      {performanceTab === 'satisfaction' && (
                        <>
                          <li>交警大队群众满意度最高，达92.6%</li>
                          <li>刑侦大队满意度较低，为78.3%</li>
                          <li>整体满意度为86.9%</li>
                          <li>满意度环比提升1.8个百分点</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-blue-50 p-3 rounded h-full">
                <h3 className="font-medium mb-2">绩效关联分析</h3>
                <div className="space-y-2 text-sm">
                  {performanceTab === 'efficiency' && (
                    <ul className="list-disc pl-5">
                      <li>处置效率与警情类型高度相关</li>
                      <li>简单警情（交通、噪音）处置效率高</li>
                      <li>复杂警情（刑事案件）处置耗时长</li>
                      <li>效率与警力配置呈正相关</li>
                      <li>科技手段应用程度与效率呈正相关</li>
                    </ul>
                  )}
                  
                  {performanceTab === 'count' && (
                    <ul className="list-disc pl-5">
                      <li>处置数量与辖区特点高度相关</li>
                      <li>商业区域交通类警情占比高</li>
                      <li>居民区噪音、纠纷类警情多</li>
                      <li>节假日警情数量增加，处置压力大</li>
                      <li>警情数量与警力规模呈正相关</li>
                    </ul>
                  )}
                  
                  {performanceTab === 'rate' && (
                    <ul className="list-disc pl-5">
                      <li>简单警情处置率高，复杂警情处置率低</li>
                      <li>处置率与警力配置呈正相关</li>
                      <li>警情量波峰期处置率下降</li>
                      <li>处置率与处置时效性呈负相关</li>
                      <li>科技手段应用提高处置率5-8个百分点</li>
                    </ul>
                  )}
                  
                  {performanceTab === 'satisfaction' && (
                    <ul className="list-disc pl-5">
                      <li>满意度与处置效率呈正相关</li>
                      <li>满意度与警情结果关联性强</li>
                      <li>交通类警情满意度普遍较高</li>
                      <li>纠纷类警情满意度普遍较低</li>
                      <li>民警态度是影响满意度的关键因素</li>
                    </ul>
                  )}
                </div>
              </div>
              
              <div className="bg-green-50 p-3 rounded h-full">
                <h3 className="font-medium mb-2">提升策略建议</h3>
                <div className="space-y-2 text-sm">
                  {performanceTab === 'efficiency' && (
                    <ul className="list-disc pl-5">
                      <li>引入智能辅助系统，提高简单警情处置效率</li>
                      <li>优化复杂警情处置流程，减少环节</li>
                      <li>加强警种协同，形成处置合力</li>
                      <li>制定分类处置标准，提高规范化水平</li>
                    </ul>
                  )}
                  
                  {performanceTab === 'count' && (
                    <ul className="list-disc pl-5">
                      <li>提升警力调配科学性，匹配警情分布</li>
                      <li>采用"专班+专人"模式处置高发警情</li>
                      <li>建立警情互助机制，合理分担工作量</li>
                      <li>关注民警体能和心理健康，保持良好状态</li>
                    </ul>
                  )}
                  
                  {performanceTab === 'rate' && (
                    <ul className="list-disc pl-5">
                      <li>完善警情督办机制，确保及时处置</li>
                      <li>制定疑难警情会商制度，集思广益</li>
                      <li>加强对复杂警情的资源倾斜</li>
                      <li>建立警情处置过程评估机制</li>
                    </ul>
                  )}
                  
                  {performanceTab === 'satisfaction' && (
                    <ul className="list-disc pl-5">
                      <li>强化服务意识，提升沟通能力</li>
                      <li>优化处警全流程体验，提高专业性</li>
                      <li>建立警情回访制度，及时纠正问题</li>
                      <li>针对满意度低的警种开展专项提升行动</li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div> {/* Closing tag for the main tabs container div */}
      
      {/* 辅助信息面板 */}
      <div className="bg-white p-4 rounded shadow">
        <div className="mb-2 font-medium">警务工作辅助信息</div>
        <div className="grid grid-cols-3 gap-4">
          <div className="border rounded p-3">
            <div className="text-sm text-gray-500 mb-1">警情总量</div>
            <div className="flex justify-between items-center">
              <div className="text-lg font-bold">1,228</div>
              <div className="text-sm text-red-500">+4.5%</div>
            </div>
            <div className="text-xs text-gray-500 mt-1">较上期增加53起</div>
          </div>
          
          <div className="border rounded p-3">
            <div className="text-sm text-gray-500 mb-1">警情处置率</div>
            <div className="flex justify-between items-center">
              <div className="text-lg font-bold">84.7%</div>
              <div className="text-sm text-green-500">+2.5%</div>
            </div>
            <div className="text-xs text-gray-500 mt-1">较上期提升2.5个百分点</div>
          </div>
          
          <div className="border rounded p-3">
            <div className="text-sm text-gray-500 mb-1">平均处置时长</div>
            <div className="flex justify-between items-center">
              <div className="text-lg font-bold">2.6小时</div>
              <div className="text-sm text-green-500">-0.3小时</div>
            </div>
            <div className="text-xs text-gray-500 mt-1">较上期缩短18分钟</div>
          </div>
          
          <div className="border rounded p-3">
            <div className="text-sm text-gray-500 mb-1">涉及人员数</div>
            <div className="flex justify-between items-center">
              <div className="text-lg font-bold">2,476</div>
              <div className="text-sm text-red-500">+3.8%</div>
            </div>
            <div className="text-xs text-gray-500 mt-1">较上期增加91人</div>
          </div>
          
          <div className="border rounded p-3">
            <div className="text-sm text-gray-500 mb-1">警力总量</div>
            <div className="flex justify-between items-center">
              <div className="text-lg font-bold">249</div>
              <div className="text-sm text-green-500">+1.2%</div>
            </div>
            <div className="text-xs text-gray-500 mt-1">较上期增加3人</div>
          </div>
          
          <div className="border rounded p-3">
            <div className="text-sm text-gray-500 mb-1">群众满意度</div>
            <div className="flex justify-between items-center">
              <div className="text-lg font-bold">86.9%</div>
              <div className="text-sm text-green-500">+1.8%</div>
            </div>
            <div className="text-xs text-gray-500 mt-1">较上期提升1.8个百分点</div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PersonnelAnalysis;
