import { View, Text, StyleSheet, findNodeHandle } from 'react-native';
import type { Project } from '@/types/projects';
import moment from 'moment';
import Animated, { 
  useAnimatedStyle,
  SharedValue,
} from 'react-native-reanimated';
import { useRef, useCallback, useEffect } from 'react';

interface ProjectItemProps {
  project: Project;
  currentMonth: moment.Moment;
  themeColors: any;
  scrollX: SharedValue<number>;
  isScrolling: SharedValue<number>;
  onLayout?: (layout: { x: number; y: number; width: number; height: number; pageX: number; pageY: number }) => void;
}

export default function ProjectItem({ 
  project, 
  currentMonth,
  themeColors,
  scrollX,
  isScrolling,
  onLayout,
}: ProjectItemProps) {
  const startDate = moment(project.startDate);
  const endDate = moment(project.endDate);
  const viewRef = useRef(null);

  const animatedStyle = useAnimatedStyle(() => {
    if (!project.isFixed) return { opacity: 1 };
    return {
      opacity: isScrolling.value
    };
  });

  const measureView = useCallback(() => {
    if (!viewRef.current) return;

    const handle = findNodeHandle(viewRef.current);
    if (!handle) return;

    viewRef.current.measure((x, y, width, height, pageX, pageY) => {
      if (onLayout) {
        requestAnimationFrame(() => {
          onLayout({ x, y, width, height, pageX, pageY });
        });
      }
    });
  }, [onLayout]);

  useEffect(() => {
    if (project.isFixed && onLayout) {
      const timeoutId = setTimeout(measureView, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [project.isFixed, onLayout, measureView]);

  return (
    <Animated.View 
      ref={viewRef}
      style={[
        styles.container, 
        animatedStyle,
        project.isFixed && styles.fixedProject
      ]}
      onLayout={measureView}
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
        {project.isFixed && (
          <View style={[styles.badge, { backgroundColor: themeColors.primary }]}>
            <Text style={styles.badgeText}>Fixed Project</Text>
          </View>
        )}
        <Text style={[styles.projectName, { color: themeColors.text }]}>
          {project.name}
        </Text>
        <Text style={[styles.projectDates, { color: themeColors.secondary }]}>
          {startDate.format('MMM D, YYYY')} - {endDate.format('MMM D, YYYY')}
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