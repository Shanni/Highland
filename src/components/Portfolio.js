import { useState, useEffect } from 'react';

const Portfolio = () => {
  const [assets, setAssets] = useState([]);

  return (
    <div className="portfolio">
      <h2>Your Mountain Peak Assets</h2>
      <div className="portfolio-grid">
        {/* Asset cards will go here */}
      </div>
    </div>
  );
};

export default Portfolio; 