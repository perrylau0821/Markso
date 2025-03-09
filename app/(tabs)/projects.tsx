import { View, Text, StyleSheet, Platform, Dimensions, FlatList, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useTheme, colors } from '@/providers/ThemeProvider';
import { useTime, TIME_FILTERS } from '@/providers/TimeProvider';
import { useState, useRef, useCallback, useEffect } from 'react';
import Animated from 'react-native-reanimated';
import moment from 'moment';
import { Calendar, ChevronDown } from 'lucide-react-native';
import PageDots from '@/components/PageDots';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function MetricItem({ 
  title, 
  value,
  themeColors,
}: { 
  title: string;
  value: string;
  themeColors: any;
}) {
  return (
    <View style={styles.metricItem}>
      <Text style={[styles.metricTitle, { color: themeColors.secondary }]} numberOfLines={1}>
        {title}
      </Text>
      <Text style={[styles.metricValue, { color: themeColors.text }]}>
        {value}
      </Text>
    </View>
  );
}

function generateMonthData(date: moment.Moment, filter: typeof TIME_FILTERS[number]) {
  const alignedDate = filter.getStartDate(date.clone());
  return {
    id: alignedDate.format('YYYY-MM'),
    month: alignedDate.month(),
    year: alignedDate.year(),
    label: filter.formatLabel(alignedDate),
    date: alignedDate.toDate(),
  };
}

function generateInitialMonths(filter: typeof TIME_FILTERS[number], date: moment.Moment) {
  const months = [];
  const alignedDate = filter.getStartDate(date.clone());
  
  const monthDate = alignedDate.clone();
  months.push(generateMonthData(monthDate, filter));
  
  return months;
}

function TimeFilterSelect({ themeColors }: { themeColors: any }) {
  const { selectedFilter, setSelectedFilter } = useTime();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentFilter = TIME_FILTERS.find(f => f.id === selectedFilter)!;

  return (
    <>
      <TouchableOpacity
        style={[styles.filterSelect, { 
          backgroundColor: themeColors.card,
          borderColor: themeColors.border,
        }]}
        onPress={() => setIsOpen(true)}
      >
        <Calendar size={20} color={themeColors.primary} style={styles.filterIcon} />
        <Text style={[styles.filterSelectText, { color: themeColors.text }]}>
          {currentFilter.label}
        </Text>
        <ChevronDown size={20} color={themeColors.secondary} />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setIsOpen(false)}
        >
          <View style={[styles.modalContent, { 
            backgroundColor: themeColors.card,
            borderColor: themeColors.border,
          }]}>
            {TIME_FILTERS.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[styles.filterOption, { 
                  backgroundColor: selectedFilter === filter.id 
                    ? `${themeColors.primary}15`
                    : 'transparent'
                }]}
                onPress={() => {
                  setSelectedFilter(filter.id);
                  setIsOpen(false);
                }}
              >
                <Calendar 
                  size={20} 
                  color={themeColors.primary}
                  style={styles.filterIcon} 
                />
                <Text style={[styles.filterOptionText, { 
                  color: themeColors.text,
                  fontFamily: selectedFilter === filter.id 
                    ? 'Inter-Medium' 
                    : 'Inter-Regular'
                }]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

function MonthCard({ 
  item,
  themeColors,
}: { 
  item: ReturnType<typeof generateMonthData>;
  themeColors: any;
}) {
  return (
    <Animated.View 
      style={[
        styles.card,
        { 
          backgroundColor: themeColors.card,
          borderColor: themeColors.border,
        }
      ]}
    >
      <Text style={[styles.monthLabel, { 
        color: themeColors.text,
        fontFamily: 'Inter-Regular'
      }]}>
        {item.label}
      </Text>

      <View style={styles.content}>
        <Text style={[styles.placeholder, { color: themeColors.secondary }]}>
          No projects scheduled
        </Text>
      </View>
    </Animated.View>
  );
}

export default function ProjectsScreen() {
  const { theme } = useTheme();
  const themeColors = colors[theme];
  const { selectedFilter, currentFilter, referenceDate, setReferenceDate } = useTime();
  
  const [months, setMonths] = useState(() => generateInitialMonths(currentFilter, moment()));
  const [visibleDate, setVisibleDate] = useState(moment());
  const [currentIndex, setCurrentIndex] = useState(0); // Start at first index since we only have one
  const flatListRef = useRef<FlatList>(null);
  const initialScrollDone = useRef(false);

  useEffect(() => {
    const newMonths = generateInitialMonths(currentFilter, referenceDate);
    setMonths(newMonths);
    setCurrentIndex(0); // Reset to first index when filter changes
  }, [selectedFilter, currentFilter]);

  const loadMoreMonths = useCallback((direction: 'start' | 'end') => {
    setMonths(currentMonths => {
      if (direction === 'start') {
        const firstDate = moment(currentMonths[0].date);
        const newMonths = [];
        for (let i = -1; i < 0; i++) {
          const date = firstDate.clone().add(i * currentFilter.months, 'months');
          newMonths.push(generateMonthData(date, currentFilter));
        }
        setCurrentIndex(prev => prev + newMonths.length); // Adjust index when adding to start
        return [...newMonths, ...currentMonths];
      } else {
        const lastDate = moment(currentMonths[currentMonths.length - 1].date);
        const newMonths = [];
        for (let i = 1; i < 2; i++) {
          const date = lastDate.clone().add(i * currentFilter.months, 'months');
          newMonths.push(generateMonthData(date, currentFilter));
        }
        return [...currentMonths, ...newMonths];
      }
    });
  }, [currentFilter]);

  const onEndReached = () => {
    loadMoreMonths('end');
  };

  const onStartReached = () => {
    loadMoreMonths('start');
  };

  const getItemLayout = (_: any, index: number) => ({
    length: SCREEN_WIDTH,
    offset: SCREEN_WIDTH * index,
    index,
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

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={[styles.header, { backgroundColor: themeColors.card }]}>
        <Text style={[styles.title, { color: themeColors.text }]}>
          {currentFilter.formatLabel(visibleDate)}
        </Text>
        
        <TimeFilterSelect themeColors={themeColors} />

        <PageDots total={months.length} current={currentIndex} />

        <View style={[styles.metricsContainer, { 
          backgroundColor: themeColors.card,
          borderColor: themeColors.border,
        }]}>
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
      </View>

      <FlatList
        ref={flatListRef}
        data={months}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        getItemLayout={getItemLayout}
        onEndReached={onEndReached}
        onStartReached={onStartReached}
        onStartReachedThreshold={0.5}
        onEndReachedThreshold={0.5}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <MonthCard
              item={item}
              themeColors={themeColors}
            />
          </View>
        )}
        keyExtractor={item => item.id}
        initialScrollIndex={0} // Start at first index since we only have one
      />
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
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  metricsContainer: {
    marginTop: 16,
    padding: 12,
    borderWidth: 1,
    gap: 12,
  },
  netIncomeContainer: {
    gap: 2,
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
  metricItem: {
    flex: 1,
    gap: 2,
  },
  metricTitle: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
  },
  metricValue: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
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
  filterSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  filterSelectText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  filterOptionText: {
    fontSize: 16,
    marginLeft: 12,
  },
  filterIcon: {
    marginRight: 4,
  },
});