//screens/especialistas/VerPacientesInfoScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, useWindowDimensions, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/StackNavigator';
import { getPacientesByEspecialista } from '../../api/pacientes';
import { getEspecialistaByUserId } from '../../api/especialistas';
import { getIdUs } from '../../utils/auth';
// import LogoutButton from '../../components/LogoutButton';

export default function VerPacientesInfoScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [loading, setLoading] = useState(true);
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const id_us = await getIdUs();
        if (!id_us) throw new Error('No se pudo identificar tu usuario');
        const esp = await getEspecialistaByUserId(id_us);
        if (!esp?.id) throw new Error('No se pudo cargar información de especialista');
        const list = await getPacientesByEspecialista(esp.id);
        setPacientes(Array.isArray(list) ? list : []);
      } catch (e) {
        setPacientes([]);
        Alert.alert('Error', 'No se pudo cargar la lista de pacientes');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openDetails = (paciente: any) => {
    setSelected(paciente);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.title}>Info de Pacientes</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: 16 + Math.max(insets.bottom, 12) }]}>
        {loading ? (
          <View style={styles.centerBox}><Text style={styles.muted}>Cargando...</Text></View>
        ) : pacientes.length === 0 ? (
          <View style={styles.centerBox}>
            <AntDesign name="team" size={48} color="#ccc" />
            <Text style={styles.empty}>No hay pacientes</Text>
          </View>
        ) : (
          pacientes.map((p) => (
            <TouchableOpacity key={p.id} style={styles.row} onPress={() => openDetails(p)}>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{p.nombre_us}</Text>
              </View>
              <AntDesign name="right" size={18} color="#003087" />
            </TouchableOpacity>
          ))
        )}

        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <AntDesign name="arrow-left" size={24} color="#003087" />
            <Text style={styles.backButtonText}>Regresar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: width > 600 ? 520 : width - 40, paddingTop: 16 }]}> 
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Información del Paciente</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <AntDesign name="close" size={22} color="#666" />
              </TouchableOpacity>
            </View>

            {selected ? (
              <View style={{ gap: 8 }}>
                <InfoRow label="Nombre de usuario" value={selected.nombre_us} />
                {selected.masa_muscular !== undefined && selected.masa_muscular !== null && (
                  <InfoRow label="Masa muscular" value={String(selected.masa_muscular)} />
                )}
                {selected.tipo_sangre && <InfoRow label="Tipo de sangre" value={selected.tipo_sangre} />}
                {selected.enfer_pat && <InfoRow label="Enfermedad" value={selected.enfer_pat} />}
                {selected.telefono && <InfoRow label="Teléfono" value={selected.telefono} />}
              </View>
            ) : (
              <Text style={styles.muted}>Sin datos</Text>
            )}
          </View>
        </View>
      </Modal>

      {/* Logout removido en esta vista a petición */}
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null as any;
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: { fontSize: 20, fontWeight: 'bold', color: '#003087', flex: 1 },
  body: { paddingVertical: 16, paddingHorizontal: 15 },
  centerBox: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, gap: 8 },
  muted: { color: '#666' },
  empty: { color: '#666', marginTop: 8 },
  row: {
    backgroundColor: '#fff',
    marginVertical: 6,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rowTitle: { fontSize: 16, fontWeight: 'bold', color: '#003087' },
  bottomContainer: { alignItems: 'center', paddingVertical: 15, marginBottom: 80 },
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
  backButtonText: { color: '#003087', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 20, padding: 20, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#003087', flex: 1 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' },
  infoLabel: { fontSize: 14, color: '#333', fontWeight: '600' },
  infoValue: { fontSize: 14, color: '#333' },
});


