// screens/BlogScreen.tsx
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, ImageSourcePropType, Image, useWindowDimensions } from 'react-native';
import { PostCard } from '../components/PostCard';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import HeaderUser from '../components/HeaderUser';

const ModuleCard = ({
  title,
  color,
  icon,
  selected,
  onPress,
  cardWidth,
}: {
  title: string;
  color: string;
  icon: ImageSourcePropType;
  selected: boolean;
  onPress: () => void;
  cardWidth: number;
}) => (
  <TouchableOpacity
    style={[styles.card, { backgroundColor: selected ? color : `${color}22`, width: cardWidth }]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={[styles.cardIcon, { backgroundColor: color }]}>
      <Image source={icon} style={styles.iconImage} resizeMode="contain" />
    </View>
    <Text style={styles.cardText}>{title}</Text>
  </TouchableOpacity>
);

export default function BlogScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selected, setSelected] = useState<string>('');
  const { width } = useWindowDimensions();

  const filters = [
    { title: 'Medicina General', color: '#BFA47A', icon: require('../assets/icons/medicine.png') },
    { title: 'Neuropsicología', color: '#3D4D9D', icon: require('../assets/icons/neuro.png') },
    { title: 'Órtesis y Prótesis', color: '#E5C44A', icon: require('../assets/icons/orthotics.png') },
    { title: 'Nutrición', color: '#E89CC5', icon: require('../assets/icons/nutrition.png') },
    { title: 'Fisioterapia', color: '#83D0A0', icon: require('../assets/icons/physio.png') },
    { title: 'General', color: '#9D9D9D', icon: require('../assets/icons/admin.png') },
  ];
  const posts = [
    {
      author: 'Dr. Walls',
      title: 'Importancia de la postura',
      area: 'Fisioterapia',
      areaColor: '#83D0A0',
      description: 'Una guía práctica para mantener una postura saludable en tu día a día. "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."',
      date: '4 de julio de 2025',
      image: require('../assets/prosthetic.jpg'),
    },
    {
      author: 'Dr. Juan López',
      title: '¿Qué es una órtesis?',
      area: 'Órtesis y Prótesis',
      areaColor: '#E5C44A',
      description: 'Explicación sencilla sobre órtesis y su importancia en la rehabilitación.',

      date: '20 de junio de 2025',
      // No image
    },
  ];

  // Responsive: calcula el ancho de las tarjetas según el ancho de pantalla
  const cardWidth = width > 600 ? (width - 60) / 6 : (width - 50) / 3;

  return (
    <View style={styles.container}>
      {/* Componente de encabezado con barra de progreso */}
      <HeaderUser currentStage={1} />

      {/* Cuerpo del blog */}
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.row}>
          {filters.slice(0, 3).map((f) => (
            <ModuleCard
              key={f.title}
              title={f.title}
              color={f.color}
              icon={f.icon}
              selected={selected === f.title}
              onPress={() => setSelected(f.title)}
              cardWidth={cardWidth}
            />
          ))}
        </View>
        <View style={styles.row}>
          {filters.slice(3).map((f) => (
            <ModuleCard
              key={f.title}
              title={f.title}
              color={f.color}
              icon={f.icon}
              selected={selected === f.title}
              onPress={() => setSelected(f.title)}
              cardWidth={cardWidth}
            />
          ))}
        </View>

        {/* Publicaciones tipo Instagram */}
        {posts.map((post, index) => (
          <PostCard key={index} {...post} />
        ))}
      </ScrollView>

      {/* Botón cerrar sesión */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => navigation.replace('Login')}
      >
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  body: {
    paddingVertical: 30,
    paddingHorizontal: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  card: {
    // width se define dinámicamente
    aspectRatio: 1,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    minWidth: 90,
    maxWidth: 180,
  },
  cardIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
    fontWeight: '500',
  },
  iconImage: {
    width: 30,
    height: 30,
  },
  logoutButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#003087',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
