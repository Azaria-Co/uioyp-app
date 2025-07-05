import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  content: string;
  image?: any;
  video?: any;
};

export const PostModal = ({ visible, onClose, title, content, image }: Props) => (
  <Modal visible={visible} animationType="slide" transparent>
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <Text style={styles.title}>{title}</Text>
        {image && <Image source={image} style={styles.image} resizeMode="contain" />}
        {/* Aquí podrías agregar un componente de video */}
        <Text style={styles.content}>{content}</Text>
        <TouchableOpacity style={styles.likeButton}>
          <Text style={styles.likeText}>❤️ Me gusta</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: '#000000aa', justifyContent: 'center' },
  modal: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    maxHeight: '80%',
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  content: { marginTop: 10, fontSize: 14, color: '#333' },
  image: { width: '100%', height: 200, borderRadius: 10 },
  closeButton: {
    marginTop: 20,
    alignSelf: 'flex-end',
    backgroundColor: '#003087',
    padding: 10,
    borderRadius: 8,
  },
  closeText: { color: 'white' },
  likeButton: {
    marginTop: 15,
    backgroundColor: '#ffd70022',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  likeText: {
    fontWeight: 'bold',
    color: '#d10000',
  },
});
