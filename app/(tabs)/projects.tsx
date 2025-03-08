import { View, Text, StyleSheet, Platform, Dimensions, FlatList } from 'react-native';
import { useTheme, colors } from '@/providers/ThemeProvider';
import { useState, useRef, useCallback } from 'react';
import Animated from 'react-native-reanimated';
import moment from 'moment';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function generateMonthData(date: moment.Moment) {
  return {
    id: date.format('YYYY-MM'),
    month: date.month(),
    year: date.year(),
    label: date.format('MMMM YYYY'),
    date: date.toDate(),
  };
}

function generateInitialMonths() {
  const now = moment();
  const months = [];
  
  // Generate months before current
  for (let i = -24; i <= 24; i++) {
    months.push(generateMonthData(moment().add(i, 'months')));
  }
  
  return months;
}

function MonthCard({ 
  item, 
  isCurrentMonth, 
  themeColors,
}: { 
  item: ReturnType<typeof generateMonthData>;
  isCurrentMonth: boolean;
  themeColors: any;
}) {
  return (
    <Animated.View 
      style={[
        styles.card,
        { 
          backgroundColor: themeColors.card,
          borderColor: isCurrentMonth ? themeColors.primary : themeColors.border,
        }
      ]}
    >
      <Text style={[styles.monthLabel, { 
        color: isCurrentMonth ? themeColors.primary : themeColors.text,
        fontFamily: isCurrentMonth ? 'Inter-Bold' : 'Inter-Regular'
      }]}>
        {item.label}
      </Text>

      <View style={styles.content}>
        <Text style={[styles.placeholder, { color: themeColors.secondary }]}>
          No projects scheduled
        </Text>
      </View>

      {isCurrentMonth && (
        <View style={[styles.badge, { backgroundColor: themeColors.primary }]}>
          <Text style={styles.badgeText}>Current</Text>
        </View>
      )}
    </Animated.View>
  );
}

export default function ProjectsScreen() {
  const { theme } = useTheme();
  const themeColors = colors[theme];
  const [months, setMonths] = useState(generateInitialMonths);
  const flatListRef = useRef<FlatList>(null);

  const loadMoreMonths = useCallback((direction: 'start' | 'end') => {
    setMonths(currentMonths => {
      if (direction === 'start') {
        const firstDate = moment(currentMonths[0].date).subtract(12, 'months');
        const newMonths = Array.from({ length: 12 }, (_, i) => 
          generateMonthData(moment(firstDate).add(i, 'months'))
        );
        return [...newMonths, ...currentMonths];
      } else {
        const lastDate = moment(currentMonths[currentMonths.length - 1].date);
        const newMonths = Array.from({ length: 12 }, (_, i) => 
          generateMonthData(moment(lastDate).add(i + 1, 'months'))
        );
        return [...currentMonths, ...newMonths];
      }
    });
  }, []);

  const onEndReached = () => {
    loadMoreMonths('end');
  };

  const onStartReached = () => {
    loadMoreMonths('start');
    // Maintain scroll position when adding items to the start
    flatListRef.current?.scrollToIndex({
      index: 12,
      animated: false,
    });
  };

  const getItemLayout = (_: any, index: number) => ({
    length: SCREEN_WIDTH,
    offset: SCREEN_WIDTH * index,
    index,
  });

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <FlatList
        ref={flatListRef}
        data={months}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={24}
        getItemLayout={getItemLayout}
        onEndReached={onEndReached}
        onStartReached={onStartReached}
        onEndReachedThreshold={0.5}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
        renderItem={({ item }) => {
          const now = moment();
          const isCurrentMonth = 
            item.month === now.month() && 
            item.year === now.year();

          return (
            <View style={styles.itemContainer}>
              <MonthCard
                item={item}
                isCurrentMonth={isCurrentMonth}
                themeColors={themeColors}
              />
            </View>
          );
        }}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    width: SCREEN_WIDTH,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: SCREEN_WIDTH,
    height: '100%',
    borderWidth: 1,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
      }
    }),
  },
  monthLabel: {
    fontSize: 28,
    textAlign: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    opacity: 0.7,
  },
  badge: {
    position: 'absolute',
    top: 20,
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
});