import { View, Text, StyleSheet } from 'react-native';
import type { Project } from '@/types/projects';
import moment from 'moment';
import Animated, { 
  useAnimatedStyle,
  interpolate,
  SharedValue,
} from 'react-native-reanimated';
import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ProjectItemProps {
  project: Project;
  currentMonth: moment.Moment;
  themeColors: any;
  scrollX: SharedValue<number>;
}

export default function ProjectItem({ 
  project, 
  currentMonth,
  themeColors,
  scrollX,
}: ProjectItemProps) {
  const startDate = moment(project.startDate);
  const endDate = moment(project.endDate);

  const animatedStyle = useAnimatedStyle(() => {
    // Only animate if the project is not fixed
    if (!project.isFixed) {
      return {
        transform: [{
          translateX: interpolate(
            scrollX.value,
            [0, SCREEN_WIDTH],
            [0, -SCREEN_WIDTH],
          ),
        }],
      };
    }
    // Fixed projects don't move
    return {};
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View 
        style={[
          styles.projectCard, 
          { 
            backgroundColor: project.isFixed ? themeColors.primary + '15' : themeColors.shade2,
            borderColor: themeColors.border,
          }
        ]}
      >
        <Text style={[styles.projectName, { color: themeColors.text }]}>
          {project.name}
        </Text>
        <Text style={[styles.projectDates, { color: themeColors.secondary }]}>
          {startDate.format('MMM D, YYYY')} - {endDate.format('MMM D, YYYY')}
        </Text>
        <Text style={[styles.projectType, { 
          color: project.isFixed ? themeColors.primary : themeColors.secondary 
        }]}>
          {project.isFixed ? 'Fixed Project' : 'Regular Project'}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  projectCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  projectName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  projectDates: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  projectType: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginTop: 4,
  },
});