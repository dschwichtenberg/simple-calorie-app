import { configureStore } from "@reduxjs/toolkit";

import settings from "../containers/Setting/settingsReducer";
import product from "../containers/Home/productReducer";
import auth from "../containers/Login/authReducer";

export default configureStore({
  reducer: {
    settings: settings,
    product: product,
    auth: auth,
  },
});
