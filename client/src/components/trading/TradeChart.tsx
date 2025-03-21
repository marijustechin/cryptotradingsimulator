import { useCallback, useEffect, useState } from "react";
import {
  getAssetId,
  getHistoryInterval,
} from "../../store/features/trading/tradeOptionsSlice";
import { useAppSelector } from "../../store/store";
import AssetService from "../../services/AssetService";
import { TAssetHistory } from "../../types/crypto";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { IntervalButtons } from "./IntervalButtons";

export const TradeChart = () => {
  const historyInterval = useAppSelector(getHistoryInterval);
  const assetId = useAppSelector(getAssetId);
  const [historyData, setHistoryData] = useState<TAssetHistory[]>([]);

  const getHistory = useCallback(async () => {
    if (assetId.length > 1) {
      try {
        const response = await AssetService.getAssetHistory(
          assetId,
          historyInterval
        );
        setHistoryData(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  }, [historyInterval, assetId]);

  useEffect(() => {
    getHistory();
    const interval = setInterval(getHistory, 30000);
    return () => clearInterval(interval);
  }, [getHistory]);

  return (
    <div className="flex flex-col gap-4">
      <IntervalButtons />
      <div className="p-4 bg-gray-800 rounded-lg shadow-lg">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart
            data={historyData}
            margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
          >
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="date" tick={{ fill: "#fff", fontSize: 10 }} />
            <YAxis
              tick={{ fill: "#fff", fontSize: 10 }}
              domain={["auto", "auto"]}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#222", borderColor: "#555" }}
            />
            <Line
              type="monotone"
              dataKey="priceUsd"
              stroke="#4CAF50"
              strokeWidth={2}
              dot={false}
              fill="url(#priceGradient)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
