import { View, Text, StyleSheet } from 'react-native';
import { useTheme, colors } from '@/providers/ThemeProvider';
import { useState } from 'react';
import PageDots from '@/components/PageDots';
import MetricItem from '@/components/projects/MetricItem';
import TimeFilterSelect from '@/components/projects/TimeFilterSelect';
import TimeBlockList from '@/components/projects/TimeBlockList';
import TimeBlockGrid from '@/components/projects/TimeBlockGrid';
import { ScrollProvider, useScroll } from '@/providers/ScrollProvider';

function ProjectsContent() {
  const { theme } = useTheme();
  const themeColors = colors[theme];
  const { currentScrollY } = useScroll();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={[styles.header, { backgroundColor: themeColors.card }]}>
        <View style={styles.headerTop}>
          <Text style={[styles.title, { color: themeColors.text }]}>Projects</Text>
          <Text 
            style={[styles.viewToggle, { color: themeColors.primary }]}
            onPress={() => setViewMode(prev => prev === 'list' ? 'grid' : 'list')}
          >
            {viewMode === 'list' ? 'Switch to Grid' : 'Switch to List'}
          </Text>
        </View>
        
        <TimeFilterSelect themeColors={themeColors} />

        <View style={[styles.metricsContainer, { backgroundColor: themeColors.card }]}>
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

        <PageDots total={3} current={currentIndex} scrollY={currentScrollY} />
      </View>

      <View style={styles.contentContainer}>
        {viewMode === 'list' ? (
          <TimeBlockList 
            themeColors={themeColors}
            onMonthChange={setCurrentIndex}
          />
        ) : (
          <TimeBlockGrid themeColors={themeColors} />
        )}
      </View>
    </View>
  );
}

export default function ProjectsScreen() {
  return (
    <ScrollProvider>
      <ProjectsContent />
    </ScrollProvider>
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
  },
  viewToggle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
  },
  metricsContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 16,
  },
  netIncomeContainer: {
    gap: 4,
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
});