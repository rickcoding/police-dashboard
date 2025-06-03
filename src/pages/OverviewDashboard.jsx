import React, { useState } from 'react';
import Layout from '../components/Layout';
import { MapContainer, TileLayer } from 'react-leaflet';
import HeatmapLayer from '../components/HeatmapLayer';
import 'leaflet/dist/leaflet.css';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import 'chart.js/auto';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, Cell 
} from 'recharts';

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

// 创建用于显示的网格数据
const createHeatmapGrid = () => {
  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  const grid = [];
  
  for (let hour = 0; hour < 24; hour++) {
    const rowData = { hour: `${hour}:00` };
    days.forEach(day => {
      const cellData = timeHeatmapData.find(d => d.day === day && d.hour === hour);
      rowData[day] = cellData ? cellData.density : 0;
    });
    grid.push(rowData);
  }
  
  return grid;
};

const TimeHeatmap = () => {
  const [selectedCell, setSelectedCell] = useState(null);
  const gridData = createHeatmapGrid();
  
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

const OverviewDashboard = () => {
  // 警情趋势分析数据
  const trendData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`), // 24 小时
    datasets: [
      {
        label: '警情量',
        data: [5, 3, 2, 1, 1, 2, 3, 5, 8, 12, 15, 20, 25, 30, 35, 40, 38, 32, 28, 25, 20, 15, 10, 6], // 示例数据
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.4,
      },
    ],
  };

  // 警情类型分布数据
  const typeData = {
    labels: ['刑事类', '治安类', '交通类', '其他'],
    datasets: [
      {
        data: [35, 25, 20, 20], // 示例数据
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  return (
    <Layout title="综合态势总览">
      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-gray-500 text-sm mb-1">今日警情总数</div>
          <div className="text-3xl font-bold mb-2">128</div>
          <div className="flex items-center text-red-500 text-sm">
            <span className="mr-1">↑</span> 12.5% 较昨日
          </div>
          <div className="absolute top-4 right-4 w-12 h-12 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center opacity-20 text-2xl">📊</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-gray-500 text-sm mb-1">警情处置率</div>
          <div className="text-3xl font-bold mb-2">85.7%</div>
          <div className="flex items-center text-green-500 text-sm">
            <span className="mr-1">↑</span> 3.2% 较昨日
          </div>
          <div className="absolute top-4 right-4 w-12 h-12 bg-green-100 text-green-500 rounded-full flex items-center justify-center opacity-20 text-2xl">✓</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-gray-500 text-sm mb-1">平均响应时间</div>
          <div className="text-3xl font-bold mb-2">4.8分钟</div>
          <div className="flex items-center text-green-500 text-sm">
            <span className="mr-1">↓</span> 8.6% 较昨日
          </div>
          <div className="absolute top-4 right-4 w-12 h-12 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center opacity-20 text-2xl">⏱️</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-gray-500 text-sm mb-1">活跃预警</div>
          <div className="text-3xl font-bold mb-2">18</div>
          <div className="flex items-center text-orange-500 text-sm">
            <span>⚠️</span> 高危预警 5 个
          </div>
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
              <div className="px-2 py-1 text-blue-500 border-b-2 border-blue-500 cursor-pointer">24小时</div>
              <div className="px-2 py-1 text-gray-400 cursor-pointer">7天</div>
              <div className="px-2 py-1 text-gray-400 cursor-pointer">30天</div>
            </div>
          </div>
          <div className="h-64">
            <Line data={trendData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold">警情类型分布</h2>
            <div className="flex">
              <div className="px-2 py-1 text-blue-500 border-b-2 border-blue-500 cursor-pointer">按警种</div>
              <div className="px-2 py-1 text-gray-400 cursor-pointer">按案件</div>
              <div className="px-2 py-1 text-gray-400 cursor-pointer">按区域</div>
            </div>
          </div>
          <div className="h-64">
            <Pie data={typeData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* 预警信息和热点区域 */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold">预警信息</h2>
            <div className="text-blue-500 text-sm cursor-pointer">查看全部</div>
          </div>
          <div className="space-y-3">
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r">
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
                <div className="text-blue-500 cursor-pointer">查看详情</div>
              </div>
            </div>
            <div className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded-r">
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
                <div className="text-blue-500 cursor-pointer">查看详情</div>
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
    </Layout>
  );
};

export default OverviewDashboard;