// components/ProgresoCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

interface ProgresoCardProps {
  id: number;
  fecha: string;
  etapa: string;
  paciente?: {
    nombre_us: string;
  };
  onDelete?: (id: number) => void;
}

export default function ProgresoCard({ 
  id, 
  fecha, 
  etapa, 
  paciente,
  onDelete 
}: ProgresoCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getEtapaColor = (etapa: string) => {
    const colors: { [key: string]: string } = {
      'Semilla': '#8B4513', // Marrón para semilla
      'Una planta': '#228B22', // Verde para planta
      'Un pequeño árbol': '#32CD32', // Verde claro para árbol pequeño
      'Un árbol grande': '#006400' // Verde oscuro para árbol grande
    };
    return colors[etapa] || '#003087';
  };

  const getEtapaIcon = (etapa: string) => {
    const icons: { [key: string]: string } = {
      'Semilla': 'dotchart',
      'Una planta': 'star',
      'Un pequeño árbol': 'star',
      'Un árbol grande': 'star'
    };
    return icons[etapa] || 'dotchart';
  };

  const getEtapaDescription = (etapa: string) => {
    const descriptions: { [key: string]: string } = {
      'Semilla': 'Principiante, acabas de empezar tu proceso para recibir tu prótesis u órtesis.',
      'Una planta': 'Tienes tu primer avance en tu proceso, vas bien.',
      'Un pequeño árbol': 'Ya tienes tiempo mejorando, ya son de las últimas cosas que ocupas.',
      'Un árbol grande': '¡Ya estás graduado! Felicidades, terminaste tu tratamiento, ya incorporaste tu prótesis (u órtesis) a tu vida cotidiana.'
    };
    return descriptions[etapa] || '';
  };

  return (
    <View style={[styles.card, { borderLeftColor: getEtapaColor(etapa), borderLeftWidth: 4 }]}>
      <View style={styles.header}>
        <View style={styles.etapaContainer}>
          <AntDesign name={getEtapaIcon(etapa) as any} size={24} color={getEtapaColor(etapa)} />
          <Text style={[styles.etapa, { color: getEtapaColor(etapa) }]}>{etapa}</Text>
        </View>
        {onDelete && (
          <TouchableOpacity onPress={() => onDelete(id)} style={styles.deleteButton}>
            <AntDesign name="delete" size={20} color="crimson" />
          </TouchableOpacity>
        )}
      </View>
      
      <Text style={styles.description}>{getEtapaDescription(etapa)}</Text>
      <Text style={styles.date}>Actualizado: {formatDate(fecha)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginVertical: 8,
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  etapaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  etapa: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    marginBottom: 8,
    lineHeight: 20,
  },
  date: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
}); 