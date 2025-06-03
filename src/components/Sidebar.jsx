import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  
  return (
    <div className="w-56 bg-blue-900 text-white">
      <div className="p-4 border-b border-blue-800 text-center">
        <h1 className="text-lg font-bold">警情动态监测应用体系</h1>
        <p className="text-xs text-blue-300">公安大数据应用赋能</p>
      </div>
      <div className="py-2">
        <div 
          className={`px-4 py-3 flex items-center cursor-pointer ${path === '/' ? 'bg-blue-800 border-l-4 border-blue-500' : 'hover:bg-blue-800'}`}
          onClick={() => navigate('/')}
        >
          <span className="mr-2">📊</span> 综合态势总览
        </div>
        <div 
          className={`px-4 py-3 flex items-center cursor-pointer ${path === '/time' ? 'bg-blue-800 border-l-4 border-blue-500' : 'hover:bg-blue-800'}`}
          onClick={() => navigate('/time')}
        >
          <span className="mr-2">🕒</span> 时间维度分析
        </div>
        <div 
          className={`px-4 py-3 flex items-center cursor-pointer ${path === '/spatial' ? 'bg-blue-800 border-l-4 border-blue-500' : 'hover:bg-blue-800'}`}
          onClick={() => navigate('/spatial')}
        >
          <span className="mr-2">🗺️</span> 空间维度分析
        </div>
        <div 
          className={`px-4 py-3 flex items-center cursor-pointer ${path === '/category' ? 'bg-blue-800 border-l-4 border-blue-500' : 'hover:bg-blue-800'}`}
          onClick={() => navigate('/category')}
        >
          <span className="mr-2">📁</span> 类别维度分析
        </div>
        <div 
          className={`px-4 py-3 flex items-center cursor-pointer ${path === '/people' ? 'bg-blue-800 border-l-4 border-blue-500' : 'hover:bg-blue-800'}`}
          onClick={() => navigate('/people')}
         > 
          <span className="mr-2">👥</span> 人员维度分析
        </div>
        
        <div 
          className={`px-4 py-3 flex items-center cursor-pointer ${path === '/report' ? 'bg-blue-800 border-l-4 border-blue-500' : 'hover:bg-blue-800'}`}
          onClick={() => navigate('/report')}
         >
          <span className="mr-2">📋</span> 统计报表分析
        </div>
      </div>
    </div>
  );
};

export default Sidebar;