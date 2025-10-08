// screens/especialistas/GestionarBitacorasScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  ScrollView, 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Modal,
  Alert,
  useWindowDimensions 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/StackNavigator';
import { getPacientesByEspecialista } from '../../api/pacientes';
import { getBitacoras, eliminarBitacora } from '../../api/bitacoras';
import { getEspecialistaByUserId } from '../../api/especialistas';
import { getIdUs } from '../../utils/auth';
import LogoutButton from '../../components/LogoutButton';
import BitacoraCard from '../../components/BitacoraCard';
import { createPatientReminder } from '../../api/push';

interface PacienteCardProps {
  paciente: any;
  onViewBitacoras: (paciente: any) => void;
}

const PacienteCard = ({ paciente, onViewBitacoras }: PacienteCardProps) => {
  return (
    <TouchableOpacity 
      style={styles.pacienteCard}
      onPress={() => onViewBitacoras(paciente)}
    >
      <View style={styles.pacienteInfo}>
        <Text style={styles.pacienteNombre}>{paciente.nombre_us}</Text>
        {paciente.tipo_sangre && (
          <Text style={styles.pacienteDetalles}>Tipo de sangre: {paciente.tipo_sangre}</Text>
        )}
        {paciente.enfer_pat && (
          <Text style={styles.pacienteDetalles}>Enfermedad: {paciente.enfer_pat}</Text>
        )}
      </View>
      <AntDesign name="right" size={20} color="#003087" />
    </TouchableOpacity>
  );
};

export default function GestionarBitacorasScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState<any>(null);
  const [bitacoras, setBitacoras] = useState<any[]>([]);
  const [especialista, setEspecialista] = useState<any>(null);

  useEffect(() => {
    loadEspecialista();
  }, []);

  const loadEspecialista = async () => {
    try {
      const id_us = await getIdUs();
      if (id_us) {
        const especialistaData = await getEspecialistaByUserId(id_us);
        setEspecialista(especialistaData);
        
        if (especialistaData) {
          await loadPacientes(especialistaData.id);
        }
      }
    } catch (error) {
      console.error('Error cargando especialista:', error);
      Alert.alert('Error', 'No se pudo cargar tu información de especialista');
    } finally {
      setLoading(false);
    }
  };

  const loadPacientes = async (id_esp: number) => {
    try {
      const data = await getPacientesByEspecialista(id_esp);
      setPacientes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error cargando pacientes:', error);
      setPacientes([]);
    }
  };

  const handleViewBitacoras = async (paciente: any) => {
    setSelectedPaciente(paciente);
    setModalVisible(true);
    
    // Cargar bitácoras del paciente
    try {
      const bitacorasData = await getBitacoras(paciente.id);
      setBitacoras(Array.isArray(bitacorasData) ? bitacorasData : []);
    } catch (error) {
      console.error('Error cargando bitácoras:', error);
      setBitacoras([]);
    }
  };

  const handleScheduleReminders = async (paciente: any) => {
    if (!especialista) return;
    try {
      // 19:00 y 20:00
      await createPatientReminder(paciente.id, 19, 0, especialista.id);
      await createPatientReminder(paciente.id, 20, 0, especialista.id);
      Alert.alert('Éxito', 'Se agendaron recordatorios a las 7:00 pm y 8:00 pm');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudieron agendar recordatorios');
    }
  };

  const handleDelete = async (id: number) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar esta bitácora?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await eliminarBitacora(id);
              const bitacorasData = await getBitacoras(selectedPaciente.id);
              setBitacoras(Array.isArray(bitacorasData) ? bitacorasData : []);
              Alert.alert('Éxito', 'Bitácora eliminada correctamente');
            } catch (error) {
              console.error('Error eliminando bitácora:', error);
              Alert.alert('Error', 'No se pudo eliminar la bitácora');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando información...</Text>
        </View>
      </View>
    );
  }

  if (!especialista) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <AntDesign name="exclamation-circle" size={50} color="#ff6b6b" />
          <Text style={styles.errorText}>No se encontró tu información de especialista</Text>
          <Text style={styles.errorSubtext}>Contacta al administrador para configurar tu perfil</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.title}>Gestionar Bitácoras de Pacientes</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: 16 + insets.bottom }]}>
        {especialista && (
          <View style={styles.especialistaInfo}>
            <Text style={styles.especialistaNombre}>{especialista.nombre_us}</Text>
            <Text style={styles.especialistaArea}>Área: {especialista.area}</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Todos los Pacientes</Text>

        {pacientes.length === 0 ? (
          <View style={styles.emptyState}>
            <AntDesign name="team" size={50} color="#ccc" />
            <Text style={styles.emptyText}>No hay pacientes registrados</Text>
            <Text style={styles.emptySubtext}>Los pacientes aparecerán aquí cuando se registren</Text>
          </View>
        ) : (
          pacientes.map((paciente) => (
            <View key={paciente.id}>
              <PacienteCard
                paciente={paciente}
                onViewBitacoras={handleViewBitacoras}
              />
              <View style={{ flexDirection: 'row', gap: 10, marginHorizontal: 15, marginTop: 6, marginBottom: 4 }}>
                <TouchableOpacity style={styles.remButton} onPress={() => handleScheduleReminders(paciente)}>
                  <AntDesign name="bell" size={16} color="#fff" />
                  <Text style={styles.remButtonText}>Agendar 7pm y 8pm</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Modal para ver bitácoras */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: width > 600 ? 500 : width - 40 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Bitácoras de {selectedPaciente?.nombre_us}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <AntDesign name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.bitacorasList}>
              {bitacoras.length === 0 ? (
                <Text style={styles.noBitacoraText}>No hay bitácoras registradas</Text>
              ) : (
                bitacoras.map((bitacora) => (
                  <BitacoraCard
                    key={bitacora.id}
                    id={bitacora.id}
                    fecha={bitacora.fecha}
                    presion_ar={bitacora.presion_ar}
                    glucosa={bitacora.glucosa}
                    comidas={bitacora.comidas}
                    medicamentos={bitacora.medicamentos}
                    paciente={bitacora.paciente}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="arrow-left" size={24} color="#003087" />
          <Text style={styles.backButtonText}>Regresar</Text>
        </TouchableOpacity>
      </View>
      
      <LogoutButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003087',
    flex: 1,
  },
  headerBackButton: {
    padding: 5,
  },
  body: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  especialistaInfo: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  especialistaNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003087',
    marginBottom: 5,
  },
  especialistaArea: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003087',
    marginBottom: 15,
  },
  pacienteCard: {
    backgroundColor: '#fff',
    marginVertical: 8,
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pacienteInfo: {
    flex: 1,
  },
  pacienteNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003087',
    marginBottom: 5,
  },
  pacienteDetalles: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    textAlign: 'center',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003087',
    flex: 1,
  },
  bitacorasList: {
    maxHeight: 400,
  },
  noBitacoraText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginVertical: 20,
  },
  bottomContainer: {
    alignItems: 'center',
    paddingVertical: 15,
    marginBottom: 80, // Espacio para el LogoutButton
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#003087',
  },
  backButtonText: {
    color: '#003087',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  remButton: {
    backgroundColor: '#28a745',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  remButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
}); 