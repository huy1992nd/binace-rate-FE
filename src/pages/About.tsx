/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import axiosInstance, { handleLogout } from "../services/auth";
import styles from './style.module.css';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface UserInfo {
  name: string;
  picture: string;
  email: string;
  selectedPairs: string[];
  createdAt: string;
  lastLogin: string | null;
  totalPairs: number;
  role: string;
  description?: string;
}

const Info: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lấy danh sách cặp tiền tệ từ Redux store
  const selectedPairs = useSelector((state: RootState) => state.selectedPairs.pairs);

  useEffect(() => {

  }, [selectedPairs]); // Thêm selectedPairs vào dependencies để cập nhật khi có thay đổi

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.userProfile}>
        <div className={styles.profileHeader}>
            <>
              <img 
                src="binance-svgrepo-com.svg" 
                alt="Binance Logo" 
                className={styles.profileAvatar}
                style={{ width: '150px', height: '150px', objectFit: 'contain' }}
              />
              <h2>Welcome to Binance Rate Tracker</h2>
            </>
        </div>
        <div className={styles.profileInfo}>

          <div className={styles.infoSection}>
            <h3>🎯 Features</h3>
            <p className={styles.descriptionBlock}>Our application provides the following features</p>
            <ul className={styles.pairsList}>
              <li>Real-time price tracking</li>
              <li>Customizable trading pairs</li>
              <li>Price change indicators</li>
              <li>User-friendly interface</li>
              <li>Secure authentication</li>
            </ul>
          </div>

          <div className={styles.infoSection}>
            <h3>👨‍💻 Developer Information</h3>
            <p className={styles.descriptionBlock}>Contact information for the developer</p>
            <ul className={styles.pairsList} style={{ wordBreak: 'break-word' }}>
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
          <button className={styles.visitBtn} onClick={handleLogout}>
            <a href="https://www.binance.com" style={{ textDecoration: 'none', color: 'black' }}>
              🌐 Visit Binance Website
            </a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Info;
