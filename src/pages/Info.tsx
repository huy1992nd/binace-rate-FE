import React from "react";

const Info: React.FC = () => {
  return (
    <div className="container">
      <div className="user-profile">
        <div className="profile-header">
          <img 
            src="https://cryptologos.cc/logos/binance-coin-bnb-logo.png" 
            alt="Binance Logo" 
            className="profile-avatar"
            style={{ width: '150px', height: '150px', objectFit: 'contain' }}
          />
          <h2>Welcome to Binance Rate Tracker</h2>
        </div>
        
        <div className="profile-info">
          <div className="info-section">
            <h3>📊 About Binance</h3>
            <p className="description-block">Binance is one of the largest cryptocurrency exchanges in the world, offering a variety of financial services including:</p>
            <ul className="pairs-list">
              <li>🚀 Spot and futures trading</li>
              <li>💰 Staking and yield farming</li>
              <li>🔒 Secure wallet services</li>
              <li>📚 Educational resources for traders</li>
            </ul>
          </div>

          <div className="info-section">
            <h3>🎯 Features</h3>
            <p className="description-block">Our application provides the following features:</p>
            <ul className="pairs-list">
              <li>Real-time price tracking</li>
              <li>Customizable trading pairs</li>
              <li>Price change indicators</li>
              <li>User-friendly interface</li>
              <li>Secure authentication</li>
            </ul>
          </div>

          <div className="info-section">
            <h3>👨‍💻 Developer Information</h3>
            <p className="description-block">Contact information for the developer:</p>
            <ul className="pairs-list" style={{ wordBreak: 'break-word' }}>
              <li style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                Created by: <span style={{ color: '#f0b90b' }}>Nguyễn Quang Huy</span>
              </li>
              <li style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                LinkedIn: <a 
                  href="https://www.linkedin.com/in/quang-huy-ba989676/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#f0b90b', textDecoration: 'none', wordBreak: 'break-all' }}
                >
                  quang-huy-ba989676
                </a>
              </li>
              <li style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                Email: <a 
                  href="mailto:huy1992nd@gmail.com"
                  style={{ color: '#f0b90b', textDecoration: 'none', wordBreak: 'break-all' }}
                >
                  huy1992nd@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <a
          href="https://www.binance.com"
          target="_blank"
          rel="noopener noreferrer"
          className="logout-btn"
          style={{ 
            background: '#f0b90b',
            color: 'black',
            textDecoration: 'none',
            textAlign: 'center',
            display: 'block'
          }}
        >
          🌐 Visit Binance Website
        </a>
      </div>
    </div>
  );
};

export default Info;
