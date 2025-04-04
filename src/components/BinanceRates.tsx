import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import "../App.css";
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { subscribeToRates } from "../services/socket";
import axiosInstance from "../services/auth";

interface Rate {
  symbol: string;
  price: string;
  priceChange: 'up' | 'down' | null;
}

interface SortConfig {
  key: keyof Rate;
  direction: "asc" | "desc";
}

const BinanceRates: React.FC = () => {
  // State management
  const [rates, setRates] = useState<Rate[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ 
    key: "price", 
    direction: "desc" 
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const previousPrices = useRef<{ [key: string]: number }>({});

  // Redux state
  const selectedPairs = useSelector((state: RootState) => state.selectedPairs.pairs);

  // API call to fetch initial rates
  const fetchInitialRates = useCallback(async () => {
    if (selectedPairs.length === 0) {
      setIsLoading(false);
      return;
    }

    try {
      const symbols = selectedPairs.join(',');
      const response = await axiosInstance.get(`/crypto/list-rate?symbols=${symbols}`);
      const initialRates = response.data.result.map((rate: any) => {
        const price = parseFloat(rate.price);
        previousPrices.current[rate.symbol] = price;
        return {
          symbol: rate.symbol,
          price: price.toFixed(2),
          priceChange: null
        };
      });
      setRates(initialRates);
    } catch (error) {
      console.error("Failed to fetch initial rates:", error);
      setError("Failed to load initial rates");
    } finally {
      setIsLoading(false);
    }
  }, [selectedPairs]);

  // Socket subscription handler
  const handleRateUpdate = useCallback((data: any) => {
    setRates(prevRates => {
      const newPrice = parseFloat(data.price);
      const oldPrice = previousPrices.current[data.symbol];
      const priceChange = oldPrice 
        ? (newPrice > oldPrice ? 'up' : newPrice < oldPrice ? 'down' : null)
        : null;
      
      previousPrices.current[data.symbol] = newPrice;

      const existingRate = prevRates.find(rate => rate.symbol.toLowerCase() === data.symbol.toLowerCase());
      if (!existingRate) {
        return [...prevRates, {
          symbol: data.symbol,
          price: newPrice.toFixed(2),
          priceChange
        }];
      }

      return prevRates.map(rate => {
        if (rate.symbol.toLowerCase() === data.symbol.toLowerCase()) {
          return {
            ...rate,
            price: newPrice.toFixed(2),
            priceChange
          };
        }
        return rate;
      });
    });
  }, []);

  // Effect for initial data fetch and socket subscription
  useEffect(() => {
    fetchInitialRates();

    const unsubscribe = subscribeToRates(handleRateUpdate);

    return () => {
      unsubscribe();
    };
  }, [fetchInitialRates, handleRateUpdate]);

  // Sorting handler
  const handleSort = useCallback((key: keyof Rate) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  // Memoized sorted and filtered rates
  const sortedRates = useMemo(() => {
    return [...rates].sort((a, b) => {
      if (sortConfig.key === 'symbol') {
        return sortConfig.direction === "asc" 
          ? a.symbol.localeCompare(b.symbol)
          : b.symbol.localeCompare(a.symbol);
      }
      const aValue = parseFloat(a.price);
      const bValue = parseFloat(b.price);
      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
    });
  }, [rates, sortConfig]);

  const filteredRates = useMemo(() => {
    return selectedPairs.length > 0 
      ? sortedRates.filter(rate => selectedPairs.includes(rate.symbol))
      : sortedRates;
  }, [sortedRates, selectedPairs]);

  // Sort icon helper
  const getSortIcon = useCallback((key: keyof Rate) => {
    if (sortConfig.key !== key) return "↕️";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  }, [sortConfig]);

  // Loading and error states
  if (isLoading) {
    return <div className="loading">Loading rates...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  // Main render
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
                <td>{rate.symbol.toUpperCase()}</td>
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
