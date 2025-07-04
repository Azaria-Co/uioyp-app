import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={{
          width: '80%',
          height: 180,
          alignSelf: 'center',
        }}
        resizeMode="contain"
      />
      <Text style={styles.subTitle}>Inicio de Sesión</Text>
      <TextInput style={styles.input} placeholder="Identificador" />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Blog')}>
        <Text style={styles.buttonText}>Iniciar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: 'white' },
  title: { textAlign: 'center', fontSize: 16, color: '#003087', marginTop: 10 },
  subTitle: { textAlign: 'center', fontSize: 18, marginVertical: 20, fontWeight: '600' },
  input: {
    borderColor: '#003087', borderWidth: 1, borderRadius: 10, padding: 10, marginVertical: 8
  },
  button: {
    backgroundColor: '#003087', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
});
