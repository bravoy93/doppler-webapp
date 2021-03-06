import React from 'react';

const HeaderSection = ({ children }) => {
  return (
    <header className="hero-banner report-filters">
      <div className="dp-container">
        <div className="dp-rowflex">{children}</div>
        <span className="arrow"></span>
      </div>
    </header>
  );
};

export default HeaderSection;
