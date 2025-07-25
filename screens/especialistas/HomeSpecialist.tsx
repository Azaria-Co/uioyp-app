// screens/especialistas/HomeSpecialist.tsx
import React, {useEffect} from 'react';
import { getNombreUs } from '../../utils/auth';
import { View, Text, StyleSheet } from 'react-native';
import LogoutButton from '../../components/LogoutButton';

export default function HomeSpecialist() {
  const [nombreUs, setNombreUs] = React.useState<string | null>(null);

  useEffect(() => {
    getNombreUs().then(setNombreUs);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenid@, {nombreUs}</Text>
      {/* Aquí va el contenido para especialistas */}
      <LogoutButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#003087' },
});
