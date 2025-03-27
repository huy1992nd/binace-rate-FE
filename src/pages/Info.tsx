import React from "react";

const Info: React.FC = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-white to-gray-100 rounded-3xl shadow-2xl border border-gray-200 text-center">
        <h2 className="text-3xl font-extrabold flex justify-center items-center gap-2 mb-6 text-gray-800">
          <span role="img" aria-label="info">ℹ️</span>  Binance Rate info
        </h2>
        <p className="text-gray-700 leading-relaxed text-lg">
          Binance is one of the largest cryptocurrency exchanges in the world, offering a variety of financial services including:
        </p>
        <ul className="list-none mt-4 text-gray-600 text-lg space-y-3">
          <li className="flex justify-center items-center gap-2">🚀 <span>Spot and futures trading</span></li>
          <li className="flex justify-center items-center gap-2">💰 <span>Staking and yield farming</span></li>
          <li className="flex justify-center items-center gap-2">🔒 <span>Secure wallet services</span></li>
          <li className="flex justify-center items-center gap-2">📚 <span>Educational resources for traders</span></li>
        </ul>
        <a
          href="https://www.binance.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-full shadow-md hover:bg-blue-700 hover:scale-105 transition duration-300 ease-in-out font-semibold"
        >
          Learn More →
        </a>
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all duration-300">
          <p className="font-bold text-xl mb-4">Created by <span className="text-yellow-300">Nguyễn Quang Huy</span></p>
          <p className="mb-2">
            LinkedIn: <a href="https://www.linkedin.com/in/quang-huy-ba989676/" className="text-yellow-300 hover:text-yellow-200 hover:underline">quang-huy-ba989676</a>
          </p>
          <p>Email: <a href="mailto:huy1992nd@gmail.com" className="text-yellow-300 hover:text-yellow-200 hover:underline">huy1992nd@gmail.com</a></p>
        </div>
      </div>
    </div>
  );
};

export default Info;
