// components/PostMedia.tsx
import React, { useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { PinchGestureHandler, PinchGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');

interface PostMediaProps {
  source: any;
}

export const PostMedia: React.FC<PostMediaProps> = ({ source }) => {
  const scale = useSharedValue(1);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const pinchHandler = useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
    onActive: (event) => {
      scale.value = Math.max(1, Math.min(event.scale, 3)); // Limitar zoom entre 1x y 3x
    },
    onEnd: () => {
      scale.value = withTiming(1, { duration: 300 });
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Calcular dimensiones responsivas
  const calculateImageDimensions = (imageWidth: number, imageHeight: number) => {
    const maxWidth = screenWidth - 40; // Margen de 20px a cada lado
    const maxHeight = 400; // Altura máxima razonable
    
    // Calcular ratio de aspecto
    const aspectRatio = imageWidth / imageHeight;
    
    let finalWidth = maxWidth;
    let finalHeight = finalWidth / aspectRatio;
    
    // Si la altura es muy grande, ajustar por altura
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
      <PinchGestureHandler onGestureEvent={pinchHandler}>
        <Animated.Image 
          source={source} 
          style={[
            styles.image, 
            animatedStyle,
            imageSize.width > 0 ? {
              width: imageSize.width,
              height: imageSize.height,
            } : styles.defaultImageSize
          ]} 
          resizeMode="cover"
          onLoad={handleImageLoad}
        />
      </PinchGestureHandler>
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
    width: screenWidth - 40,
    height: 250,
  },
});
