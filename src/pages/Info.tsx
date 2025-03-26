import React from "react";

const Info: React.FC = () => {
  return (
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
      <div className="mt-8 p-6 bg-gray-50 border-t border-gray-200 rounded-xl shadow-sm text-sm text-gray-600">
        <p className="font-medium">Created by <span className="text-gray-800">Nguyễn Quang Huy</span></p>
        <p>
          LinkedIn: <a href="https://www.linkedin.com/in/quang-huy-ba989676/" className="text-blue-600 hover:underline">quang-huy-ba989676</a>
        </p>
        <p>Email: <a href="mailto:huy1992nd@gmail.com" className="text-blue-600 hover:underline">huy1992nd@gmail.com</a></p>
      </div>
    </div>
  );
};

export default Info;
