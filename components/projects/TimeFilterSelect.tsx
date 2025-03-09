import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTime, TIME_FILTERS } from '@/providers/TimeProvider';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useEffect, useCallback, useMemo } from 'react';

interface TimeFilterSelectProps {
  themeColors: any;
}

export default function TimeFilterSelect({ themeColors }: TimeFilterSelectProps) {
  const { selectedFilter, setSelectedFilter } = useTime();
  const indicatorPosition = useSharedValue(0);

  // Calculate tab width based on number of filters
  const tabWidth = useMemo(() => {
    return 100 / TIME_FILTERS.length;
  }, []);

  const updateIndicator = useCallback((index: number) => {
    indicatorPosition.value = withTiming(index * 100, {
      duration: 300,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
  }, []);

  useEffect(() => {
    const index = TIME_FILTERS.findIndex(f => f.id === selectedFilter);
    if (index !== -1) {
      updateIndicator(index);
    }
  }, [selectedFilter, updateIndicator]);

  const indicatorStyle = useAnimatedStyle(() => ({
    width: `${tabWidth}%`,
    transform: [{ translateX: `${indicatorPosition.value}%` }],
  }));

  return (
    <View style={styles.container}>
      <View style={[styles.tabBar, { backgroundColor: themeColors.shade2 }]}>
        {TIME_FILTERS.map((filter, index) => (
          <Pressable
            key={filter.id}
            style={[styles.tab, { width: `${tabWidth}%` }]}
            onPress={() => {
              setSelectedFilter(filter.id);
              updateIndicator(index);
            }}
          >
            <Text 
              style={[
                styles.tabText,
                { 
                  color: selectedFilter === filter.id 
                    ? themeColors.primary 
                    : themeColors.secondary,
                  fontFamily: selectedFilter === filter.id 
                    ? 'Inter-Medium' 
                    : 'Inter-Regular',
                }
              ]}
              numberOfLines={1}
            >
              {filter.label}
            </Text>
          </Pressable>
        ))}
        <Animated.View 
          style={[
            styles.indicator,
            { backgroundColor: themeColors.primary },
            indicatorStyle,
          ]} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 8,
    position: 'relative',
    height: 40,
    width: '100%',
  },
  indicator: {
    position: 'absolute',
    height: 2,
    bottom: 0,
    left: 0,
  },
  tab: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
  },
});