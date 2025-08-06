// components/PostMediaModal.tsx
import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  Modal,
} from 'react-native';
import { PinchGestureHandler, PinchGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withTiming,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface Props {
  source: any;
  onClose: () => void;
}

const PostMediaModal: React.FC<Props> = ({ source, onClose }) => {
  const scale = useSharedValue(1);

  const pinchHandler = useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
    onActive: (event) => {
      scale.value = Math.max(0.5, Math.min(event.scale, 4)); // Zoom entre 0.5x y 4x
    },
    onEnd: () => {
      scale.value = withTiming(1, { duration: 300 });
    },
  });

  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Modal transparent animationType="fade">
      <Pressable style={styles.backdrop} onPress={onClose}>
        <PinchGestureHandler onGestureEvent={pinchHandler}>
          <Animated.Image
            source={source}
            style={[styles.image, imageStyle]}
            resizeMode="contain"
          />
        </PinchGestureHandler>
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
