import React, { useRef, useCallback } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDecay,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface DirectedScrollViewProps {
  children: React.ReactNode;
  contentWidth?: number;
  contentHeight?: number;
  horizontal?: boolean;
  vertical?: boolean;
  bounces?: boolean;
  decelerationRate?: number;
  onScroll?: (x: number, y: number) => void;
}

export default function DirectedScrollView({
  children,
  contentWidth = SCREEN_WIDTH,
  contentHeight = SCREEN_HEIGHT,
  horizontal = true,
  vertical = true,
  bounces = true,
  decelerationRate = 0.985,
  onScroll,
}: DirectedScrollViewProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const contextX = useSharedValue(0);
  const contextY = useSharedValue(0);
  const isScrolling = useSharedValue(false);

  // Calculate bounds
  const minX = 0;
  const maxX = -Math.max(0, contentWidth - SCREEN_WIDTH);
  const minY = 0;
  const maxY = -Math.max(0, contentHeight - SCREEN_HEIGHT);

  const bounceConfig = {
    damping: 20,
    stiffness: 200,
    mass: 0.5,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  };

  const snapToPage = (x: number, velocity: number) => {
    'worklet';
    const pageWidth = SCREEN_WIDTH;
    const currentOffset = Math.abs(x);
    const currentPage = Math.floor(currentOffset / pageWidth);
    const progress = (currentOffset % pageWidth) / pageWidth;
    
    const VELOCITY_THRESHOLD = 500;
    const PAGE_THRESHOLD = 0.2; // 20% threshold

    let targetPage = currentPage;

    if (Math.abs(velocity) > VELOCITY_THRESHOLD) {
      // For high velocity, move in the direction of the velocity
      targetPage += Math.sign(velocity) < 0 ? 1 : 0;
    } else {
      // For low velocity, use the progress threshold
      if (progress > PAGE_THRESHOLD) {
        targetPage += 1;
      }
    }

    const targetX = -targetPage * pageWidth;
    const finalTargetX = Math.max(maxX, Math.min(minX, targetX));

    translateX.value = withSpring(finalTargetX, {
      velocity,
      damping: 50,
      stiffness: 300,
      mass: 0.5,
      overshootClamping: true,
    });
  };

  const pan = Gesture.Pan()
    .onStart(() => {
      contextX.value = translateX.value;
      contextY.value = translateY.value;
      isScrolling.value = true;
    })
    .onUpdate((event) => {
      let newX = contextX.value;
      let newY = contextY.value;

      if (horizontal) {
        newX = contextX.value + event.translationX;
        // Add resistance when dragging beyond bounds
        if (bounces) {
          if (newX > minX) {
            newX = minX + (newX - minX) * 0.2;
          } else if (newX < maxX) {
            newX = maxX + (newX - maxX) * 0.2;
          }
        } else {
          newX = Math.min(minX, Math.max(maxX, newX));
        }
        translateX.value = newX;
      }

      if (vertical) {
        newY = contextY.value + event.translationY;
        // Add resistance when dragging beyond bounds
        if (bounces) {
          if (newY > minY) {
            newY = minY + (newY - minY) * 0.2;
          } else if (newY < maxY) {
            newY = maxY + (newY - maxY) * 0.2;
          }
        } else {
          newY = Math.min(minY, Math.max(maxY, newY));
        }
        translateY.value = newY;
      }

      onScroll?.(newX, newY);
    })
    .onEnd((event) => {
      isScrolling.value = false;

      if (horizontal) {
        const velocityX = event.velocityX;
        if (bounces) {
          if (translateX.value > minX || translateX.value < maxX) {
            // Bounce back if out of bounds
            translateX.value = withSpring(
              Math.min(minX, Math.max(maxX, translateX.value)),
              bounceConfig
            );
          } else {
            // Snap to nearest page with updated thresholds
            snapToPage(translateX.value, velocityX);
          }
        } else {
          // Snap to nearest page within bounds
          snapToPage(translateX.value, velocityX);
        }
      }

      if (vertical) {
        const velocityY = event.velocityY;
        if (bounces) {
          if (translateY.value > minY || translateY.value < maxY) {
            // Bounce back if out of bounds
            translateY.value = withSpring(
              Math.min(minY, Math.max(maxY, translateY.value)),
              bounceConfig
            );
          } else if (Math.abs(velocityY) > 0) {
            // Apply decay animation if there's velocity
            translateY.value = withDecay({
              velocity: velocityY,
              clamp: [maxY, minY],
              deceleration: decelerationRate,
            });
          }
        } else {
          // Without bounce, just use decay within bounds
          translateY.value = withDecay({
            velocity: velocityY,
            clamp: [maxY, minY],
            deceleration: decelerationRate,
          });
        }
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={[styles.container, { overflow: 'hidden' }]}>
        <GestureDetector gesture={pan}>
          <Animated.View style={[styles.content, animatedStyle]}>
            {children}
          </Animated.View>
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});