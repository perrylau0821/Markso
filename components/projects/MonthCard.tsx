import { View, Text, StyleSheet, Platform } from 'react-native';
import Animated from 'react-native-reanimated';
import type { MonthData } from '@/types/projects';
import moment from 'moment';
import ProjectItem from '@/components/projects/ProjectItem';

interface MonthCardProps {
  item: MonthData;
  themeColors: any;
  scrollX: Animated.SharedValue<number>;
}

export default function MonthCard({ item, themeColors, scrollX }: MonthCardProps) {
  const currentMonth = moment(item.date);

  return (
    <View 
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
        {item.projects.map((project) => (
          <ProjectItem
            key={project.id}
            project={project}
            currentMonth={currentMonth}
            themeColors={themeColors}
            scrollX={scrollX}
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