import { View, Text, StyleSheet, Image } from 'react-native';
import { useTheme, colors } from '@/providers/ThemeProvider';
import { useEffect } from 'react';

export default function HomeScreen() {
  const { theme } = useTheme();
  const themeColors = colors[theme];

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={[styles.header, { backgroundColor: themeColors.primary }]}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1000&auto=format&fit=crop' }}
          style={styles.headerImage}
        />
        <Text style={styles.welcomeText}>Welcome Back!</Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: themeColors.text }]}>Your Dashboard</Text>

    

        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { 
            backgroundColor: themeColors.card,
            borderColor: themeColors.border,
          }]}>
            <Text style={[styles.statNumber, { color: themeColors.primary }]}>28</Text>
            <Text style={[styles.statLabel, { color: themeColors.secondary }]}>Tasks</Text>
          </View>
          <View style={[styles.statCard, { 
            backgroundColor: themeColors.card,
            borderColor: themeColors.border,
          }]}>
            <Text style={[styles.statNumber, { color: themeColors.primary }]}>12</Text>
            <Text style={[styles.statLabel, { color: themeColors.secondary }]}>Projects</Text>
          </View>
          <View style={[styles.statCard, { 
            backgroundColor: themeColors.card,
            borderColor: themeColors.border,
          }]}>
            <Text style={[styles.statNumber, { color: themeColors.primary }]}>95%</Text>
            <Text style={[styles.statLabel, { color: themeColors.secondary }]}>Complete</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  headerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 24,
  },
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    marginBottom: 24,
  },
  box: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
});