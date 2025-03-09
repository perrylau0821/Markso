import { View, Text, StyleSheet, Dimensions } from 'react-native';
import type { Project } from '@/types/projects';
import Animated, { 
  useAnimatedStyle,
  SharedValue,
} from 'react-native-reanimated';
import moment from 'moment';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ProjectPortalProps {
  project: Project;
  isScrolling: SharedValue<number>;
  themeColors: any;
  layout: {
    x: number;
    y: number;
    width: number;
    height: number;
    pageX: number;
    pageY: number;
  };
  scrollX: SharedValue<number>;
}

export default function ProjectPortal({ 
  project, 
  isScrolling,
  themeColors,
  layout,
  scrollX,
}: ProjectPortalProps) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: 1 - isScrolling.value,
      transform: [
        { translateX: layout.x },
        { translateY: layout.y },
      ],
      width: layout.width,
      height: layout.height,
    };
  });

  return (
    <Animated.View 
      style={[
        styles.portalContainer,
        animatedStyle,
      ]}
      pointerEvents="none"
    >
      <View 
        style={[
          styles.projectCard,
          { 
            backgroundColor: `${themeColors.primary}15`,
            borderColor: themeColors.border,
          }
        ]}
      >
        <View style={[styles.badge, { backgroundColor: themeColors.primary }]}>
          <Text style={styles.badgeText}>Fixed Project</Text>
        </View>
        <Text style={[styles.projectName, { color: themeColors.text }]}>
          {project.name}
        </Text>
        <Text style={[styles.projectDates, { color: themeColors.secondary }]}>
          {moment(project.startDate).format('MMM D, YYYY')} - {moment(project.endDate).format('MMM D, YYYY')}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  portalContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 1000,
  },
  projectCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  projectName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  projectDates: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    opacity: 0.8,
  },
});