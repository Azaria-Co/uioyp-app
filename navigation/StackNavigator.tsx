import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import BlogScreen from '../screens/pacientes/BlogScreen';
import HomeSpecialist from '../screens/especialistas/HomeSpecialist';
import AdminScreen from '../screens/admin/AdminScreen';
import BitacoraScreen from '../screens/pacientes/BitacoraScreen';
import ProgresoScreen from '../screens/pacientes/ProgresoScreen';
import GestionarProgresoScreen from '../screens/especialistas/GestionarProgresoScreen';
import GestionarBitacorasScreen from '../screens/especialistas/GestionarBitacorasScreen';
import GestionarInvestigacionesScreen from '../screens/especialistas/GestionarInvestigacionesScreen';
import VerPacientesInfoScreen from '../screens/especialistas/VerPacientesInfoScreen';
import PostsAnalyticsScreen from '../screens/especialistas/PostsAnalyticsScreen';
import GestionarFaqsScreen from '../screens/especialistas/GestionarFaqsScreen';
import FaqsScreen from '../screens/pacientes/FaqsScreen';


export type RootStackParamList = {
  Splash: undefined;
  Login: undefined; 
  Blog: undefined;
  HomeSpecialist: undefined;
  AdminScreen: undefined;
  Bitacora: undefined;
  Progreso: undefined;
  GestionarProgreso: undefined;
  GestionarBitacoras: undefined;
  GestionarInvestigaciones: undefined;
  PostsAnalytics: undefined;
  GestionarFaqs: undefined;
  Faqs: undefined;
  VerPacientesInfo: undefined;
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
      <Stack.Screen name="Bitacora" component={BitacoraScreen} />
      <Stack.Screen name="Progreso" component={ProgresoScreen} />
      <Stack.Screen name="GestionarProgreso" component={GestionarProgresoScreen} />
      <Stack.Screen name="GestionarBitacoras" component={GestionarBitacorasScreen} />
      <Stack.Screen name="GestionarInvestigaciones" component={GestionarInvestigacionesScreen} />
      <Stack.Screen name="PostsAnalytics" component={PostsAnalyticsScreen} />
      <Stack.Screen name="GestionarFaqs" component={GestionarFaqsScreen} />
      <Stack.Screen name="Faqs" component={FaqsScreen} />
      <Stack.Screen name="VerPacientesInfo" component={VerPacientesInfoScreen} />
    </Stack.Navigator>
  );
}
