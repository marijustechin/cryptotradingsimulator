import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import OrdersService from '../../../services/OrdersService';
// importuojam tipa kuris aprašo, kaip atrodo vartotojo portfolio objektas
import { RootState } from '../../store';
import HelperService from '../../../services/HelperService';
import { IOpenOrder, IOrdersHistory, IUserAssets } from '../../../types/order';

// aprasom kaip atrodo state, susijusi su portfolio
interface OrdersState {
  openOrders: IOpenOrder[] | null;
  ordersHistory: IOrdersHistory[] | null;
  userAssets: IUserAssets[] | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed'; // krovimo pranesimai
  error: string | null; // jei klaida - jos pranesimas
}

// pradine state reiksme

const initialState: OrdersState = {
  openOrders: null,
  ordersHistory: null,
  userAssets: null,
  status: 'idle',
  error: '',
};

// createAsyncThunk sukuria asinchroninį Redux veiksmą, kuris:
// generuoja 3 busenas: pending, fulfilled, rejected
// leidžia kviesti async API funkciją
// leidžia naudoti komponentuose per dispatch


// get openOrders
export const getOpenOrders = createAsyncThunk<IOpenOrder[], { userId: string }>(
  'orders/getOpenOrders',
  async ({ userId }, { rejectWithValue }) => {
    try {
      const response = await OrdersService.getOpenOrders(userId);
      return response;
    } catch (e) {
      return rejectWithValue(HelperService.errorToString(e));
    }
  }
);

export const getUserAssets = createAsyncThunk<
  IUserAssets[],
  { userId: string }
>('orders/getUserAssets', async ({ userId }, { rejectWithValue }) => {
  try {
    const response = await OrdersService.getUserAssets(userId);
    return response;
  } catch (e) {
    return rejectWithValue(HelperService.errorToString(e));
  }
});

export const getOrdersHistory = createAsyncThunk<
  IOrdersHistory[],
  { userId: string }
>('orders/getOrdersHistory', async ({ userId }, { rejectWithValue }) => {
  try {
    const response = await OrdersService.getOrdersHistory(userId);
    return response;
  } catch (e) {
    return rejectWithValue(HelperService.errorToString(e));
  }
});


export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {}, // jei reikia kokiu veiksmu su state
  // tvarkome asinchroninius veiksmus
  extraReducers: (builder) => {
    builder
      // open orders ///////////////////////////////////
      .addCase(getOpenOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getOpenOrders.fulfilled, (state, action) => {
        state.openOrders = [...action.payload];
        state.status = 'idle';
      })
      .addCase(getOpenOrders.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // user assets ////////////////////////////////
      .addCase(getUserAssets.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getUserAssets.fulfilled, (state, action) => {
        state.userAssets = [...action.payload];
        state.status = 'idle';
      })
      .addCase(getUserAssets.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // orders history //////////////////////
      .addCase(getOrdersHistory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getOrdersHistory.fulfilled, (state, action) => {
        state.ordersHistory = [...action.payload];
        state.status = 'idle';
      })
      .addCase(getOrdersHistory.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const selectOpenOrders = (state: RootState) => state.orders.openOrders;
export const selectOrdersHistory = (state: RootState) => state.orders.ordersHistory;
export const selectUserAssets = (state: RootState) => state.orders.userAssets;

export default ordersSlice.reducer;
