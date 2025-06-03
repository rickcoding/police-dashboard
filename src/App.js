import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OverviewDashboard from './pages/OverviewDashboard';
import TimeDimensionAnalysis from './pages/TimeDimensionAnalysis';
import SpatialAnalysis from './pages/SpatialAnalysis';
import CategoryAnalysis from './pages/CategoryAnalysis';
import PersonnelAnalysis from './pages/PersonnelAnalysis';
import ReportAnalysis from './pages/ReportAnalysis'; // 确保导入 ReportAnalysis

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OverviewDashboard />} />
        <Route path="/time" element={<TimeDimensionAnalysis />} />
        <Route path="/spatial" element={<SpatialAnalysis />} />
        <Route path="/category" element={<CategoryAnalysis />} />
        <Route path="/people" element={<PersonnelAnalysis />} />
        <Route path="/report" element={<ReportAnalysis />} /> {/* 确保定义了 /report 路由 */}
      </Routes>
    </Router>
  );
}

export default App;