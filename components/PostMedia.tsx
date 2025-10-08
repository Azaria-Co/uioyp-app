import React, { useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const { width: screenWidth } = Dimensions.get('window');

interface PostMediaProps {
  source: any;
  maxWidth?: number;
}

export const PostMedia: React.FC<PostMediaProps> = ({ source, maxWidth }) => {
  const scale = useSharedValue(1);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = Math.max(1, Math.min(event.scale, 3));
    })
    .onEnd(() => {
      scale.value = withTiming(1, { duration: 300 });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const calculateImageDimensions = (imageWidth: number, imageHeight: number) => {
    const targetMaxWidth = typeof maxWidth === 'number' ? maxWidth : Math.min(screenWidth - 40, 500);
    const maxHeight = 400;
    const aspectRatio = imageWidth / imageHeight;

    let finalWidth = targetMaxWidth;
    let finalHeight = finalWidth / aspectRatio;

    if (finalHeight > maxHeight) {
      finalHeight = maxHeight;
      finalWidth = finalHeight * aspectRatio;
    }

    return { width: finalWidth, height: finalHeight };
  };

  const handleImageLoad = (event: any) => {
    const { width, height } = event.nativeEvent.source;
    const dimensions = calculateImageDimensions(width, height);
    setImageSize(dimensions);
  };

  return (
    <View style={styles.mediaContainer}>
      <GestureDetector gesture={pinchGesture}>
        <Animated.Image
          source={source}
          style={[
            styles.image,
            animatedStyle,
            imageSize.width > 0
              ? { width: imageSize.width, height: imageSize.height }
              : typeof maxWidth === 'number'
              ? { width: maxWidth, height: Math.min(300, (maxWidth * 3) / 4) }
              : styles.defaultImageSize,
          ]}
          resizeMode="contain"
          onLoad={handleImageLoad}
        />
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  mediaContainer: {
    width: '100%',
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    borderRadius: 12,
  },
  defaultImageSize: {
    width: Math.min(screenWidth - 40, 500),
    height: 250,
  },
});
