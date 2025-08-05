// screens/pacientes/BlogScreen.tsx
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, ImageSourcePropType, Image, useWindowDimensions } from 'react-native';
import { PostCard } from '../../components/PostCard';
import { getPosts } from '../../api/posts';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/StackNavigator';
import HeaderUser from '../../components/HeaderUser';
import LogoutButton from '../../components/LogoutButton';
import { AntDesign } from '@expo/vector-icons';


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
    style={[
      styles.card,
      {
        backgroundColor: '#fff',
        borderColor: selected ? color : '#ccc',
        borderWidth: selected ? 2 : 1,
        width: cardWidth,
      },
    ]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={[styles.cardIcon, { backgroundColor: color }]}> 
      <Image source={icon} style={styles.iconImage} resizeMode="contain" />
    </View>
    <Text style={[styles.cardText, { color }]}>{title}</Text>
  </TouchableOpacity>
);

export default function BlogScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selected, setSelected] = useState<string>('');
  const { width } = useWindowDimensions();

  const filters = [
    { title: 'Medicina General', color: '#BFA47A', icon: require('../../assets/icons/medicine.png') },
    { title: 'Neuropsicología', color: '#3D4D9D', icon: require('../../assets/icons/neuro.png') },
    { title: 'Órtesis y Prótesis', color: '#E5C44A', icon: require('../../assets/icons/orthotics.png') },
    { title: 'Nutrición', color: '#E89CC5', icon: require('../../assets/icons/nutrition.png') },
    { title: 'Fisioterapia', color: '#83D0A0', icon: require('../../assets/icons/physio.png') },
    { title: 'General', color: '#9D9D9D', icon: require('../../assets/icons/admin.png') },
  ];
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPosts()
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

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
        {loading ? (
          <Text style={{ textAlign: 'center', marginTop: 30 }}>Cargando publicaciones...</Text>
        ) : posts.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 30 }}>No hay publicaciones.</Text>
        ) : (
          posts.map((post, index) => {
            const areaColors: Record<string, string> = {
              'Fisioterapia': '#83D0A0',
              'Ortesis y Protesis': '#E5C44A',
              'Neuropsicologia': '#3D4D9D',
              'Medicina General': '#BFA47A',
              'Nutricion': '#E89CC5',
              'General': '#9D9D9D',
            };
            const areaStr = String(post.area || (post.especialista && post.especialista.area) || '');
            const author = post.especialista && post.especialista.nombre_us ? post.especialista.nombre_us : (post.autor || post.author || 'Especialista');
            return (
              <PostCard  
                key={post.id || index}
                id={post.id}
                author={author}
                title={post.titulo || post.title || ''}
                area={areaStr}
                areaColor={areaColors[areaStr] || '#003087'}
                description={post.texto || post.description || ''}
                date={post.fecha || post.date || ''} 
                likes={post.likes || 0} />
            );
          })
        )}
      </ScrollView>
      {/* Botón de bitácora */}
      <TouchableOpacity 
        style={styles.bitacoraButton}
        onPress={() => navigation.navigate('Bitacora')}
      >
        <AntDesign name="book" size={20} color="white" />
        <Text style={styles.bitacoraButtonText}>Mi Bitácora</Text>
      </TouchableOpacity>

      {/* Botón de progreso */}
      <TouchableOpacity 
        style={styles.progresoButton}
        onPress={() => navigation.navigate('Progreso')}
      >
        <AntDesign name="star" size={20} color="white" />
        <Text style={styles.progresoButtonText}>Mi Progreso</Text>
      </TouchableOpacity>

      {/* Botón cerrar sesión */}
      <LogoutButton />
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
    aspectRatio: 1,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    minWidth: 90,
    maxWidth: 180,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  cardIcon: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '600',
  },
  iconImage: {
    width: 30,
    height: 30,
  },

  bitacoraButton: {
    position: 'absolute',
    bottom: 80, // Posicionado arriba del LogoutButton
    alignSelf: 'center',
    backgroundColor: '#003087',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  bitacoraButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  progresoButton: {
    position: 'absolute',
    bottom: 140, // Posicionado arriba del botón de bitácora
    alignSelf: 'center',
    backgroundColor: '#003087',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  progresoButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
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
