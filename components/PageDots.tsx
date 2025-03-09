import { View, StyleSheet } from 'react-native';
import { useTheme, colors } from '@/providers/ThemeProvider';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface PageDotsProps {
  total: number;
  current: number;
}

export default function PageDots({ total, current }: PageDotsProps) {
  const { theme } = useTheme();
  const themeColors = colors[theme];

  return (
    <View style={styles.container}>
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
  );
}

const styles = StyleSheet.create({
  container: {
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
});