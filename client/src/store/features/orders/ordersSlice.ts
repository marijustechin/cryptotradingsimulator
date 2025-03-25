import { createSlice, createAsyncThunk, PayLoadAction } from "@reduxjs/toolkit";
import OrdersService from "../../../services/OrdersService";
// importuojam tipa kuris aprašo, kaip atrodo vartotojo portfolio objektas
import { IPortfolioInfo, IUserPortfolioItem } from "../../../types/portfolio";
import { RootState } from "../../store";
import HelperService from "../../../services/HelperService";

// aprasom kaip atrodo state, susijusi su portfolio
interface OrdersState {
    orders: {
        transactions: IPortfolioInfo[];
        portfolio: IUserPortfolioItem[];
      } | null; // portfolio duomenys
  status: "idle" | "loading" | "succeeded" | "failed"; // krovimo pranesimai
  error: string | null; // jei klaida - jos pranesimas
}

// pradine state reiksme

const initialState: OrdersState = {
  orders: {
    transactions: [],
    portfolio: [],
  },
  status: "idle",
  error: "",
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
>("orders/transactions", async (_, { rejectWithValue }) => {
  try {
    const response = await OrdersService.getUserPortfolio();
    return response;
  } catch (error) {
    return rejectWithValue(HelperService.errorToString(error));
  }
});

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
                portfolio: action.payload.portfolio
            }; // saugom gauta portfolio
            state.status = 'succeeded';
            state.error = '';
        })
        .addCase(getUserOrders.rejected, (state, action) => {
            state.error = action.payload as string;
        })
    }
})

export default ordersSlice.reducer
