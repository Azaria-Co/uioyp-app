//screens/SplashScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';

export default function SplashScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.replace('Login');
    }, 2500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/UnamLogo.png')} style={styles.logo} />
      <Text style={styles.text}>Unidad de Investigación en Órtesis y Prótesis</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
  logo: { width: 120, height: 120, marginBottom: 20 },
  text: { fontSize: 18, textAlign: 'center', color: '#003087', fontWeight: 'bold' },
});
