import React from 'react';

const Header = ({ title }) => {
  return (
    <div className="flex justify-between items-center p-4 bg-white shadow mb-4">
      <div className="text-xl font-bold">{title}</div>
      <div className="flex items-center">
        <div className="bg-gray-100 px-3 py-2 rounded flex items-center mr-4 cursor-pointer">
          <span className="mr-2">📅</span> 2025-05-06
        </div>
        <div className="flex items-center cursor-pointer">
          <div className="w-8 h-8 bg-blue-700 text-white rounded-full flex items-center justify-center mr-2">张</div>
          <span>张警官</span>
        </div>
      </div>
    </div>
  );
};

export default Header;