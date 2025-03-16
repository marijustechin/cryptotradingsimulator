import { useState } from 'react';
import HelperService from '../../services/HelperService';
import { ICryptoAsset } from '../../types/crypto';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

interface IAsset {
  asset: ICryptoAsset;
}
export const SingleAssetTest = ({ asset }: IAsset) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="py-1 border-b border-violet-800">
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="w-full flex gap-2 cursor-pointer items-center justify-between"
      >
        <p>{asset.name}</p>
        <p>{HelperService.formatCurrency(asset.priceUsd)}</p>
        <p
          className={`${
            asset.changePercent24Hr > 0 ? 'text-emerald-500' : 'text-rose-500'
          }`}
        >
          {Math.round(asset.changePercent24Hr * 1000) / 1000}%
        </p>
        {showOptions ? (
          <p className="text-violet-300">
            <IoIosArrowUp size={20} />
          </p>
        ) : (
          <p className="text-violet-300">
            <IoIosArrowDown size={20} />
          </p>
        )}
      </button>
      {showOptions && (
        <div className="mt-4 flex gap-2 items-center">
          <button className="btn-green">Buy</button>
          <input
            type="number"
            id={asset.id + 'ammount'}
            className="w-40 px-1 py-2 border border-violet-950 rounded-lg"
          />
          <button className="btn-red">Sell</button>
        </div>
      )}
    </div>
  );
};
