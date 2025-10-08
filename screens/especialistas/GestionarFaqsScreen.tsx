//screens/especialistas/GestionarFaqsScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert, useWindowDimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import { createFaq, deleteFaq, getFaqs, Faq } from '../../api/faqs';
import { getIdUs } from '../../utils/auth';
import { getEspecialistaByUserId } from '../../api/especialistas';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/StackNavigator';

export default function GestionarFaqsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();
  const [pregunta, setPregunta] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [idEsp, setIdEsp] = useState<number | null>(null);
  const [area, setArea] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const id_us = await getIdUs();
        if (id_us) {
          const esp = await getEspecialistaByUserId(id_us);
          setIdEsp(esp?.id ?? null);
          setArea(esp?.area ?? '');
          const data = await getFaqs(esp?.area);
          setFaqs(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        setFaqs([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleCreate = async () => {
    if (!idEsp) return;
    if (!pregunta.trim() || !respuesta.trim()) return;
    try {
      const created = await createFaq({ pregunta: pregunta.trim(), respuesta: respuesta.trim(), id_esp: idEsp });
      setFaqs((prev) => [created, ...prev]);
      setPregunta('');
      setRespuesta('');
    } catch (e) {
      Alert.alert('Error', 'No se pudo crear la FAQ');
    }
  };

  const handleDelete = async (id: number) => {
    if (!idEsp) return;
    try {
      await deleteFaq(id, idEsp);
      setFaqs((prev) => prev.filter((f) => f.id !== id));
    } catch (e) {
      Alert.alert('Error', 'No se pudo eliminar la FAQ');
    }
  };

  const contentWidth = useMemo(() => Math.min(width - 32, 720), [width]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.container}>
          <View style={[styles.centered, { width: contentWidth, marginTop: 4 }]}>
            <Text style={styles.title}>Preguntas frecuentes - {area || 'Mi área'}</Text>
          </View>

          <FlatList
            style={{ flex: 1, width: contentWidth, alignSelf: 'center' }}
            contentContainerStyle={{ paddingBottom: 20 }}
            data={faqs}
            keyExtractor={(item) => item.id.toString()}
            ListHeaderComponent={
              <View>
                <View style={styles.form}>
                  <TextInput
                    style={styles.input}
                    placeholder="Escribe la pregunta"
                    value={pregunta}
                    onChangeText={setPregunta}
                  />
                  <TextInput
                    style={[styles.input, { minHeight: 100 }]}
                    placeholder="Escribe la respuesta"
                    value={respuesta}
                    onChangeText={setRespuesta}
                    multiline
                  />
                  <TouchableOpacity style={styles.createButton} onPress={handleCreate} disabled={!pregunta.trim() || !respuesta.trim()}>
                    <AntDesign name="plus-circle" size={20} color="#fff" />
                    <Text style={styles.createButtonText}>Crear FAQ</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.subtitle}>Mis FAQs</Text>

                {loading && <Text style={styles.loadingText}>Cargando...</Text>}
                {!loading && faqs.length === 0 && (
                  <Text style={styles.emptyText}>Aún no tienes preguntas frecuentes</Text>
                )}
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.faqItem}>
                <Text style={styles.faqQ}>Q: {item.pregunta}</Text>
                <Text style={styles.faqA}>A: {item.respuesta}</Text>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                  <AntDesign name="delete" size={18} color="#fff" />
                  <Text style={styles.deleteText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            )}
            ListFooterComponent={
              <View style={{ paddingVertical: 14, alignItems: 'center' }}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => navigation.navigate('HomeSpecialist')}
                >
                  <AntDesign name="arrow-left" size={24} color="#003087" />
                  <Text style={styles.backButtonText}>Regresar</Text>
                </TouchableOpacity>
              </View>
            }
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 20 },
  centered: { alignSelf: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#003087', marginBottom: 12 },
  form: { backgroundColor: '#f8f9fa', borderRadius: 10, padding: 12, marginBottom: 16 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 10, marginBottom: 10 },
  createButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#003087', paddingVertical: 12, borderRadius: 8, gap: 8 },
  createButtonText: { color: '#fff', fontWeight: 'bold' },
  subtitle: { fontSize: 16, fontWeight: '600', color: '#003087', marginBottom: 8 },
  loadingText: { textAlign: 'center', color: '#666', marginTop: 10 },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 10 },
  faqItem: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, padding: 12, marginBottom: 12 },
  faqQ: { fontWeight: '700', color: '#111', marginBottom: 6 },
  faqA: { color: '#444', marginBottom: 10 },
  deleteButton: { alignSelf: 'flex-start', flexDirection: 'row', gap: 6, backgroundColor: '#dc3545', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  deleteText: { color: '#fff', fontWeight: '600' },
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
});


