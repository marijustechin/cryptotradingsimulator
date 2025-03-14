import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export const UserDashboardPage = () => {
  const [coins, setCoins] = useState([]);
  const [sortKey, setSortKey] = useState("marketCapUsd");
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const chartRef = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("https://api.coincap.io/v2/assets");
      const data = await response.json();
      setCoins(data.data.slice(0, 20)); // Limit to top 20 coins
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Auto-refresh every 10s
    return () => clearInterval(interval);
  }, [fetchData]);

  const fetchChartData = useCallback(async (coinId) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.coincap.io/v2/assets/${coinId}/history?interval=h1`);
      const data = await response.json();
      setChartData(data.data.map(point => ({
        time: new Date(point.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        price: parseFloat(point.priceUsd)
      })));
    } catch (error) {
      console.error("Error fetching chart data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSort = (key) => {
    setSortAsc(sortKey === key ? !sortAsc : false);
    setSortKey(key);
  };

  const handleRowClick = (coin) => {
    setSelectedCoin(coin);
    fetchChartData(coin.id);
    setTimeout(() => {
      chartRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  const sortedCoins = useMemo(() => {
    return [...coins].sort((a, b) => {
      const valA = parseFloat(a[sortKey]) || 0;
      const valB = parseFloat(b[sortKey]) || 0;
      return sortAsc ? valA - valB : valB - valA;
    });
  }, [coins, sortKey, sortAsc]);

  return (
    <div className="max-w-5xl mx-auto p-2 sm:p-4 w-full">
      <h1 className="text-lg sm:text-2xl font-bold text-center mb-2 sm:mb-4 text-white">Crypto Market</h1>
      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-700 w-full">
        <table className="w-full text-white min-w-[250px]">
          <thead>
            <tr className="bg-gray-800 text-left text-[10px] sm:text-sm md:text-base">
              <th className="p-1 sm:p-2 cursor-pointer" onClick={() => handleSort("name")}>Name</th>
              <th className="p-1 sm:p-2 cursor-pointer" onClick={() => handleSort("priceUsd")}>Price (USD)</th>
              <th className="p-1 sm:p-2 cursor-pointer" onClick={() => handleSort("marketCapUsd")}>Market Cap</th>
              <th className="p-1 sm:p-2 cursor-pointer" onClick={() => handleSort("changePercent24Hr")}>24h Change (%)</th>
            </tr>
          </thead>
          <tbody>
            {sortedCoins.map((coin) => (
              <tr key={coin.id} className="border-b border-gray-700 hover:bg-gray-900 cursor-pointer text-[10px] sm:text-sm" onClick={() => handleRowClick(coin)}>
                <td className="p-1 sm:p-2">{coin.name} ({coin.symbol})</td>
                <td className="p-1 sm:p-2">${parseFloat(coin.priceUsd).toFixed(2)}</td>
                <td className="p-1 sm:p-2">${(parseFloat(coin.marketCapUsd) / 1e9).toFixed(2)}B</td>
                <td className={`p-1 sm:p-2 ${coin.changePercent24Hr > 0 ? "text-green-500" : "text-red-500"}`}>
  {parseFloat(coin.changePercent24Hr).toFixed(2)}%
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedCoin && (
        <div ref={chartRef} className="mt-3 sm:mt-6 p-2 sm:p-4 border rounded bg-gray-800 shadow-lg w-full max-w-full overflow-hidden">
          <h2 className="text-sm sm:text-lg font-bold text-center text-white">{selectedCoin.name} Price Chart</h2>
          {loading ? (
            <p className="text-center text-white">Loading chart...</p>
          ) : (
            <div className="w-full overflow-x-auto">
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={chartData}>
                  <XAxis dataKey="time" tick={{ fill: "#fff", fontSize: 7 }} />
                  <YAxis tick={{ fill: "#fff", fontSize: 7 }} domain={['auto', 'auto']} />
                  <Tooltip contentStyle={{ backgroundColor: "#333", borderColor: "#555" }} />
                  <Line type="monotone" dataKey="price" stroke="#319c06" strokeWidth={1.5} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
