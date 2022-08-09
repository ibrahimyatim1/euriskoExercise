   
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import Login from '../screens/login';
import Home from '../screens/home';

function AppContainer() {
  const user = useSelector((state)=> state.userReducer);
  const Stack = createStackNavigator();
 
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            header: ()=> null,
          }}
        />
        {user &&
          <Stack.Screen
          name="Home"
          component={Home}
          options={{
            header: ()=> null,
          }}
        />
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppContainer;