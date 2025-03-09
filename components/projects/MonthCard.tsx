import { View, Text, StyleSheet, Platform } from 'react-native';
import Animated from 'react-native-reanimated';
import type { MonthData } from '@/types/projects';
import moment from 'moment';
import ProjectItem from '@/components/projects/ProjectItem';

interface MonthCardProps {
  item: MonthData;
  themeColors: any;
  scrollX: Animated.SharedValue<number>;
  isScrolling: Animated.SharedValue<number>;
  onFixedProjectLayout?: (layout: { x: number; y: number; width: number; height: number }) => void;
}

export default function MonthCard({ 
  item, 
  themeColors, 
  scrollX, 
  isScrolling,
  onFixedProjectLayout 
}: MonthCardProps) {
  const currentMonth = moment(item.date);
  const fixedProjects = item.projects.filter(p => p.isFixed);

  return (
    <View 
      style={[
        styles.card,
        { 
          backgroundColor: themeColors.card,
        }
      ]}
    >
      <View style={styles.content}>
        {item.projects.map((project) => (
          <ProjectItem
            key={project.id}
            project={project}
            currentMonth={currentMonth}
            themeColors={themeColors}
            scrollX={scrollX}
            isScrolling={isScrolling}
            onLayout={project.isFixed ? onFixedProjectLayout : undefined}
          />
        ))}

        {item.projects.length === 0 && (
          <Text style={[styles.placeholder, { color: themeColors.secondary }]}>
            No projects scheduled
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: '100%',
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
  content: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  placeholder: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 40,
  },
});