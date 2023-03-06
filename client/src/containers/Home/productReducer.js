import { createSlice } from "@reduxjs/toolkit";

export const product = createSlice({
  name: "product",
  initialState: {
    products: [],
  },
  reducers: {
    setProducts: (state, action) => ({
      ...state,
      products: action.payload,
    }),
    addProduct: (state, action) => ({
      ...state,
      products: state.products.concat(action.payload),
    }),
    removeProduct: (state, action) => ({
      ...state,
      products: state.products.filter(
        (product) =>
          product.productName !== action.payload.productName &&
          product.calorie !== action.payload.calorie &&
          product.date !== action.payload.date
      ),
    }),
  },
});

export const { addProduct, removeProduct, setProducts } = product.actions;

export const getProducts = (state) => state.product.products;

export default product.reducer;
