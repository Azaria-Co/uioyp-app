// components/LogoutButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import { clearToken } from '../utils/auth';

type LogoutButtonProps = {
  inline?: boolean; // cuando true, no es absoluto; se integra en layouts
  style?: ViewStyle;
};

export default function LogoutButton({ inline = false, style }: LogoutButtonProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleLogout = async () => {
    await clearToken();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const buttonStyle = [inline ? styles.inlineButton : styles.logoutButton, style];

  return (
    <TouchableOpacity style={buttonStyle} onPress={handleLogout}>
      <Text style={styles.logoutText}>Cerrar Sesión</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#003087',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  inlineButton: {
    backgroundColor: '#003087',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: 'center',
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
  },
});