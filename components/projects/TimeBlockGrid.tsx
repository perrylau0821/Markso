import { View, Text, StyleSheet, Dimensions } from 'react-native';
import DirectedScrollView from '@/components/DirectedScrollView';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const GRID_SIZE = 10;

interface TimeBlockGridProps {
  themeColors: any;
}

export default function TimeBlockGrid({ themeColors }: TimeBlockGridProps) {
  const contentWidth = SCREEN_WIDTH * GRID_SIZE;
  const contentHeight = SCREEN_HEIGHT * GRID_SIZE;

  // Generate grid data
  const data = Array(GRID_SIZE * GRID_SIZE).fill(undefined).map((_, i) => ({ 
    id: i,
    row: Math.floor(i / GRID_SIZE),
    col: i % GRID_SIZE,
  }));

  return (
    <DirectedScrollView
      contentWidth={contentWidth}
      contentHeight={contentHeight}
      bounces={true}
      decelerationRate={0.994}
    >
      <View style={[styles.gridContainer, { width: contentWidth, height: contentHeight }]}>
        {data.map(({ id, row, col }) => (
          <View 
            key={id}
            style={[
              styles.gridItem, 
              { 
                backgroundColor: themeColors.card,
                left: col * SCREEN_WIDTH,
                top: row * (SCREEN_HEIGHT / GRID_SIZE),
              }
            ]}
          >
            <Text style={[styles.gridText, { color: themeColors.text }]}>
              {id}
            </Text>
          </View>
        ))}
      </View>
    </DirectedScrollView>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    position: 'relative',
  },
  gridItem: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT / GRID_SIZE,
    padding: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  gridText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
});