import { View, Text, StyleSheet, Dimensions } from 'react-native';
import type { Project } from '@/types/projects';
import moment from 'moment';
import Animated, { 
  useAnimatedStyle,
  SharedValue,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CrossMonthProjectProps {
  project: Project;
  currentMonth: moment.Moment;
  themeColors: any;
  scrollX: SharedValue<number>;
  isScrolling: SharedValue<number>;
}

export default function CrossMonthProject({ 
  project, 
  currentMonth, 
  themeColors,
  scrollX,
  isScrolling,
}: CrossMonthProjectProps) {
  const startDate = moment(project.startDate);
  const endDate = moment(project.endDate);
  const monthStart = currentMonth.clone().startOf('month');
  const monthEnd = currentMonth.clone().endOf('month');

  // Calculate the project's position and width based on its date range
  const projectStartOffset = startDate.isBefore(monthStart) ? 0 : 
    startDate.diff(monthStart, 'days');
  const projectEndOffset = endDate.isAfter(monthEnd) ? 
    monthEnd.diff(monthStart, 'days') : 
    endDate.diff(monthStart, 'days');

  const daysInMonth = monthEnd.diff(monthStart, 'days') + 1;
  const dayWidth = SCREEN_WIDTH / daysInMonth;

  const left = projectStartOffset * dayWidth;
  const width = (projectEndOffset - projectStartOffset + 1) * dayWidth;

  const animatedStyle = useAnimatedStyle(() => {
    // Simple opacity animation driven directly by isScrolling
    return {
      opacity: project.isFixed ? isScrolling.value : 1,
    };
  });

  return (
    <View style={[styles.container, { left }]}>
      <Animated.View style={[styles.projectWrapper, animatedStyle]}>
        <View 
          style={[
            styles.projectCard, 
            { 
              width,
              backgroundColor: themeColors.shade2,
              borderColor: themeColors.border,
            }
          ]}
        >
          <Text style={[styles.projectName, { color: themeColors.text }]} numberOfLines={1}>
            {project.name}
          </Text>
          <Text style={[styles.projectDates, { color: themeColors.secondary }]}>
            {startDate.format('MMM D')} - {endDate.format('MMM D, YYYY')}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: 80,
    overflow: 'hidden',
  },
  projectWrapper: {
    position: 'absolute',
    height: '100%',
  },
  projectCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    height: '100%',
    justifyContent: 'center',
  },
  projectName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  projectDates: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
});