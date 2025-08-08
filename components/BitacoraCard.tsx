// components/BitacoraCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

interface BitacoraCardProps {
  id: number;
  fecha: string;
  presion_ar: string;
  glucosa: number;
  comidas?: string;
  medicamentos?: string;
  paciente?: {
    nombre_us: string;
  };
  onDelete?: (id: number) => void;
}

export default function BitacoraCard({ 
  id, 
  fecha, 
  presion_ar, 
  glucosa, 
  comidas,
  medicamentos,
  paciente,
  onDelete 
}: BitacoraCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const glucosaNum = typeof glucosa === 'string' ? parseFloat(glucosa) : glucosa;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.date}>{formatDate(fecha)}</Text>
        {onDelete && (
          <TouchableOpacity onPress={() => onDelete(id)} style={styles.deleteButton}>
            <AntDesign name="delete" size={20} color="crimson" />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.dataRow}>
        <View style={styles.dataItem}>
          <Text style={styles.label}>Presión Arterial</Text>
          <Text style={styles.value}>{presion_ar}</Text>
        </View>
        
        <View style={styles.dataItem}>
          <Text style={styles.label}>Glucosa</Text>
          <Text style={styles.value}>{glucosa} mg/dL</Text>
        </View>
      </View>
      {comidas ? (
        <View style={{marginTop: 8}}>
          <Text style={styles.label}>Comidas consumidas</Text>
          <Text style={styles.value}>{comidas}</Text>
        </View>
      ) : null}
      {medicamentos ? (
        <View style={{marginTop: 8}}>
          <Text style={styles.label}>Medicamentos consumidos</Text>
          <Text style={styles.value}>{medicamentos}</Text>
        </View>
      ) : null}
      
      {paciente && (
        <Text style={styles.patientName}>Paciente: {paciente.nombre_us}</Text>
      )}
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
  date: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#003087',
  },
  deleteButton: {
    padding: 5,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dataItem: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003087',
  },
  patientName: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
});