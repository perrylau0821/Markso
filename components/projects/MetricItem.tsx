import { View, Text, StyleSheet } from 'react-native';

interface MetricItemProps {
  title: string;
  value: string;
  themeColors: any;
}

export default function MetricItem({ title, value, themeColors }: MetricItemProps) {
  return (
    <View style={styles.metricItem}>
      <Text style={[styles.metricTitle, { color: themeColors.secondary }]} numberOfLines={1}>
        {title}
      </Text>
      <Text style={[styles.metricValue, { color: themeColors.text }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  metricItem: {
    flex: 1,
    gap: 2,
  },
  metricTitle: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
  },
  metricValue: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
});