// screens/especialistas/GestionarInvestigacionesScreen.tsx
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator,
  useWindowDimensions 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/StackNavigator';
import { getIdUs, getToken } from '../../utils/auth';
import { getEspecialistaByUserId } from '../../api/especialistas';
import { API_URL } from '../../api/config';
import { AntDesign } from '@expo/vector-icons';

interface Investigacion {
  id: number;
  titulo: string;
  fecha: string;
  texto: string;
  participantes?: number; // Cantidad de participantes
}

interface Participante {
  id: number;
  nombre: string;
  telefono: string;
  fecha_inscripcion: string;
}

const InvestigacionCard = ({ investigacion, onViewParticipants }: { 
  investigacion: Investigacion, 
  onViewParticipants: (id: number) => void 
}) => {
  const { width } = useWindowDimensions();
  const cardWidth = width > 600 ? Math.min(500, width * 0.7) : width - 40;

  return (
    <View style={[styles.cardContainer, { width: cardWidth, alignSelf: 'center' }]}>
      <Text style={styles.titulo}>{investigacion.titulo}</Text>
      <Text style={styles.fecha}>{new Date(investigacion.fecha).toLocaleDateString()}</Text>
      <Text style={styles.descripcion} numberOfLines={3}>
        {investigacion.texto}
      </Text>
      
      <View style={styles.cardFooter}>
        <Text style={styles.participantesCount}>
          <AntDesign name="team" size={16} color="#003087" /> {investigacion.participantes || 0} participantes
        </Text>
        <TouchableOpacity 
          style={styles.viewButton}
          onPress={() => onViewParticipants(investigacion.id)}
        >
          <AntDesign name="eye" size={16} color="white" />
          <Text style={styles.viewButtonText}>Ver participantes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ParticipantesList = ({ participantes, onClose }: { 
  participantes: Participante[], 
  onClose: () => void 
}) => (
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Participantes Interesados</Text>
        <TouchableOpacity onPress={onClose}>
          <AntDesign name="close" size={24} color="#003087" />
        </TouchableOpacity>
      </View>
      
      {participantes.length === 0 ? (
        <Text style={styles.noParticipantes}>
          Aún no hay participantes interesados en esta investigación.
        </Text>
      ) : (
        <FlatList
          data={participantes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.participanteItem}>
              <Text style={styles.participanteNombre}>{item.nombre}</Text>
              <Text style={styles.participanteTelefono}>{item.telefono}</Text>
              <Text style={styles.participanteFecha}>
                Interesado desde: {new Date(item.fecha_inscripcion).toLocaleDateString()}
              </Text>
            </View>
          )}
          style={styles.participantesList}
        />
      )}
    </View>
  </View>
);

export default function GestionarInvestigacionesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [investigaciones, setInvestigaciones] = useState<Investigacion[]>([]);
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingParticipantes, setLoadingParticipantes] = useState(false);
  const [showParticipantes, setShowParticipantes] = useState(false);
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
        
        if (especialistaData && especialistaData.area === 'Investigacion') {
          await loadInvestigaciones(especialistaData.id);
        } else {
          Alert.alert('Error', 'Solo los especialistas en investigación pueden acceder a esta sección');
          navigation.goBack();
        }
      }
    } catch (error) {
      console.error('Error cargando especialista:', error);
      Alert.alert('Error', 'No se pudo cargar tu información de especialista');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const loadInvestigaciones = async (id_esp: number) => {
    try {
      const token = await getToken();
      if (!token) throw new Error('No autenticado');

      const response = await fetch(`${API_URL}/posts/investigaciones/especialista/${id_esp}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Error al cargar investigaciones');
      
      const data = await response.json();
      setInvestigaciones(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error cargando investigaciones:', error);
      Alert.alert('Error', 'No se pudieron cargar las investigaciones');
      setInvestigaciones([]);
    }
  };

  const loadParticipantes = async (id_post: number) => {
    setLoadingParticipantes(true);
    try {
      const token = await getToken();
      if (!token) throw new Error('No autenticado');

      const response = await fetch(`${API_URL}/posts/${id_post}/participantes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Error al cargar participantes');
      
      const data = await response.json();
      setParticipantes(Array.isArray(data) ? data : []);
      setShowParticipantes(true);
    } catch (error) {
      console.error('Error cargando participantes:', error);
      Alert.alert('Error', 'No se pudieron cargar los participantes');
    } finally {
      setLoadingParticipantes(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={40} color="#003087" />
        <Text style={styles.loadingText}>Cargando investigaciones...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name="arrow-left" size={24} color="#003087" />
        </TouchableOpacity>
        <Text style={styles.title}>Mis Investigaciones</Text>
      </View>

      {investigaciones.length === 0 ? (
        <View style={styles.emptyContainer}>
          <AntDesign name="search" size={64} color="#ccc" />
          <Text style={styles.emptyText}>
            Aún no has creado investigaciones.
          </Text>
          <Text style={styles.emptySubtext}>
            Ve a la pantalla principal y crea un post de tipo "Investigación" para empezar.
          </Text>
        </View>
      ) : (
        <FlatList
          data={investigaciones}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <InvestigacionCard 
              investigacion={item}
              onViewParticipants={loadParticipantes}
            />
          )}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      {showParticipantes && (
        <ParticipantesList 
          participantes={participantes}
          onClose={() => setShowParticipantes(false)}
        />
      )}

      {loadingParticipantes && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size={40} color="#003087" />
          <Text style={styles.loadingText}>Cargando participantes...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003087',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  list: {
    flex: 1,
    paddingVertical: 20,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003087',
    marginBottom: 5,
  },
  fecha: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  descripcion: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 15,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participantesCount: {
    fontSize: 14,
    color: '#003087',
    fontWeight: '600',
  },
  viewButton: {
    backgroundColor: '#003087',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  viewButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 20,
    maxHeight: '80%',
    width: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003087',
  },
  participantesList: {
    maxHeight: 400,
  },
  participanteItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  participanteNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003087',
    marginBottom: 5,
  },
  participanteTelefono: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  participanteFecha: {
    fontSize: 12,
    color: '#999',
  },
  noParticipantes: {
    padding: 40,
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
