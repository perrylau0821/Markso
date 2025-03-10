import { View, Text, StyleSheet, Platform, ScrollView } from 'react-native';
import Animated from 'react-native-reanimated';
import type { MonthData } from '@/types/projects';
import moment from 'moment';
import ProjectItem from '@/components/projects/ProjectItem';
import { useScroll } from '@/providers/ScrollProvider';
import { useEffect, useRef } from 'react';

interface TimeBlockViewProps {
  item: MonthData;
  themeColors: any;
  scrollX: Animated.SharedValue<number>;
}

export default function TimeBlockView({ 
  item, 
  themeColors, 
  scrollX,
}: TimeBlockViewProps) {
  const currentMonth = moment(item.date);
  const scrollViewRef = useRef<ScrollView>(null);
  const { registerScrollView, unregisterScrollView, syncScroll } = useScroll();
  const scrollViewKey = `timeblock-${item.id}`;

  useEffect(() => {
    registerScrollView(scrollViewKey, scrollViewRef);
    return () => unregisterScrollView(scrollViewKey);
  }, [scrollViewKey]);

  return (
    <View 
      style={[
        styles.card,
        { 
          backgroundColor: themeColors.card,
        }
      ]}
    >
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={(e) => {
          const y = e.nativeEvent.contentOffset.y;
          syncScroll(scrollViewKey, y);
        }}
        scrollEventThrottle={16}
      >
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
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
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