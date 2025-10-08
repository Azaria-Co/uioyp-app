//screens/pacientes/FaqsScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import HeaderUser from '../../components/HeaderUser';
import { useCurrentStage } from '../../utils/useCurrentStage';
import PatientBottomNav, { NAV_HEIGHT } from '../../components/PatientBottomNav';
import { getFaqs, Faq } from '../../api/faqs';

const AREAS = [
  'Medicina General',
  'Neuropsicologia',
  'Ortesis y Protesis',
  'Nutricion',
  'Fisioterapia',
  'Investigacion',
];

export default function FaqsScreen() {
  const { currentStage } = useCurrentStage();
  const [expandedIds, setExpandedIds] = useState<Record<number, boolean>>({});
  const [faqsByArea, setFaqsByArea] = useState<Record<string, Faq[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const result: Record<string, Faq[]> = {} as any;
        // Carga por área para poder ordenar y agrupar claramente
        await Promise.all(
          AREAS.map(async (area) => {
            const data = await getFaqs(area);
            result[area] = Array.isArray(data) ? data : [];
          })
        );
        setFaqsByArea(result);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggle = (id: number) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <View style={styles.container}>
      <HeaderUser currentStage={currentStage} />

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: 20 + NAV_HEIGHT }]}>
        <Text style={styles.title}>Preguntas Frecuentes</Text>

        {loading ? (
          <Text style={styles.loading}>Cargando...</Text>
        ) : (
          AREAS.map((area) => (
            <View key={area} style={styles.areaSection}>
              <Text style={styles.areaTitle}>{area}</Text>
              {(faqsByArea[area] || []).length === 0 ? (
                <Text style={styles.emptyText}>No hay preguntas en esta área todavía.</Text>
              ) : (
                (faqsByArea[area] || []).map((f) => (
                  <View key={f.id} style={styles.faq}>
                    <TouchableOpacity onPress={() => toggle(f.id)}>
                      <Text style={styles.faqQ}>{f.pregunta}</Text>
                    </TouchableOpacity>
                    {expandedIds[f.id] && (
                      <Text style={styles.faqA}>{f.respuesta}</Text>
                    )}
                  </View>
                ))
              )}
            </View>
          ))
        )}
      </ScrollView>

      <PatientBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  body: { paddingVertical: 20, paddingHorizontal: 15 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#003087', marginBottom: 10, textAlign: 'center' },
  areaSection: { marginBottom: 16 },
  areaTitle: { fontSize: 18, fontWeight: '700', color: '#003087', marginBottom: 8 },
  emptyText: { color: '#999', fontStyle: 'italic' },
  faq: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, padding: 12, marginBottom: 10 },
  faqQ: { fontWeight: '700', color: '#111' },
  faqA: { marginTop: 6, color: '#444' },
  loading: { textAlign: 'center', color: '#666', marginTop: 16 },
});


