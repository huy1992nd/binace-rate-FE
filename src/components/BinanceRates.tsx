import React, { useEffect, useState, useRef, useMemo } from "react";
import { subscribeToRates } from "../services/socket";
import axiosInstance, { handleLogout } from '../services/auth';

interface Rate {
  symbol: string;
  price: number;
  prevPrice: number;
}

const BinanceRates: React.FC = () => {
  const [rates, setRates] = useState<Rate[]>([]);
  const [selectedPairs, setSelectedPairs] = useState<string[]>([]);
  const [user, setUser] = useState(null);
  const isMounted = useRef(true);

  // Handle selected pairs updates
  useEffect(() => {
    const updateSelectedPairs = () => {
      const storedPairs = localStorage.getItem("selectedPairs");
      if (storedPairs) {
        setSelectedPairs(JSON.parse(storedPairs));
      } else {
        setSelectedPairs([]);
      }
    };

    // Initial fetch of selected pairs
    updateSelectedPairs();

    // Listen for changes in localStorage
    window.addEventListener("storage", updateSelectedPairs);

    return () => {
      window.removeEventListener("storage", updateSelectedPairs);
    };
  }, []);

  // Handle user data and rate updates
  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const unsubscribe = subscribeToRates((data) => {
      if (!isMounted.current) return;
      
      setRates((prevRates) => {
        const existingRate = prevRates.find((r) => r.symbol === data.symbol);
        const newRate: Rate = {
          symbol: data.symbol,
          price: parseFloat(data.price),
          prevPrice: existingRate ? existingRate.price : parseFloat(data.price),
        };
        return [
          ...prevRates.filter((r) => r.symbol !== data.symbol),
          newRate,
        ];
      });
    });

    return () => {
      isMounted.current = false;
      unsubscribe();
    };
  }, []);

  // Memoize filtered and sorted rates
  const filteredAndSortedRates = useMemo(() => {
    return [...rates]
      .filter(rate => selectedPairs.length === 0 || selectedPairs.includes(rate.symbol.toLowerCase()))
      .sort((a, b) => b.price - a.price);
  }, [rates, selectedPairs]);

  return (
    <div className="container">
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedRates.map((rate) => (
            <tr key={rate.symbol}>
              <td>{rate.symbol}</td>
              <td style={{
                color: rate.price > rate.prevPrice ? '#00ff00' : 
                       rate.price < rate.prevPrice ? '#ff0000' : 
                       '#ffffff'
              }}>
                ${rate.price.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BinanceRates;
