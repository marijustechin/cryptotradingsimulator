export interface ICryptoAsset {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  supply: string;
  marketCapUsd: number;
  volumeUsd24Hr: number;
  priceUsd: number;
  changePercent24Hr: number;
  vwap24Hr: number;
}

export interface IAssetHistory {
  priceUsd: string;
  date: string;
}

export interface TAssetHistory {
  priceUsd: string;
  time: string;
  circulatingSupply: string;
  date: string;
}

export interface IInstrument {
  id: string;
  name: string;
  code: string;
  icon: string;
}
