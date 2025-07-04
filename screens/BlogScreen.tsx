import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/StackNavigator";
import { ImageSourcePropType, Image } from "react-native";

export default function WelcomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const today = new Date().toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });


  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <View style={styles.profileCircle} />
        <View style={styles.headerInfo}>
          <Text style={styles.patientId}>Identificador#</Text>
          <Text style={styles.date}>{today}</Text>
        </View>
      </View>

      {/* Cuerpo con botones */}
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.row}>
          <ModuleCard
            title='Medicina General'
            color="#BFA47A"
            icon={require("../assets/icons/medicine.png")}
          />
          <ModuleCard
            title="Neuropsicología"
            color="#3D4D9D"
            icon={require("../assets/icons/neuro.png")}
          />
          <ModuleCard
            title="órtesis y Prótesis"
            color="#E5C44A"
            icon={require("../assets/icons/orthotics.png")}
          />
        </View>
        <View style={styles.row}>
          <ModuleCard
            title="Nutrición"
            color="#E89CC5"
            icon={require("../assets/icons/nutrition.png")}
          />
          <ModuleCard
            title="Fisioterapia"
            color="#83D0A0"
            icon={require("../assets/icons/physio.png")}
          />
          <ModuleCard
            title="General"
            color="#9D9D9D"
            icon={require("../assets/icons/admin.png")}
          />
        </View>
      </ScrollView>

      {/* Botón cerrar sesión */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => navigation.replace("Login")}
      >
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const ModuleCard = ({
  title,
  color,
  icon,
}: {
  title: string;
  color: string;
  icon: ImageSourcePropType;
}) => (
  <TouchableOpacity
    style={[styles.card, { backgroundColor: `${color}22` }]}
    onPress={() => console.log(`Clicked on ${title}`)}
    activeOpacity={0.7}
  >
    <View style={[styles.cardIcon, { backgroundColor: color }]}>
      <Image source={icon} style={styles.iconImage} resizeMode="contain" />
    </View>
    <Text style={styles.cardText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  // Encabezado
  header: {
    backgroundColor: "#003087",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileCircle: {
    width: 50,
    height: 50,
    backgroundColor: "white",
    borderRadius: 25,
    marginRight: 15,
  },
  headerInfo: {
    flexDirection: "column",
  },
  patientId: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  date: {
    color: "#FFD700",
    fontSize: 12,
  },

  // Cuerpo
  body: {
    paddingVertical: 30,
    paddingHorizontal: 15,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    width: "100%",
  },
  card: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  cardIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 12,
    textAlign: "center",
    color: "#333",
    fontWeight: "500",
  },
  iconImage: {
    width: 30,
    height: 30,
  },

  // Cerrar sesión
  logoutButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#003087",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
  },
});
