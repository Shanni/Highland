import { useState } from 'react';
import { 
  Users,  // For Agentic Roundtable
  Zap,    // For Onchain Actions
  Layers, 
  Activity,
  Clock, 
  Bell,
  ChevronLeft,
  ChevronRight 
} from 'react-feather';
import '../styles/Navigation.css';

const Navigation = ({ activeSection, onSectionChange }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const sections = [
    {
      id: 'overview',
      name: 'Portfolio Overview',
      icon: <Layers size={20} />,
    },
    {
      id: 'performance',
      name: 'Performance Metrics',
      icon: <Activity size={20} />,
    },
    {
      id: 'roundtable',
      name: 'Agentic Roundtable',
      icon: <Users size={20} />,
    },
    {
      id: 'actions',
      name: 'Onchain Actions',
      icon: <Zap size={20} />,
    },
    {
      id: 'history',
      name: 'Transaction History',
      icon: <Clock size={20} />,
    },
    {
      id: 'alerts',
      name: 'Price Alerts',
      icon: <Bell size={20} />,
    }
  ];

  return (
    <nav className={`navigation ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div 
        className="nav-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </div>

      <div className="nav-sections">
        {sections.map((section) => (
          <div
            key={section.id}
            className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => onSectionChange(section.id)}
          >
            <div className="nav-icon">{section.icon}</div>
            {isExpanded && <span className="nav-label">{section.name}</span>}
          </div>
        ))}
      </div>
    </nav>
  );
};

export default Navigation; 