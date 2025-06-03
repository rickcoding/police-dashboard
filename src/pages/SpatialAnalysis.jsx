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
          <div className="p-2 bg-gray-50 rounded">
            <div className="text-2xl font-bold text-red-500">5</div>
            <div className="text-sm text-gray-500">高风险区域</div>
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
          <div className="flex">
            <button className="px-3 py-1 bg-blue-100 text-blue-500 rounded text-sm mr-2">
              播放动画
            </button>
            <select className="px-3 py-1 bg-gray-100 text-sm rounded">
              <option value="1h">1小时间隔</option>
              <option value="3h">3小时间隔</option>
              <option value="6h">6小时间隔</option>
              <option value="12h">12小时间隔</option>
              <option value="1d">1天间隔</option>
              <option value="1w">1周间隔</option>
              <option value="1m">1月间隔</option>
            </select>
          </div>
        </div>
        
        <div className="h-64 bg-gray-100 rounded flex items-center justify-center mb-3">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-500 mb-2">警情空间分布动态演变</div>
            <div className="text-sm text-gray-400">展示警情热点随时间变化的动态演变过程</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-3 rounded">
            <h3 className="font-medium mb-2">时空演变规律</h3>
            <ul className="list-disc pl-5 text-sm space-y-2">
              <li>商业区警情热点在工作日向周边扩散，周末集中在核心区域</li>
              <li>交通类警情热点随早晚高峰在主要道路上移动</li>
              <li>夜间警情热点主要集中在娱乐场所和居民区</li>
              <li>警情热点整体呈现"工作日分散、周末集中"的周期性变化</li>
            </ul>
          </div>
          
          <div className="bg-green-50 p-3 rounded">
            <h3 className="font-medium mb-2">预测与建议</h3>
            <ul className="list-disc pl-5 text-sm space-y-2">
              <li>预计本周末XX商圈将形成新的警情高发区</li>
              <li>建议在早晚高峰时段增派警力巡逻主要交通路口</li>
              <li>XX广场周边区域夜间警情有上升趋势，建议加强巡防</li>
              <li>根据热点迁移趋势，下周应重点关注城东新开发区域</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* 选中区域详情模态框 */}
      {selectedArea && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl">
            <div className="p-5 border-b border-gray-200 flex justify-between">
              <div className="font-bold text-lg">区域详情 - {selectedArea.name}</div>
              <button className="text-2xl" onClick={() => setSelectedArea(null)}>&times;</button>
            </div>
            <div className="p-5 grid grid-cols-2 gap-4">
              <div>
                <div className="h-48 bg-gray-100 rounded flex items-center justify-center mb-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-500">区域地图</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-xs text-gray-500">警情总数</div>
                    <div className="text-lg font-bold">{selectedArea.count}</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-xs text-gray-500">主要类型</div>
                    <div className="text-lg font-bold">{selectedArea.type}</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-xs text-gray-500">风险等级</div>
                    <div className="text-lg font-bold text-red-500">
                      {selectedArea.risk === 'high' ? '高' : selectedArea.risk === 'medium' ? '中' : '低'}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-xs text-gray-500">环比变化</div>
                    <div className="text-lg font-bold text-red-500">+12.5%</div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">区域警情分析</h3>
                <div className="space-y-3 text-sm">
                  <p className="bg-blue-50 p-2 rounded">
                    该区域为辖区内警情高发区，主要以{selectedArea.type}类警情为主，占总量的62%。警情多发生在18:00-22:00时段。
                  </p>
                  <h4 className="font-medium">成因分析</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>商业密集区人流量大</li>
                    <li>周边交通路网复杂</li>
                    <li>夜间照明不足</li>
                    <li>周边娱乐场所集中</li>
                  </ul>
                  <h4 className="font-medium">建议措施</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>增派警力定点巡逻</li>
                    <li>设置临时警务点</li>
                    <li>加强视频监控覆盖</li>
                    <li>开展针对性宣传工作</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-gray-200 flex justify-end">
              <button 
                className="bg-gray-200 px-4 py-2 rounded mr-2"
                onClick={() => setSelectedArea(null)}
              >
                关闭
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded">
                详细报告
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default SpatialAnalysis;