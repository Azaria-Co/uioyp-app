// components/PostMedia.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { PinchGestureHandler, PinchGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

interface PostMediaProps {
  source: any;
}

export const PostMedia: React.FC<PostMediaProps> = ({ source }) => {
  const scale = useSharedValue(1);

  const pinchHandler = useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
    onActive: (event) => {
      scale.value = event.scale;
    },
    onEnd: () => {
      scale.value = withTiming(1);
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.mediaContainer}>
      <PinchGestureHandler onGestureEvent={pinchHandler}>
        <Animated.Image source={source} style={[styles.image, animatedStyle]} resizeMode="contain" />
      </PinchGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  mediaContainer: {
    maxHeight: 300,
    width: '100%',
    marginVertical: 10,
    overflow: 'hidden',
    borderRadius: 10,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
});
