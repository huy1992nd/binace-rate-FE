import React, { useState, useEffect, useRef } from "react";
import "../App.css";
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { subscribeToRates } from "../services/socket";

interface Rate {
  symbol: string;
  price: string;
  priceChange: 'up' | 'down' | null;
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
  const previousPrices = useRef<{ [key: string]: number }>({});

  const selectedPairs = useSelector((state: RootState) => state.selectedPairs.pairs);

  useEffect(() => {
    const unsubscribe = subscribeToRates((data) => {
      if (!isMounted.current) return;
      setRates(prevRates => {
        const newPrice = parseFloat(data.price);
        const oldPrice = previousPrices.current[data.symbol];
        const priceChange = oldPrice ? (newPrice > oldPrice ? 'up' : newPrice < oldPrice ? 'down' : null) : null;
        
        previousPrices.current[data.symbol] = newPrice;

        const existingRate = prevRates.find(rate => rate.symbol === data.symbol);
        if (!existingRate) {
          return [...prevRates, {
            symbol: data.symbol,
            price: newPrice.toFixed(2),
            priceChange
          }];
        }

        return prevRates.map(rate => {
          if (rate.symbol === data.symbol) {
            return {
              ...rate,
              price: newPrice.toFixed(2),
              priceChange
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
    if (sortConfig.key === 'price') {
      const aValue = parseFloat(a.price);
      const bValue = parseFloat(b.price);
      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
    }
    return a.symbol.localeCompare(b.symbol);
  });

  // Filter rates based on selected pairs
  const filteredRates = selectedPairs.length > 0 
    ? sortedRates.filter((rate) => selectedPairs.includes(rate.symbol.toLowerCase()))
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
                <td className={rate.priceChange === 'up' ? 'price-up' : rate.priceChange === 'down' ? 'price-down' : ''}>
                  {rate.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BinanceRates;
