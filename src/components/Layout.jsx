import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children, title }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <Header title={title} />
        <div className="px-4">
          {children}
        </div>
        <div className="px-4 py-3 text-center text-sm text-gray-500">
          © 2025 分县局警情分析数据看板 - 版本 2.5.0
        </div>
      </div>
    </div>
  );
};

export default Layout;