import { View, Text, StyleSheet } from 'react-native';
import type { Project } from '@/types/projects';
import moment from 'moment';
import Animated, { 
  useAnimatedStyle,
  interpolate,
  SharedValue,
  withSpring,
  useDerivedValue,
} from 'react-native-reanimated';
import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ProjectItemProps {
  project: Project;
  currentMonth: moment.Moment;
  themeColors: any;
  scrollX: SharedValue<number>;
  isScrolling: SharedValue<number>;
}

export default function ProjectItem({ 
  project, 
  currentMonth,
  themeColors,
  scrollX,
  isScrolling,
}: ProjectItemProps) {
  const startDate = moment(project.startDate);
  const endDate = moment(project.endDate);

  // Derive opacity based on scroll position and scrolling state
  const opacity = useDerivedValue(() => {
    if (!project.isFixed) return 1;

    return isScrolling.value
  });

  const animatedStyle = useAnimatedStyle(() => {

    // Fixed projects fade and scale based on scroll
    return {
      opacity: opacity.value,
      
    };
  });

  return (
    <Animated.View 
      style={[
        styles.container, 
        animatedStyle,
        project.isFixed && styles.fixedProject
      ]}
    >
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
  fixedProject: {
    position: 'relative',
    zIndex: 10,
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