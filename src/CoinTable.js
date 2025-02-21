import React, { useState, useEffect } from "react";
import { subscribeToRates } from "./WebSocketService";

const CoinTable = () => {
  const [coins, setCoins] = useState({});

  useEffect(() => {
    const unsubscribe = subscribeToRates((data) => {
      setCoins((prevCoins) => ({
        ...prevCoins,
        [data.symbol]: {
          price: data.price,
          prevPrice: prevCoins[data.symbol]?.price || 0,
        },
      }));
    });

    return () => {
      unsubscribe(); // Unsubscribe when component unmounts
    };
  }, []);

  const topCoins = Object.entries(coins)
    .slice(0, 10)
    .map(([symbol, { price, prevPrice }]) => ({
      symbol,
      price,
      isUp: parseFloat(price) >= parseFloat(prevPrice),
    }));

  return (
    <div className="container">
      <h2>Live Binance Prices</h2>
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Price (USDT)</th>
          </tr>
        </thead>
        <tbody>
          {topCoins.length > 0 ? (
            topCoins.map((coin) => (
              <tr key={coin.symbol}>
                <td>{coin.symbol.toUpperCase()}</td>
                <td className={coin.isUp ? "price-up" : "price-down"}>
                  ${parseFloat(coin.price).toFixed(2)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">Waiting for data...</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CoinTable;
