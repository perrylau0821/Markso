import { View, Text, StyleSheet } from 'react-native';
import type { Project } from '@/types/projects';
import moment from 'moment';
import Animated, { 
  useAnimatedStyle,
  SharedValue,
} from 'react-native-reanimated';

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

  return (
    <View style={styles.container}>
      <View 
        style={[
          styles.projectCard, 
          { 
            backgroundColor: themeColors.shade2,
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
      </View>
    </View>
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
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  projectDates: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    opacity: 0.8,
  },
});