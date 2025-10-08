//screens/especialistas/PostsAnalyticsScreen.tsx
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
  const contentMax = Math.min(820, width - 32);
  const barSpace = Math.max(120, Math.round(contentMax * 0.5));
  const px = max > 0 ? Math.max(6, Math.round((value / Math.max(1, max)) * barSpace)) : 6;
  return (
    <View style={styles.barRow}>
      <Text style={styles.barLabel} numberOfLines={2}>
        {label}
      </Text>
      <View style={[styles.bar, { width: px, backgroundColor: color }]} />
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
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <AntDesign name="arrow-left" size={24} color="#003087" />
        <Text style={styles.backButtonText}>Regresar</Text>
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
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#003087',
    marginBottom: 8,
  },
  backButtonText: {
    color: '#003087',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#003087',
    marginBottom: 10,
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
    alignSelf: 'center',
  },
  panel: {
    backgroundColor: '#f8f9fa',
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    width: '100%',
    maxWidth: 820,
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
    flex: 1,
    paddingHorizontal: 8,
  },
  barLabel: {
    flex: 1,
    fontSize: 13,
    color: '#333',
    paddingRight: 8,
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