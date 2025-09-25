// components/PatientBottomNav.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AntDesign } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/StackNavigator';

export default function PatientBottomNav() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const current = route.name;

  const goTo = (screen: keyof RootStackParamList) => {
    if (current !== screen) {
      navigation.navigate(screen);
    }
  };

  const extraBottom = Math.max(insets.bottom, Platform.OS === 'ios' ? 8 : 10);

  return (
    <View style={[styles.container, { height: NAV_HEIGHT + extraBottom, paddingBottom: extraBottom }]}>
      <TouchableOpacity style={styles.item} onPress={() => goTo('Bitacora')}>
        <AntDesign name="book" size={20} color={current === 'Bitacora' ? '#003087' : '#666'} />
        <Text style={[styles.label, current === 'Bitacora' && styles.labelActive]}>Bitácora</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => goTo('Blog')}>
        <AntDesign name="bars" size={20} color={current === 'Blog' ? '#003087' : '#666'} />
        <Text style={[styles.label, current === 'Blog' && styles.labelActive]}>Blog</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => goTo('Progreso')}>
        <AntDesign name="user" size={20} color={current === 'Progreso' ? '#003087' : '#666'} />
        <Text style={[styles.label, current === 'Progreso' && styles.labelActive]}>Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => goTo('Faqs')}>
        <AntDesign name="question-circle" size={20} color={current === 'Faqs' ? '#003087' : '#666'} />
        <Text style={[styles.label, current === 'Faqs' && styles.labelActive]}>Info</Text>
      </TouchableOpacity>
    </View>
  );
}

const NAV_HEIGHT = 64;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  label: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  labelActive: {
    color: '#003087',
  },
});

export { NAV_HEIGHT };

