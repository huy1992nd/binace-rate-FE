import React, { useEffect, useState } from "react";
import { subscribeToRates } from "../services/socket";

interface Rate {
  symbol: string;
  price: number;
  prevPrice: number;
}

const BinanceRates: React.FC = () => {
  const [rates, setRates] = useState<Rate[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToRates((data) => {
      setRates((prevRates) => {
        const existingRate = prevRates.find((r) => r.symbol === data.symbol);
        const newRate: Rate = {
          symbol: data.symbol,
          price: parseFloat(data.price),
          prevPrice: existingRate ? existingRate.price : parseFloat(data.price), // Fix: Initialize with current price
        };
        const r = existingRate? existingRate.price : 0;
        if(newRate.price > r) {
          console.log('newRate', newRate);
        }

        return [
          ...prevRates.filter((r) => r.symbol !== data.symbol),
          newRate,
        ];
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const topCoins = rates
    .sort((a, b) => a.symbol.localeCompare(b.symbol)) // Sort alphabetically
    .slice(0, 10)
    .map((rate) => ({
      ...rate,
      isUp: rate.price >= rate.prevPrice, // Fix: Proper comparison
    }));
    
    console.log('topcoin', topCoins);

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
