import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions, TouchableOpacity } from 'react-native';
import { getIdUs } from '../../utils/auth';
import { getEspecialistaByUserId } from '../../api/especialistas';
import { getTopLikedPosts, getTopLikedPostsByEspecialista } from '../../api/posts';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/StackNavigator';
import { AntDesign } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TopPostItem {
  id: number;
  titulo: string;
  likes: number;
}

function Bar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const { width } = useWindowDimensions();
  const maxBar = Math.min(320, Math.max(180, width - 80));
  const pct = max > 0 ? Math.max(4, Math.round((value / max) * maxBar)) : 4;
  return (
    <View style={styles.barRow}>
      <Text style={styles.barLabel} numberOfLines={1}>{label}</Text>
      <View style={[styles.bar, { width: pct, backgroundColor: color }]} />
      <Text style={styles.barValue}>{value}</Text>
    </View>
  );
}

export default function PostsAnalyticsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const [general, setGeneral] = useState<TopPostItem[]>([]);
  const [mine, setMine] = useState<TopPostItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [gen, idUs] = await Promise.all([getTopLikedPosts(), getIdUs()]);
        setGeneral(Array.isArray(gen) ? gen : []);
        if (idUs) {
          const esp = await getEspecialistaByUserId(idUs);
          if (esp?.id) {
            const own = await getTopLikedPostsByEspecialista(esp.id);
            setMine(Array.isArray(own) ? own : []);
          }
        }
      } catch {
        setGeneral([]); setMine([]);
      }
    })();
  }, []);

  const maxGeneral = useMemo(() => Math.max(0, ...general.map(p => p.likes || 0)), [general]);
  const maxMine = useMemo(() => Math.max(0, ...mine.map(p => p.likes || 0)), [mine]);

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top + 8 }] }>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <AntDesign name="arrowleft" size={20} color="#003087" />
        <Text style={styles.backText}>Volver</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Estadísticas de Posts</Text>

      <Text style={styles.sectionTitle}>Más likeados (todos)</Text>
      <View style={styles.panel}>
        {general.length === 0 ? (
          <Text style={styles.empty}>Sin datos</Text>
        ) : (
          general.map((p) => (
            <Bar key={p.id} label={p.titulo} value={p.likes || 0} max={maxGeneral} color="#003087" />
          ))
        )}
      </View>

      <Text style={styles.sectionTitle}>Más likeados (tuyos)</Text>
      <View style={styles.panel}>
        {mine.length === 0 ? (
          <Text style={styles.empty}>Sin datos</Text>
        ) : (
          mine.map((p) => (
            <Bar key={p.id} label={p.titulo} value={p.likes || 0} max={maxMine} color="#28a745" />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  backText: {
    color: '#003087',
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#003087',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  panel: {
    backgroundColor: '#f8f9fa',
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
  },
  empty: {
    color: '#666',
    textAlign: 'center',
    paddingVertical: 12,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 6,
  },
  barLabel: {
    flex: 1,
    fontSize: 13,
    color: '#333',
  },
  bar: {
    height: 14,
    borderRadius: 7,
  },
  barValue: {
    width: 36,
    textAlign: 'right',
    fontWeight: '600',
    color: '#333',
  },
});


