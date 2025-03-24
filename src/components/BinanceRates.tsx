import React, { useEffect, useState } from "react";
import { subscribeToRates } from "../services/socket";

interface Rate {
  symbol: string;
  price: number;
  prevPrice: number;
}

const BinanceRates: React.FC = () => {
  const [rates, setRates] = useState<Rate[]>([]);
  const [selectedPairs, setSelectedPairs] = useState<string[]>([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Function to update selected pairs from localStorage
    const updateSelectedPairs = () => {
      const storedPairs = localStorage.getItem("selectedPairs");
      console.log('in updateSelectedPairs', storedPairs);
      if (storedPairs) {
        setSelectedPairs(JSON.parse(storedPairs));
      } else {
        setSelectedPairs([]); // Reset if no pairs selected
      }
    };

    // Initial fetch of selected pairs
    updateSelectedPairs();

    // Listen for changes in localStorage (real-time updates)
    window.addEventListener("storage", updateSelectedPairs);
    const unsubscribe = subscribeToRates((data) => {
      setRates((prevRates) => {
        const existingRate = prevRates.find((r) => r.symbol === data.symbol);
        const newRate: Rate = {
          symbol: data.symbol,
          price: parseFloat(data.price),
          prevPrice: existingRate ? existingRate.price : parseFloat(data.price), // Fix: Initialize with current price
        };
        return [
          ...prevRates.filter((r) => r.symbol !== data.symbol),
          newRate,
        ];
      });
    });

    return () => {
      unsubscribe();
      window.removeEventListener("storage", updateSelectedPairs);
    };
  }, []);
  const filteredRates =
  user && selectedPairs.length > 0
    ? rates.filter((rate) => selectedPairs.includes(rate.symbol.toLowerCase()))
    : rates;
  const topCoins = filteredRates
    .sort((a, b) => a.symbol.localeCompare(b.symbol)) // Sort alphabetically
    .map((rate) => ({
      ...rate,
      isUp: rate.price >= rate.prevPrice, // Fix: Proper comparison
    }));
    

  return (
    <div className="container">
      <h2>Live Binance Prices</h2>
      <table>
        <thead>
          <tr>
            <th>Coin</th>
            <th>Price (USDT)</th>
          </tr>
        </thead>
        <tbody>
          {topCoins.map((rate) => (
            <tr key={rate.symbol}>
              <td>{rate.symbol.toUpperCase()}</td>
              <td className={rate.isUp ? "price-up" : "price-down"}>
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
