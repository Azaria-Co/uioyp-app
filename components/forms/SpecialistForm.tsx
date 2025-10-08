import React from 'react';
import { View, StyleSheet } from 'react-native';
import AreaPicker from './AreaPicker';

interface SpecialistFormProps {
  area: string;
  setArea: (v: string) => void;
}

export default function SpecialistForm({ area, setArea }: SpecialistFormProps) {
  return (
    <View style={styles.formSection}>
      <AreaPicker area={area} setArea={setArea} />
    </View>
  );
}

const styles = StyleSheet.create({
  formSection: { marginBottom: 20 },
});
