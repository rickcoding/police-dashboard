import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, Filler } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler
);

const TimeDimensionAnalysis = () => {
  // 状态管理 - 实际应用会使用更复杂的状态管理
  const [timeUnit, setTimeUnit] = useState('hour');
  const [timeRange, setTimeRange] = useState('week');
  const [compareType, setCompareType] = useState('yoy');
  const [analysisTab, setAnalysisTab] = useState('distribution');
  const [patternTab, setPatternTab] = useState('weekday');
  const [trendTab, setTrendTab] = useState('short');
  
  // 模拟警情高发时段数据 (0-23时)
  const hourlyData = [
    5, 3, 2, 2, 3, 5, 12, 25, 32, 28, 25, 30, 
    35, 32, 28, 30, 35, 45, 50, 42, 35, 25, 15, 8
  ];
  
  // 返回对应小时的警情风险等级颜色
  const getHourColor = (value) => {
    if (value >= 40) return 'bg-red-500';
    if (value >= 25) return 'bg-orange-500';
    if (value >= 15) return 'bg-yellow-500';
    return 'bg-green-500';
  };

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

  const weekdayOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '工作日与周末警情对比',
      },
    },
  };

  // 未来7天警情量预测数据
  const shortTrendData = {
    labels: ['2025-05-07', '2025-05-08', '2025-05-09', '2025-05-10', '2025-05-11', '2025-05-12', '2025-05-13'],
    datasets: [
      {
        label: '警情量预测',
        data: [130, 140, 135, 150, 138, 132, 127], // 示例数据
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.4,
        fill: false,
      },
      {
        label: '置信区间上限',
        data: [140, 150, 145, 160, 148, 142, 137], // 示例数据
        borderColor: 'rgba(54, 162, 235, 0.0)',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        fill: '+1',
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 0,
      },
      {
        label: '置信区间下限',
        data: [120, 130, 125, 140, 128, 122, 117], // 示例数据
        borderColor: 'rgba(54, 162, 235, 0.0)',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        fill: false,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 0,
      },
    ],
  };

  const shortTrendOptions = {
    responsive: true,
    maintainAspectRatio: false, // 禁用纵横比，允许自由调整大小
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '未来7天警情量预测',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: '日期',
        },
      },
      y: {
        title: {
          display: true,
          text: '警情量',
        },
        min: 0,
      },
    },
  };

  const mediumTrendData = {
    labels: Array.from({ length: 30 }, (_, i) => `2025-05-${7 + i}`), // 示例日期
    datasets: [
      {
        label: '警情量预测',
        data: Array.from({ length: 30 }, () => 138 + Math.random() * 10 - 5), // 示例数据
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        pointRadius: 0,
        tension: 0.4,
        fill: false,
      },
      {
        label: '置信区间上限',
        data: Array.from({ length: 30 }, () => 148 + Math.random() * 10 - 5), // 示例数据
        borderColor: 'rgba(54, 162, 235, 0.0)',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        fill: '+1',
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 0,
      },
      {
        label: '置信区间下限',
        data: Array.from({ length: 30 }, () => 128 + Math.random() * 10 - 5), // 示例数据
        borderColor: 'rgba(54, 162, 235, 0.0)',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        fill: false,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 0,
      },
    ],
  };

  const mediumTrendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '未来30天警情量预测',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: '日期',
        },
      },
      y: {
        title: {
          display: true,
          text: '警情量',
        },
        min: 0,
      },
    },
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
            <div className="mb-3 text-sm text-gray-500">全天24小时警情分布</div>
            <div className="flex items-end h-48 space-x-2 mb-2">
              {hourlyData.map((value, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div 
                    className={`w-full ${getHourColor(value)}`}
                    style={{ height: `${value * 2}px` }}
                  ></div>
                  <div className="text-xs mt-1">{index}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <div className="text-sm">
                <span className="font-medium">高发时段：</span>18:00-20:00
              </div>
              <div className="text-sm">
                <span className="font-medium">峰值时段：</span>19:00 (50起警情)
              </div>
              <div className="text-sm">
                <span className="font-medium">低谷时段：</span>02:00-04:00
              </div>
              <div className="text-sm text-blue-500 cursor-pointer">
                查看详细分析 →
              </div>
            </div>
          </div>
        )}
        
        {analysisTab === 'heatmap' && (
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-500 mb-2">时段热力图</div>
              <div className="text-sm text-gray-400">显示一周内各时段警情密度分布</div>
            </div>
          </div>
        )}
        
        {analysisTab === 'comparison' && (
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-500 mb-2">时段对比图</div>
              <div className="text-sm text-gray-400">对比不同日期类型的时段分布差异</div>
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
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            {/* 周期对比图表 */}
            {patternTab === 'weekday' && <Bar data={weekdayData} options={weekdayOptions} />}
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
        
        <div className="h-64 bg-gray-100 rounded flex items-center justify-center mb-3">
          {/* 趋势预测图 */}
          {trendTab === 'short' && <Line data={shortTrendData} options={shortTrendOptions} />}
          {trendTab === 'medium' && <Line data={mediumTrendData} options={mediumTrendOptions} />}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded">
            <h3 className="font-medium mb-2">预测与异常</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>预计未来{trendTab === 'short' ? '7天' : trendTab === 'medium' ? '30天' : '3个月'}警情总量:</span>
                <span className="font-bold">{trendTab === 'short' ? '952' : trendTab === 'medium' ? '4,125' : '12,670'} 起</span>
              </div>
              <div className="flex justify-between">
                <span>预计日均警情量:</span>
                <span className="font-bold">{trendTab === 'short' ? '136' : trendTab === 'medium' ? '138' : '141'} 起</span>
              </div>
              <div className="flex justify-between">
                <span>环比变化率:</span>
                <span className={trendTab === 'long' ? 'font-bold text-red-500' : 'font-bold text-green-500'}>
                  {trendTab === 'short' ? '-2.3%' : trendTab === 'medium' ? '-1.5%' : '+4.2%'}
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
                    <span className="font-medium">2025-07:</span>
                    <span className="ml-2">暑期安全风险高发月，警情量可能较往年增长15%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mr-2"></div>
                    <span className="font-medium">2025-06中旬:</span>
                    <span className="ml-2">毕业季酒驾类警情预计显著增长</span>
                  </div>
                </>
              )}
              <div className="mt-3 text-right">
                <a href="#" className="text-blue-500 text-sm">查看全部预警 →</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TimeDimensionAnalysis;