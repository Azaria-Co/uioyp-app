// screens/pacientes/ProgresoScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  ScrollView, 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Alert
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import HeaderUser from '../../components/HeaderUser';
import LogoutButton from '../../components/LogoutButton';
import PatientBottomNav, { NAV_HEIGHT } from '../../components/PatientBottomNav';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/StackNavigator';
import { getProgresos } from '../../api/progresos';
import { getPacienteByUsuario } from '../../api/pacientes';
import { getIdUs } from '../../utils/auth';
import ProgresoCard from '../../components/ProgresoCard';

export default function ProgresoScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [progresos, setProgresos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [idPac, setIdPac] = useState<number | null>(null);
  const [pacienteInfo, setPacienteInfo] = useState<any>(null);

  const etapas = ['Semilla', 'Una planta', 'Un pequeño árbol', 'Un árbol grande'];

  useEffect(() => {
    loadPatientId();
  }, []);

  useEffect(() => {
    if (idPac) {
      loadProgresos();
    }
  }, [idPac]);

  const loadPatientId = async () => {
    try {
      const id_us = await getIdUs();
      if (id_us) {
        const paciente = await getPacienteByUsuario(id_us);
        
        if (paciente) {
          setIdPac(paciente.id);
          setPacienteInfo(paciente);
        } else {
          Alert.alert('Error', 'No se encontró información de paciente para tu usuario');
        }
      } else {
        console.log('No se pudo obtener id_us');
        Alert.alert('Error', 'No se pudo identificar tu usuario');
      }
    } catch (error) {
      console.error('Error cargando información de paciente:', error);
      Alert.alert('Error', 'No se pudo cargar tu información de paciente');
    } finally {
      setLoading(false);
    }
  };

  const loadProgresos = async () => {
    if (!idPac) return;
    
    try {
      setLoading(true);
      const data = await getProgresos(idPac);
      setProgresos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error cargando progresos:', error);
      setProgresos([]);
    } finally {
      setLoading(false);
    }
  };



  if (loading) {
    return (
      <View style={styles.container}>
        <HeaderUser currentStage={3} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando tu información...</Text>
        </View>
      </View>
    );
  }

  if (!idPac) {
    return (
      <View style={styles.container}>
        <HeaderUser currentStage={3} />
        <View style={styles.errorContainer}>
          <AntDesign name="exclamationcircle" size={50} color="#ff6b6b" />
          <Text style={styles.errorText}>No se encontró tu información de paciente</Text>
          <Text style={styles.errorSubtext}>Contacta a tu especialista para configurar tu perfil</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderUser currentStage={3} />

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: 90 + NAV_HEIGHT }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Mi Progreso</Text>
        </View>

        {pacienteInfo && (
          <View style={styles.patientInfo}>
            <Text style={styles.patientName}>{pacienteInfo.nombre_us}</Text>
            {pacienteInfo.tipo_sangre && (
              <Text style={styles.patientDetails}>Tipo de sangre: {pacienteInfo.tipo_sangre}</Text>
            )}
          </View>
        )}

        {loading ? (
          <Text style={styles.loadingText}>Cargando progresos...</Text>
        ) : progresos.length === 0 ? (
          <View style={styles.emptyState}>
            <AntDesign name="star" size={50} color="#ccc" />
            <Text style={styles.emptyText}>Aún no tienes progreso registrado</Text>
            <Text style={styles.emptySubtext}>Tu especialista actualizará tu progreso</Text>
          </View>
        ) : (
          <View style={styles.progressContainer}>
            <Text style={styles.progressTitle}>Tu progreso actual:</Text>
            {progresos.map((progreso) => (
              <ProgresoCard
                key={progreso.id}
                id={progreso.id}
                fecha={progreso.fecha}
                etapa={progreso.etapa}
                paciente={progreso.paciente}
                onDelete={undefined}
              />
            ))}
          </View>
        )}
      </ScrollView>



      {/* Logout cerca del menú inferior, pero sin sobreponerse */}
      <View style={{ position: 'absolute', bottom: NAV_HEIGHT + 16, left: 0, right: 0 }}>
        <LogoutButton inline />
      </View>

      <PatientBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  body: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003087',
  },

  patientInfo: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003087',
    marginBottom: 5,
  },
  patientDetails: {
    fontSize: 14,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginTop: 10,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
  progressContainer: {
    marginTop: 10,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003087',
    marginBottom: 15,
    textAlign: 'center',
  },


}); 