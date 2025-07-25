// components/HeaderUser.tsx
import React, { useEffect, useState } from 'react';
import { getNombreUs } from '../utils/auth';
import { View, Text, StyleSheet } from 'react-native';

interface HeaderUserProps {
  currentStage: number;
}

export default function HeaderUser({ currentStage }: HeaderUserProps) {
  const [nombreUs, setNombreUs] = useState<string | null>(null);
  const today = new Date().toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  useEffect(() => {
    getNombreUs().then(setNombreUs);
  }, []);

  return (
    <View style={styles.headerWrapper}>
      <View style={styles.leftSection}>
        <View style={styles.profileCircle} />
        <View style={styles.userInfo}>
          <Text style={styles.identifier}>{nombreUs ? nombreUs : 'Identificador#'}</Text>
          <Text style={styles.date}>{today}</Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <View style={styles.progressSteps}>
        <View style={styles.progressLine} />
          {[1, 2, 3, 4].map((step) => (
            <View
              key={step}
              style={[
                styles.circle,
                step <= currentStage && styles.circleActive,
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    flexDirection: 'row',
    backgroundColor: '#003087',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 20,
    paddingTop: 50,
    justifyContent: 'space-between',
  },
  leftSection: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  profileCircle: {
    width: 55,
    height: 55,
    backgroundColor: 'white',
    borderRadius: 27.5,
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: 'column',
  },
  identifier: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  date: {
    color: '#FFD700',
    fontSize: 12,
    marginTop: 3,
  },
  rightSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  progressLine: {
    position: 'absolute',
    top: 20,
    left: '10%',
    right: '10%',
    height: 4,
    backgroundColor: '#FFA500',
    borderRadius: 2,
    zIndex: 0,
  },
  progressSteps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    zIndex: 1,
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#ffffff55',
    borderWidth: 2,
    borderColor: 'white',
  },
  circleActive: {
    backgroundColor: 'white',
  },
});
