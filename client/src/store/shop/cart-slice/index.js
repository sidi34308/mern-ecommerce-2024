// import axios from "axios";
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// const initialState = {
//   cartItems: [],
//   isLoading: false,
// };

// export const addToCart = createAsyncThunk(
//   "cart/addToCart",
//   async ({ userId, productId, quantity }) => {
//     const response = await axios.post(
//       "http://localhost:5000/api/shop/cart/add",
//       {
//         userId,
//         productId,
//         quantity,
//       }
//     );

//     return response.data;
//   }
// );

// export const fetchCartItems = createAsyncThunk(
//   "cart/fetchCartItems",
//   async (userId) => {
//     const response = await axios.get(
//       `http://localhost:5000/api/shop/cart/get/${userId}`
//     );

//     return response.data;
//   }
// );

// export const deleteCartItem = createAsyncThunk(
//   "cart/deleteCartItem",
//   async ({ userId, productId }) => {
//     const response = await axios.delete(
//       `http://localhost:5000/api/shop/cart/${userId}/${productId}`
//     );

//     return response.data;
//   }
// );

// export const updateCartQuantity = createAsyncThunk(
//   "cart/updateCartQuantity",
//   async ({ userId, productId, quantity }) => {
//     const response = await axios.put(
//       "http://localhost:5000/api/shop/cart/update-cart",
//       {
//         userId,
//         productId,
//         quantity,
//       }
//     );

//     return response.data;
//   }
// );

// const shoppingCartSlice = createSlice({
//   name: "shoppingCart",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(addToCart.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(addToCart.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.cartItems = action.payload.data;
//       })
//       .addCase(addToCart.rejected, (state) => {
//         state.isLoading = false;
//         state.cartItems = [];
//       })
//       .addCase(fetchCartItems.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(fetchCartItems.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.cartItems = action.payload.data;
//       })
//       .addCase(fetchCartItems.rejected, (state) => {
//         state.isLoading = false;
//         state.cartItems = [];
//       })
//       .addCase(updateCartQuantity.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(updateCartQuantity.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.cartItems = action.payload.data;
//       })
//       .addCase(updateCartQuantity.rejected, (state) => {
//         state.isLoading = false;
//         state.cartItems = [];
//       })
//       .addCase(deleteCartItem.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(deleteCartItem.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.cartItems = action.payload.data;
//       })
//       .addCase(deleteCartItem.rejected, (state) => {
//         state.isLoading = false;
//         state.cartItems = [];
//       });
//   },
// });

// export default shoppingCartSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
  isLoading: false,
};

// Helper function to update localStorage
const updateLocalStorage = (cartItems) => {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
};

// Add to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }) => {
    console.log("HERDCFVE");

    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    console.log("HERDCFVE", cartItems);

    const existingItemIndex = cartItems.findIndex(
      (item) => item.productId === productId
    );

    if (existingItemIndex >= 0) {
      cartItems[existingItemIndex].quantity += quantity;
    } else {
      cartItems.push({ productId, quantity });
      console.log("ADDED");
    }

    updateLocalStorage(cartItems);
    return cartItems;
  }
);

// Fetch cart items
export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async () => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    return cartItems;
  }
);

// Delete cart item
export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ productId }) => {
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    cartItems = cartItems.filter((item) => item.productId !== productId);

    updateLocalStorage(cartItems);
    return cartItems;
  }
);

// Update cart item quantity
export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ productId, quantity }) => {
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const itemIndex = cartItems.findIndex(
      (item) => item.productId === productId
    );

    if (itemIndex >= 0) {
      cartItems[itemIndex].quantity = quantity;
    }

    updateLocalStorage(cartItems);
    return cartItems;
  }
);

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload;
      })
      .addCase(addToCart.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload;
      })
      .addCase(fetchCartItems.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload;
      })
      .addCase(updateCartQuantity.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload;
      })
      .addCase(deleteCartItem.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default shoppingCartSlice.reducer;
