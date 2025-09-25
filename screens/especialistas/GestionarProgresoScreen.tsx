// screens/especialistas/GestionarProgresoScreen.tsx
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
import { getProgresos, crearProgreso, eliminarProgreso } from '../../api/progresos';
import { getEspecialistaByUserId } from '../../api/especialistas';
import { getIdUs } from '../../utils/auth';
import LogoutButton from '../../components/LogoutButton';
import ProgresoCard from '../../components/ProgresoCard';

interface PacienteCardProps {
  paciente: any;
  onUpdateProgress: (paciente: any) => void;
}

const PacienteCard = ({ paciente, onUpdateProgress }: PacienteCardProps) => {
  return (
    <TouchableOpacity 
      style={styles.pacienteCard}
      onPress={() => onUpdateProgress(paciente)}
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

export default function GestionarProgresoScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState<any>(null);
  const [progresos, setProgresos] = useState<any[]>([]);
  const [etapa, setEtapa] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [especialista, setEspecialista] = useState<any>(null);

  const etapas = ['Semilla', 'Una planta', 'Un pequeño árbol', 'Un árbol grande'];

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

  const handleUpdateProgress = async (paciente: any) => {
    setSelectedPaciente(paciente);
    setModalVisible(true);
    
    // Cargar progresos del paciente
    try {
      const progresosData = await getProgresos(paciente.id);
      setProgresos(Array.isArray(progresosData) ? progresosData : []);
    } catch (error) {
      console.error('Error cargando progresos:', error);
      setProgresos([]);
    }
  };

  const handleSubmit = async () => {
    if (!etapa.trim() || !selectedPaciente) {
      Alert.alert('Error', 'Por favor selecciona una etapa');
      return;
    }

    try {
      setSubmitting(true);
      const fecha = new Date().toISOString();
      console.log('Creando progreso para paciente:', selectedPaciente.id);
      await crearProgreso(fecha, etapa, selectedPaciente.id);
      
      // Limpiar formulario
      setEtapa('');
      
      // Recargar progresos
      const progresosData = await getProgresos(selectedPaciente.id);
      setProgresos(Array.isArray(progresosData) ? progresosData : []);
      
      Alert.alert('Éxito', 'Progreso registrado correctamente');
    } catch (error) {
      console.error('Error creando progreso:', error);
      Alert.alert('Error', 'No se pudo registrar el progreso');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar este progreso?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await eliminarProgreso(id);
              const progresosData = await getProgresos(selectedPaciente.id);
              setProgresos(Array.isArray(progresosData) ? progresosData : []);
              Alert.alert('Éxito', 'Progreso eliminado correctamente');
            } catch (error) {
              console.error('Error eliminando progreso:', error);
              Alert.alert('Error', 'No se pudo eliminar el progreso');
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
        <Text style={styles.title}>Gestionar Progreso de Pacientes</Text>
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
            <PacienteCard
              key={paciente.id}
              paciente={paciente}
              onUpdateProgress={handleUpdateProgress}
            />
          ))
        )}
      </ScrollView>

      {/* Modal para gestionar progreso */}
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
                Progreso de {selectedPaciente?.nombre_us}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <AntDesign name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.progresosList}>
              {progresos.length === 0 ? (
                <Text style={styles.noProgresoText}>No hay progresos registrados</Text>
              ) : (
                progresos.map((progreso) => (
                  <ProgresoCard
                    key={progreso.id}
                    id={progreso.id}
                    fecha={progreso.fecha}
                    etapa={progreso.etapa}
                    paciente={progreso.paciente}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </ScrollView>

            <View style={styles.modalActions}>
              <Text style={styles.modalLabel}>Agregar nueva etapa:</Text>
              <View style={styles.etapasContainer}>
                {etapas.map((etapaOption) => (
                  <TouchableOpacity
                    key={etapaOption}
                    style={[
                      styles.etapaOption,
                      etapa === etapaOption && styles.etapaOptionSelected
                    ]}
                    onPress={() => setEtapa(etapaOption)}
                  >
                    <Text style={[
                      styles.etapaOptionText,
                      etapa === etapaOption && styles.etapaOptionTextSelected
                    ]}>
                      {etapaOption}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={submitting}
              >
                <Text style={styles.submitButtonText}>
                  {submitting ? 'Guardando...' : 'Guardar Progreso'}
                </Text>
              </TouchableOpacity>
            </View>
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
  progresosList: {
    maxHeight: 300,
    marginBottom: 20,
  },
  noProgresoText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginVertical: 20,
  },
  modalActions: {
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 20,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003087',
    marginBottom: 15,
  },
  etapasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  etapaOption: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f8f9fa',
  },
  etapaOptionSelected: {
    backgroundColor: '#003087',
    borderColor: '#003087',
  },
  etapaOptionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  etapaOptionTextSelected: {
    color: 'white',
  },
  submitButton: {
    backgroundColor: '#003087',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
}); 