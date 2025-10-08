import React from 'react';
import { View, StyleSheet, Dimensions, Pressable, Modal } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

interface Props {
  source: any;
  onClose: () => void;
}

const PostMediaModal: React.FC<Props> = ({ source, onClose }) => {
  const scale = useSharedValue(1);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = Math.max(0.5, Math.min(event.scale, 4));
    })
    .onEnd(() => {
      scale.value = withTiming(1, { duration: 300 });
    });

  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Modal transparent animationType="fade">
      <Pressable style={styles.backdrop} onPress={onClose}>
        <GestureDetector gesture={pinchGesture}>
          <Animated.Image
            source={source}
            style={[styles.image, imageStyle]}
            resizeMode="contain"
          />
        </GestureDetector>
      </Pressable>
    </Modal>
  );
};

export default PostMediaModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#000000ee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width * 0.95,
    height: height * 0.8,
    borderRadius: 15,
  },
});
