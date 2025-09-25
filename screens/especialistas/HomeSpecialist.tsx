// screens/especialistas/HomeSpecialist.tsx

import React, { useEffect, useState } from 'react';
import { getNombreUs, getIdUs } from '../../utils/auth';
import CreatePostForm from '../../components/forms/CreatePostForm';
import { getEspecialistaByUserId } from '../../api/especialistas';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LogoutButton from '../../components/LogoutButton';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/StackNavigator';
import { AntDesign } from '@expo/vector-icons';


export default function HomeSpecialist() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
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
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 12 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Bienvenid@, {nombreUs}</Text>
        
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('GestionarProgreso')}
          >
            <AntDesign name="star" size={24} color="white" />
            <Text style={styles.buttonText}>Gestionar Progreso de Pacientes</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.secondActionButton]}
            onPress={() => navigation.navigate('GestionarBitacoras')}
          >
            <AntDesign name="book" size={24} color="white" />
            <Text style={styles.buttonText}>Gestionar Bitácoras de Pacientes</Text>
          </TouchableOpacity>
          
          {/* Botón exclusivo para investigadores */}
          {especialista && especialista.area === 'Investigacion' && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.investigacionButton]}
              onPress={() => navigation.navigate('GestionarInvestigaciones')}
            >
              <AntDesign name="search" size={24} color="white" />
              <Text style={styles.buttonText}>Gestionar Investigaciones</Text>
            </TouchableOpacity>
          )}

          {/* Preguntas frecuentes - visible para todos los especialistas */}
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#17a2b8' }]}
            onPress={() => navigation.navigate('GestionarFaqs')}
          >
            <AntDesign name="question-circle" size={24} color="white" />
            <Text style={styles.buttonText}>Preguntas Frecuentes</Text>
          </TouchableOpacity>
        </View>

        <View style={{ width: '100%', alignItems: 'center', marginTop: 20 }}>
          {especialista && (
            <CreatePostForm area={especialista.area} id_esp={especialista.id} />
          )}
        </View>

        {/* Botón para ver gráficas de posts más likeados */}
        <View style={{ width: '100%', paddingHorizontal: 20, marginTop: 10 }}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#ff7f50' }]}
            onPress={() => navigation.navigate('PostsAnalytics')}
          >
            <AntDesign name="area-chart" size={24} color="white" />
            <Text style={styles.buttonText}>Ver estadísticas de posts</Text>
          </TouchableOpacity>
        </View>

        {/* Ver info de pacientes */}
        <View style={{ width: '100%', paddingHorizontal: 20, marginTop: 10 }}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#6c757d' }]}
            onPress={() => navigation.navigate('VerPacientesInfo')}
          >
            <AntDesign name="profile" size={24} color="white" />
            <Text style={styles.buttonText}>Info de pacientes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <LogoutButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { 
    flexGrow: 1, 
    justifyContent: 'flex-start', 
    alignItems: 'center', 
    paddingVertical: 20,
    paddingBottom: 120, // Espacio extra para el botón de logout
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#003087' },
  subtitle: { fontSize: 16, color: '#555', marginTop: 10 },
  areaText: { fontSize: 16, color: '#003087', marginTop: 10, fontWeight: '600' },
  buttonsContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: '#003087',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: 15,
  },
  secondActionButton: {
    backgroundColor: '#28a745',
  },
  investigacionButton: {
    backgroundColor: '#6f42c1',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
