import { createSlice } from '@reduxjs/toolkit';

interface CryptoPrice {
  id: string;
  name: string;
  price: number;
  marketCap: number;
}

interface CryptoState {
  prices: Record<string, CryptoPrice>; // Storing prices in a key-value format (id -> CryptoPrice)
  loading: boolean;
  error: string | null;
}

const initialState: CryptoState = {
  prices: {},
  loading: false,
  error: null,
};

const cryptoPricesSlice = createSlice({
  name: 'cryptoPrices',
  initialState,
  reducers: {},
});

export default cryptoPricesSlice.reducer;
