import { useState } from "react";
import HelperService from "../../services/HelperService";
import { ICryptoAsset } from "../../types/crypto";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

interface IAsset {
  asset: ICryptoAsset;
}

export const CryptoAsset = ({ asset }: IAsset) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <>
      {/* Clickable Row */}
      <tr
        onClick={() => setShowOptions(!showOptions)}
        className="border-b border-violet-800 cursor-pointer hover:bg-violet-950 transition"
      >
        <td className="py-2">{asset.name} ({asset.symbol})</td>
        <td>{HelperService.formatCurrency(asset.priceUsd)}</td>
        <td>${(asset.marketCapUsd / 1e9).toFixed(2)}B</td>
        <td
          className={`${
            asset.changePercent24Hr > 0 ? "text-emerald-500" : "text-rose-500"
          }`}
        >
          {(Math.round(asset.changePercent24Hr * 1000) / 1000).toFixed(2)}%
        </td>
        <td className="text-violet-300">
          {showOptions ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
        </td>
      </tr>

      {/* Expanded Row for Buy/Sell Options */}
      {showOptions && (
        <tr>
          <td colSpan={5} className="py-2">
            <div className="flex gap-2 items-center">
              <button className="btn-green">Buy</button>
              <input
                type="number"
                id={asset.id + "amount"}
                className="w-40 px-1 py-2 border border-violet-950 rounded-lg"
              />
              <button className="btn-red">Sell</button>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};
