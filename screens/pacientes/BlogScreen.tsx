// screens/pacientes/BlogScreen.tsx
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, ImageSourcePropType, Image, useWindowDimensions, PixelRatio } from 'react-native';
import { PostCard } from '../../components/PostCard';
import { getPosts } from '../../api/posts';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/StackNavigator';
import HeaderUser from '../../components/HeaderUser';
import { useCurrentStage } from '../../utils/useCurrentStage';
import PatientBottomNav, { NAV_HEIGHT } from '../../components/PatientBottomNav';
import { AntDesign } from '@expo/vector-icons';


const ModuleCard = ({
  title,
  color,
  icon,
  selected,
  onPress,
  cardWidth,
  isA11y,
}: {
  title: string;
  color: string;
  icon: ImageSourcePropType;
  selected: boolean;
  onPress: () => void;
  cardWidth: number;
  isA11y: boolean;
}) => (
  <TouchableOpacity
    style={[
      styles.card,
      {
        backgroundColor: '#fff',
        borderColor: selected ? color : '#ccc',
        borderWidth: selected ? 2 : 1,
        width: cardWidth,
        minHeight: Math.max(90, Math.round(cardWidth * 0.9)),
      },
    ]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={[styles.cardIcon, { backgroundColor: color, width: isA11y ? 48 : 55, height: isA11y ? 48 : 55, borderRadius: isA11y ? 24 : 27.5 }]}> 
      <Image source={icon} style={[styles.iconImage, { width: isA11y ? 26 : 30, height: isA11y ? 26 : 30 }]} resizeMode="contain" />
    </View>
    <Text style={[styles.cardText, { color, fontSize: isA11y ? 12 : 13 }]} numberOfLines={isA11y ? 2 : 1} ellipsizeMode="tail" allowFontScaling>
      {title}
    </Text>
  </TouchableOpacity>
);

export default function BlogScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selected, setSelected] = useState<string>('');
  const { width } = useWindowDimensions();
  const { currentStage } = useCurrentStage();
  const fontScale = PixelRatio.getFontScale();
  const isA11y = fontScale > 1.15;

  const filters = [
    { title: 'Medicina General', color: '#BFA47A', icon: require('../../assets/icons/medicine.png') },
    { title: 'Neuropsicología', color: '#3D4D9D', icon: require('../../assets/icons/neuro.png') },
    { title: 'Órtesis y Prótesis', color: '#E5C44A', icon: require('../../assets/icons/orthotics.png') },
    { title: 'Nutrición', color: '#E89CC5', icon: require('../../assets/icons/nutrition.png') },
    { title: 'Fisioterapia', color: '#83D0A0', icon: require('../../assets/icons/physio.png') },
    { title: 'Investigación', color: '#6f42c1', icon: require('../../assets/icons/admin.png') },
    { title: 'General', color: '#9D9D9D', icon: require('../../assets/icons/admin.png') },
  ];
  const [allPosts, setAllPosts] = useState<any[]>([]); // Todos los posts
  const [posts, setPosts] = useState<any[]>([]); // Posts filtrados para mostrar
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPosts()
      .then((data) => {
        const postsData = Array.isArray(data) ? data : [];
        // Ordenar de más nuevo a más viejo por fecha
        const sortDesc = (arr: any[]) =>
          [...arr].sort((a, b) => {
            const aDate = new Date(a.fecha || a.date || 0).getTime();
            const bDate = new Date(b.fecha || b.date || 0).getTime();
            return bDate - aDate;
          });
        const sorted = sortDesc(postsData);
        setAllPosts(sorted);
        setPosts(sorted); // Inicialmente mostrar todos
      })
      .catch(() => {
        setAllPosts([]);
        setPosts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Filtrar posts cuando cambie la selección
  useEffect(() => {
    if (!selected || selected === '') {
      // Si no hay filtro seleccionado, mostrar todos
      setPosts(allPosts);
    } else {
      // Filtrar por área seleccionada
      const filtered = allPosts.filter(post => {
        const areaStr = String(post.area || (post.especialista && post.especialista.area) || '');
        
        // Manejar casos especiales de nombres
        if (selected === 'Órtesis y Prótesis' && areaStr === 'Ortesis y Protesis') return true;
        if (selected === 'Neuropsicología' && areaStr === 'Neuropsicologia') return true;
        if (selected === 'Nutrición' && areaStr === 'Nutricion') return true;
        if (selected === 'Investigación' && areaStr === 'Investigacion') return true;
        
        return areaStr === selected;
      });
      // Ordenar los filtrados de más nuevo a más viejo
      const sorted = [...filtered].sort((a, b) => {
        const aDate = new Date(a.fecha || a.date || 0).getTime();
        const bDate = new Date(b.fecha || b.date || 0).getTime();
        return bDate - aDate;
      });
      setPosts(sorted);
    }
  }, [selected, allPosts]);

  // Responsive: calcula el ancho de las tarjetas según el ancho de pantalla
  const cardWidth = width > 600 ? (width - 60) / 6 : (width - 50) / 3;

  return (
    <View style={styles.container}>
      {/* Componente de encabezado con barra de progreso */}
      <HeaderUser currentStage={currentStage} />

      {/* Cuerpo del blog */}
      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: 30 + NAV_HEIGHT }]}>
        <View style={styles.filtersContainer}>
          {filters.map((f) => (
            <ModuleCard
              key={f.title}
              title={f.title}
              color={f.color}
              icon={f.icon}
              selected={selected === f.title}
              onPress={() => setSelected(selected === f.title ? '' : f.title)}
              cardWidth={cardWidth}
              isA11y={isA11y}
            />
          ))}
        </View>

        {/* Indicador de filtros activos */}
        {selected && (
          <View style={styles.filterIndicator}>
            <Text style={styles.filterIndicatorText}>
              📌 Mostrando: {selected} ({posts.length} publicaciones)
            </Text>
            <TouchableOpacity onPress={() => setSelected('')} style={styles.clearFilterButton}>
              <Text style={styles.clearFilterText}>Mostrar todas</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Publicaciones tipo Instagram */}
        {loading ? (
          <Text style={{ textAlign: 'center', marginTop: 30 }}>Cargando publicaciones...</Text>
        ) : posts.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 30 }}>
            {selected ? `No hay publicaciones de ${selected}.` : 'No hay publicaciones.'}
          </Text>
        ) : (
          posts.map((post, index) => {
            const areaColors: Record<string, string> = {
              'Fisioterapia': '#83D0A0',
              'Ortesis y Protesis': '#E5C44A',
              'Neuropsicologia': '#3D4D9D',
              'Medicina General': '#BFA47A',
              'Nutricion': '#E89CC5',
              'Investigacion': '#6f42c1',
              'General': '#9D9D9D',
            };
            const areaStr = String(post.area || (post.especialista && post.especialista.area) || '');
            const author = post.autor || post.author || 'Especialista';
            return (
              <PostCard  
                key={post.id || index}
                id={post.id}
                title={post.titulo || post.title || ''}
                area={areaStr}
                areaColor={areaColors[areaStr] || '#003087'}
                description={post.texto || post.description || ''}
                date={post.fecha || post.date || ''} 
                image={post.image}
                likes={post.likes || 0}
                tipo={post.tipo || 'normal'} />
            );
          })
        )}
      </ScrollView>
      {/* Menú inferior reutilizable */}
      <PatientBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  body: {
    paddingVertical: 30,
    paddingHorizontal: 15,
  },
  filtersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10,
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
  filterIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    margin: 15,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#003087',
  },
  filterIndicatorText: {
    fontSize: 14,
    color: '#003087',
    fontWeight: '600',
  },
  clearFilterButton: {
    backgroundColor: '#003087',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  clearFilterText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});