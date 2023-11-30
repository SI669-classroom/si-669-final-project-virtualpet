// In App.js in a new project

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import CreateScreen from './screens/CreateScreen';
import LoginScreen from './screens/LoginScreen';

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './data/Reducer';
import WalkScreen from './screens/WalkScreen';

const Stack = createNativeStackNavigator();

const store = configureStore({
  reducer: rootReducer,
});

function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
      <Stack.Navigator initialRouteName='Login' 
          screenOptions={{ headerShown: false }}>
          <Stack.Screen name='Login' component={LoginScreen}/>
          <Stack.Screen name="Create" component={CreateScreen} />
          <Stack.Screen name='Home' component={HomeScreen}/>
          <Stack.Screen name='Walk' component={WalkScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;