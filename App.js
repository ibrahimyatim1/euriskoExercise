
 import React, { useEffect } from 'react';
 import { LogBox } from 'react-native';
 import { Provider } from "react-redux";
 import {PersistGate} from 'redux-persist/integration/react';
 
 import { store, persistor } from "./src/store/index";
 
 LogBox.ignoreAllLogs();
 
 import AppContainer from './src/navigation/index';
 import 'react-native-gesture-handler';
 
 function Main() {
   return (
     <Provider store={store}>
       <PersistGate loading={null} persistor={persistor}>
         <AppContainer/>
       </PersistGate>
     </Provider>
   );
 }
 
 
 
 export default Main;
 