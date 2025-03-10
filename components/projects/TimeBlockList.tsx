import { View, StyleSheet, Dimensions, FlatList } from 'react-native';
import { useTime } from '@/providers/TimeProvider';
import { useState, useRef, useCallback, useEffect } from 'react';
import Animated, { 
  useSharedValue, 
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import moment from 'moment';
import TimeBlockView from './TimeBlockView';
import { projectsUtils } from '@/utils/projects';
import type { MonthData } from '@/types/projects';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TimeBlockListProps {
  themeColors: any;
  onMonthChange: (index: number) => void;
}

export default function TimeBlockList({ themeColors, onMonthChange }: TimeBlockListProps) {
  const { selectedFilter, currentFilter, referenceDate, setReferenceDate } = useTime();
  
  const [months, setMonths] = useState<MonthData[]>(() => 
    projectsUtils.generateInitialMonths(currentFilter, moment())
  );
  const [visibleDate, setVisibleDate] = useState(moment());
  
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useSharedValue(0);

  useEffect(() => {
    const newMonths = projectsUtils.generateInitialMonths(currentFilter, referenceDate);
    setMonths(newMonths);
    scrollX.value = 0;
  }, [selectedFilter, currentFilter]);

  const loadMoreMonths = useCallback((direction: 'start' | 'end') => {
    setMonths(currentMonths => {
      if (direction === 'start') {
        const firstDate = moment(currentMonths[0].date);
        const newMonths = [];
        for (let i = -1; i < 0; i++) {
          const date = firstDate.clone().add(i * currentFilter.months, 'months');
          newMonths.push(projectsUtils.generateMonthData(date, currentFilter));
        }
        return [...newMonths, ...currentMonths];
      } else {
        const lastDate = moment(currentMonths[currentMonths.length - 1].date);
        const newMonths = [];
        for (let i = 1; i < 2; i++) {
          const date = lastDate.clone().add(i * currentFilter.months, 'months');
          newMonths.push(projectsUtils.generateMonthData(date, currentFilter));
        }
        return [...currentMonths, ...newMonths];
      }
    });
  }, [currentFilter]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const visibleItem = viewableItems[0];
      const newVisibleDate = moment(visibleItem.item.date);
      setVisibleDate(newVisibleDate);
      setReferenceDate(newVisibleDate);
      onMonthChange(visibleItem.index);
    }
  }, [setReferenceDate, onMonthChange]);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);

  return (
    <Animated.FlatList
      ref={flatListRef}
      data={months}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      getItemLayout={(_, index) => ({
        length: SCREEN_WIDTH,
        offset: SCREEN_WIDTH * index,
        index,
      })}
      onEndReached={() => loadMoreMonths('end')}
      onStartReached={() => loadMoreMonths('start')}
      onEndReachedThreshold={0.5}
      onStartReachedThreshold={0.5}
      viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      maintainVisibleContentPosition={{
        minIndexForVisible: 0,
      }}
      renderItem={({ item }) => (
        <View style={styles.itemContainer}>
          <TimeBlockView
            item={item}
            themeColors={themeColors}
            scrollX={scrollX}
          />
        </View>
      )}
      keyExtractor={item => item.id}
      initialScrollIndex={0}
    />
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    width: SCREEN_WIDTH,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});