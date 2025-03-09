import { View, Text, StyleSheet, Platform, Dimensions, FlatList } from 'react-native';
import { useTheme, colors } from '@/providers/ThemeProvider';
import { useTime } from '@/providers/TimeProvider';
import { useState, useRef, useCallback, useEffect } from 'react';
import Animated, { 
  useSharedValue, 
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import moment from 'moment';
import PageDots from '@/components/PageDots';
import MetricItem from '@/components/projects/MetricItem';
import TimeFilterSelect from '@/components/projects/TimeFilterSelect';
import MonthCard from '@/components/projects/MonthCard';
import ProjectPortal from '@/components/projects/ProjectPortal';
import { projectsUtils } from '@/utils/projects';
import type { MonthData } from '@/types/projects';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProjectsScreen() {
  const { theme } = useTheme();
  const themeColors = colors[theme];
  const { selectedFilter, currentFilter, referenceDate, setReferenceDate } = useTime();
  
  const [months, setMonths] = useState<MonthData[]>(() => 
    projectsUtils.generateInitialMonths(currentFilter, moment())
  );
  const [visibleDate, setVisibleDate] = useState(moment());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fixedProjectLayout, setFixedProjectLayout] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
    pageX: number;
    pageY: number;
  } | null>(null);
  
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useSharedValue(0);
  const isScrolling = useSharedValue(1);

  useEffect(() => {
    const newMonths = projectsUtils.generateInitialMonths(currentFilter, referenceDate);
    setMonths(newMonths);
    setCurrentIndex(0);
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
        setCurrentIndex(prev => prev + newMonths.length);
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
    onBeginDrag: () => {
      isScrolling.value = 0;
    },
    onEndDrag: () => {
      isScrolling.value = 1;
    },
    onMomentumBegin: () => {
      isScrolling.value = 0;
    },
    onMomentumEnd: () => {
      isScrolling.value = 1;
    },
  });

  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const visibleItem = viewableItems[0];
      const newVisibleDate = moment(visibleItem.item.date);
      setVisibleDate(newVisibleDate);
      setReferenceDate(newVisibleDate);
      setCurrentIndex(visibleItem.index);
    }
  }, [setReferenceDate]);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);

  const handleFixedProjectLayout = useCallback((layout: {
    x: number;
    y: number;
    width: number;
    height: number;
    pageX: number;
    pageY: number;
  }) => {
    setFixedProjectLayout(layout);
  }, []);

  const fixedProject = months[0]?.projects.find(p => p.isFixed);

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={[styles.header, { backgroundColor: themeColors.card }]}>
        <Text style={[styles.title, { color: themeColors.text }]}>
          {currentFilter.formatLabel(visibleDate)}
        </Text>
        
        <TimeFilterSelect themeColors={themeColors} />

        <View style={[styles.metricsContainer, { backgroundColor: themeColors.card }]}>
          <View style={styles.netIncomeContainer}>
            <Text style={[styles.netIncomeTitle, { color: themeColors.secondary }]}>
              Total Net Income
            </Text>
            <Text style={[styles.netIncomeValue, { color: themeColors.text }]}>
              $128,450
            </Text>
          </View>
          
          <View style={styles.metricsRow}>
            <MetricItem
              title="Total Income"
              value="$245,890"
              themeColors={themeColors}
            />
            <MetricItem
              title="Total Expense"
              value="$117,440"
              themeColors={themeColors}
            />
            <MetricItem
              title="Receivables"
              value="$52,680"
              themeColors={themeColors}
            />
            <MetricItem
              title="Payables"
              value="$34,210"
              themeColors={themeColors}
            />
          </View>
        </View>

        <PageDots total={months.length} current={currentIndex} />
      </View>

      <View style={styles.contentContainer}>
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
              <MonthCard
                item={item}
                themeColors={themeColors}
                scrollX={scrollX}
                isScrolling={isScrolling}
                onFixedProjectLayout={handleFixedProjectLayout}
              />
            </View>
          )}
          keyExtractor={item => item.id}
          initialScrollIndex={0}
        />

        {fixedProject && fixedProjectLayout && (
          <ProjectPortal
            project={fixedProject}
            isScrolling={isScrolling}
            themeColors={themeColors}
            layout={fixedProjectLayout}
            scrollX={scrollX}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  metricsContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 16,
  },
  netIncomeContainer: {
    gap: 4,
  },
  netIncomeTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  netIncomeValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  itemContainer: {
    width: SCREEN_WIDTH,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});