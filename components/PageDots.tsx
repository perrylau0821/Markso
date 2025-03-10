import { View, Text, StyleSheet } from 'react-native';
import { useTheme, colors } from '@/providers/ThemeProvider';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface PageDotsProps {
  total: number;
  current: number;
  scrollY?: number;
}

export default function PageDots({ total, current, scrollY = 0 }: PageDotsProps) {
  const { theme } = useTheme();
  const themeColors = colors[theme];

  return (
    <View style={styles.container}>
      <View style={styles.dotsContainer}>
        {Array.from({ length: total }).map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: index === current 
                  ? themeColors.primary 
                  : `${themeColors.primary}40`,
                width: index === current ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>
      <Text style={[styles.scrollPosition, { color: themeColors.secondary }]}>
        Scroll Y: {Math.round(scrollY)}px
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingTop: 12,
    paddingBottom: 4,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    transform: [{ translateY: -8 }],
  },
  scrollPosition: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    opacity: 0.7,
  },
});