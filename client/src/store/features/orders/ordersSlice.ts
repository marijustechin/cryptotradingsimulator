import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import OrdersService from '../../../services/OrdersService';
// importuojam tipa kuris aprašo, kaip atrodo vartotojo portfolio objektas
import { IPortfolioInfo, IUserPortfolioItem } from '../../../types/portfolio';
import { RootState } from '../../store';
import HelperService from '../../../services/HelperService';
import { IOpenOrder } from '../../../types/order';

// aprasom kaip atrodo state, susijusi su portfolio
interface OrdersState {
  openOrders: IOpenOrder[] | null;
  orders: {
    transactions: IPortfolioInfo[];
    portfolio: IUserPortfolioItem[];
  } | null; // portfolio duomenys
  status: 'idle' | 'loading' | 'succeeded' | 'failed'; // krovimo pranesimai
  error: string | null; // jei klaida - jos pranesimas
}

// pradine state reiksme

const initialState: OrdersState = {
  openOrders: null,
  orders: {
    transactions: [],
    portfolio: [],
  },
  status: 'idle',
  error: '',
};

// createAsyncThunk sukuria asinchroninį Redux veiksmą, kuris:
// generuoja 3 busenas: pending, fulfilled, rejected
// leidžia kviesti async API funkciją
// leidžia naudoti komponentuose per dispatch
export const getUserOrders = createAsyncThunk<
  {
    transactions: IPortfolioInfo[];
    portfolio: IUserPortfolioItem[];
  },
  void,
  { state: RootState }
>('orders/transactions', async (_, { rejectWithValue }) => {
  try {
    const response = await OrdersService.getUserOrders();
    return response;
  } catch (error) {
    return rejectWithValue(HelperService.errorToString(error));
  }
});

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

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {}, // jei reikia kokiu veiksmu su state
  // tvarkome asinchroninius veiksmus
  extraReducers: (builder) => {
    builder
      .addCase(getUserOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.orders = {
          transactions: action.payload.transactions,
          portfolio: action.payload.portfolio,
        }; // saugom gauta portfolio
        state.status = 'succeeded';
        state.error = '';
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(getOpenOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getOpenOrders.fulfilled, (state, action) => {
        state.openOrders = [...action.payload];
        state.status = 'idle';
      })
      .addCase(getOpenOrders.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const selectOpenOrders = (state: RootState) => state.orders.openOrders;

export default ordersSlice.reducer;
