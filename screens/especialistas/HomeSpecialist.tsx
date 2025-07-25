// screens/especialistas/HomeSpecialist.tsx

import React, { useEffect, useState } from 'react';
import { getNombreUs, getIdUs } from '../../utils/auth';
import CreatePostForm from '../../components/forms/CreatePostForm';
import { getEspecialistaByUserId } from '../../api/especialistas';
import { View, Text, StyleSheet } from 'react-native';
import LogoutButton from '../../components/LogoutButton';


export default function HomeSpecialist() {
  const [nombreUs, setNombreUs] = useState<string | null>(null);
  const [idUs, setIdUs] = useState<number | null>(null);
  const [especialista, setEspecialista] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNombreUs().then(setNombreUs);
    getIdUs().then(async (id) => {
      setIdUs(id);
      if (id) {
        try {
          const data = await getEspecialistaByUserId(id);
          setEspecialista(data);
        } catch (e) {
          setEspecialista(null);
        }
      }
      setLoading(false);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenid@, {nombreUs}</Text>
      <View style={{ width: '100%', alignItems: 'center', marginTop: 20 }}>
        {especialista && (
          <CreatePostForm area={especialista.area} id_esp={especialista.id} />
        )}
      </View>
      <LogoutButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#003087' },
  subtitle: { fontSize: 16, color: '#555', marginTop: 10 },
  areaText: { fontSize: 16, color: '#003087', marginTop: 10, fontWeight: '600' },
});
