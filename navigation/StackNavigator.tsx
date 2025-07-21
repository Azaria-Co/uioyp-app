import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import BlogScreen from '../screens/pacientes/BlogScreen';
import HomeSpecialist from '../screens/especialistas/HomeSpecialist';
import AdminScreen from '../screens/admin/AdminScreen';


export type RootStackParamList = {
  Splash: undefined;
  Login: undefined; 
  Blog: undefined;
  HomeSpecialist: undefined;
  AdminScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Blog" component={BlogScreen} />
      <Stack.Screen name="HomeSpecialist" component={HomeSpecialist} />
      <Stack.Screen name="AdminScreen" component={AdminScreen} /> 
    </Stack.Navigator>
  );
}
