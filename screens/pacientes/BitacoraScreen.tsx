// screens/pacientes/BitacoraScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  ScrollView, 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Modal,
  Alert,
  useWindowDimensions,
  TextInput 
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import HeaderUser from '../../components/HeaderUser';
import { useCurrentStage } from '../../utils/useCurrentStage';
import LogoutButton from '../../components/LogoutButton';
import PatientBottomNav, { NAV_HEIGHT } from '../../components/PatientBottomNav';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/StackNavigator';
import BitacoraCard from '../../components/BitacoraCard';
import BloodPressureInput from '../../components/forms/BloodPressureInput';
import GlucoseInput from '../../components/forms/GlucoseInput';
import { getBitacoras, crearBitacora, eliminarBitacora } from '../../api/bitacoras';
import { getPacienteByUsuario } from '../../api/pacientes';
import { getIdUs } from '../../utils/auth';

export default function BitacoraScreen() {
  const { currentStage } = useCurrentStage();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();
  const [bitacoras, setBitacoras] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [presionAr, setPresionAr] = useState('');
  const [glucosa, setGlucosa] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [idPac, setIdPac] = useState<number | null>(null);
  const [pacienteInfo, setPacienteInfo] = useState<any>(null);
  const [comidas, setComidas] = useState('');
  const [medicamentos, setMedicamentos] = useState('');

  useEffect(() => {
    loadPatientId();
  }, []);

  useEffect(() => {
    if (idPac) {
      loadBitacoras();
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

  const loadBitacoras = async () => {
    if (!idPac) return;
    
    try {
      setLoading(true);
      const data = await getBitacoras(idPac);
      setBitacoras(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error cargando bitácoras:', error);
      setBitacoras([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!presionAr.trim() || !glucosa.trim() || !idPac) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    const glucosaNum = parseFloat(glucosa);
    if (isNaN(glucosaNum)) {
      Alert.alert('Error', 'La glucosa debe ser un número válido');
      return;
    }

    try {
      setSubmitting(true);
      const fecha = new Date().toISOString();
      console.log('Creando bitácora para paciente:', idPac);
      await crearBitacora(fecha, presionAr, glucosaNum, idPac, comidas, medicamentos);
      
      // Limpiar formulario
      setPresionAr('');
      setGlucosa('');
      setComidas('');
      setMedicamentos('');
      setModalVisible(false);
      
      // Recargar bitácoras
      await loadBitacoras();
      
      Alert.alert('Éxito', 'Bitácora registrada correctamente');
    } catch (error) {
      console.error('Error creando bitácora:', error);
      Alert.alert('Error', 'No se pudo registrar la bitácora');
    } finally {
      setSubmitting(false);
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
              await loadBitacoras();
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
        <HeaderUser currentStage={currentStage} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando tu información...</Text>
        </View>
      </View>
    );
  }

  if (!idPac) {
    return (
      <View style={styles.container}>
        <HeaderUser currentStage={currentStage} />
        <View style={styles.errorContainer}>
          <AntDesign name="exclamation-circle" size={50} color="#ff6b6b" />
          <Text style={styles.errorText}>No se encontró tu información de paciente</Text>
          <Text style={styles.errorSubtext}>Contacta a tu especialista para configurar tu perfil</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderUser currentStage={currentStage} />

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: 30 + NAV_HEIGHT }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Mi Bitácora</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <AntDesign name="plus" size={24} color="white" />
          </TouchableOpacity>
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
          <Text style={styles.loadingText}>Cargando bitácoras...</Text>
        ) : bitacoras.length === 0 ? (
          <View style={styles.emptyState}>
            <AntDesign name="book" size={50} color="#ccc" />
            <Text style={styles.emptyText}>No hay bitácoras registradas</Text>
            <Text style={styles.emptySubtext}>Toca el botón + para agregar una nueva</Text>
          </View>
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

      {/* Modal para agregar bitácora */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: width > 600 ? 500 : width - 40 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nueva Bitácora</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <AntDesign name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <BloodPressureInput presionAr={presionAr} setPresionAr={setPresionAr} />
            <GlucoseInput glucosa={glucosa} setGlucosa={setGlucosa} />
            <Text style={{marginTop: 10, fontWeight: 'bold'}}>Comidas consumidas</Text>
            <TextInput
              style={{borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 10}}
              placeholder="Ejemplo: Desayuno, almuerzo, cena..."
              value={comidas}
              onChangeText={setComidas}
              multiline
            />
            <Text style={{marginTop: 10, fontWeight: 'bold'}}>Medicamentos consumidos</Text>
            <TextInput
              style={{borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 10}}
              placeholder="Ejemplo: Paracetamol, insulina..."
              value={medicamentos}
              onChangeText={setMedicamentos}
              multiline
            />

            <TouchableOpacity
              style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              <Text style={styles.submitButtonText}>
                {submitting ? 'Guardando...' : 'Guardar Bitácora'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
  addButton: {
    backgroundColor: '#003087',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  bitacoraButton: {
    position: 'absolute',
    bottom: 80, // Posicionado arriba del LogoutButton
    alignSelf: 'center',
    backgroundColor: '#003087',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  bitacoraButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
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
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003087',
  },
  submitButton: {
    backgroundColor: '#003087',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});