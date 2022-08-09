import { createStore, compose, applyMiddleware } from "redux";

import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import thunk from "redux-thunk";
// middlewares
const middleware = [thunk];
// Import custom components
import rootReducer from "../reducers/rootReducers";

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  // blacklist: ['userReducer']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

let store = createStore(
  persistedReducer,
  compose(
    applyMiddleware(...middleware),
    //For working redux dev tools in chrome (https://github.com/zalmoxisus/redux-devtools-extension)
    window.__REDUX_DEVTOOLS_EXTENSION__
      ? window.__REDUX_DEVTOOLS_EXTENSION__ &&
          window.__REDUX_DEVTOOLS_EXTENSION__()
      : (f) => f
  )
);

let persistor = persistStore(store);

export { store, persistor };
