import React from 'react';
import './Stats.css';

const Stats = ({ originalCount, filteredCount }) => {
  const filteredOut = originalCount - filteredCount;
  
  return (
    <div className="stats-section">
      <h3>Filtering Statistics</h3>
      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-number">{originalCount}</div>
          <div className="stat-label">Original Entries</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">{filteredCount}</div>
          <div className="stat-label">Unique Series</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">{filteredOut}</div>
          <div className="stat-label">Filtered Out</div>
        </div>
      </div>
    </div>
  );
};

export default Stats;