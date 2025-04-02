import React, { useState, useEffect, useRef } from "react";
import "../styles.css";
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { subscribeToRates } from "../services/socket";

interface Rate {
  symbol: string;
  price: string;
}

const BinanceRates: React.FC = () => {
  const [rates, setRates] = useState<Rate[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Rate;
    direction: "asc" | "desc";
  }>({ key: "price", direction: "asc" });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  const selectedPairs = useSelector((state: RootState) => state.selectedPairs.pairs);

  useEffect(() => {
    const unsubscribe = subscribeToRates((data) => {
      if (!isMounted.current) return;
      setRates(prevRates => {
        const existingRate = prevRates.find(rate => rate.symbol === data.symbol);
        if (!existingRate) {
          return [...prevRates, {
            symbol: data.symbol,
            price: parseFloat(data.price).toFixed(8),
          }];
        }

        return prevRates.map(rate => {
          if (rate.symbol === data.symbol) {
            return {
              ...rate,
              price: parseFloat(data.price).toFixed(8),
            };
          }
          return rate;
        });
      });
      setIsLoading(false);
    });

    return () => {
      isMounted.current = false;
      unsubscribe();
    };
  }, []); // Only subscribe once to get all pairs

  const handleSort = (key: keyof Rate) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedRates = [...rates].sort((a, b) => {
    const aValue = parseFloat(a[sortConfig.key]);
    const bValue = parseFloat(b[sortConfig.key]);

    return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
  });

  // Filter rates based on selected pairs
  const filteredRates = selectedPairs.length > 0 
    ? sortedRates.filter((rate) => selectedPairs.includes(rate.symbol))
    : sortedRates;

  const getSortIcon = (key: keyof Rate) => {
    if (sortConfig.key !== key) return "↕️";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  if (isLoading) {
    return <div className="loading">Waiting for rates...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="binance-rates">
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort("symbol")}>
                Pair {getSortIcon("symbol")}
              </th>
              <th onClick={() => handleSort("price")}>
                Price {getSortIcon("price")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRates.map((rate) => (
              <tr key={rate.symbol}>
                <td>{rate.symbol}</td>
                <td>{rate.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BinanceRates;
