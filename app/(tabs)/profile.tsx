import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Settings, Bell, Shield, CircleHelp as HelpCircle, LogOut, Palette } from 'lucide-react-native';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme, colors } from '@/providers/ThemeProvider';
import { useState } from 'react';
import ThemeSelector from '@/components/ThemeSelector';

export default function ProfileScreen() {
  const { signOut, user } = useAuth();
  const { theme } = useTheme();
  const themeColors = colors[theme];
  const [themeModalVisible, setThemeModalVisible] = useState(false);

  const menuItems = [
    { 
      icon: Palette, 
      label: 'Appearance', 
      color: themeColors.primary, 
      onPress: () => setThemeModalVisible(true) 
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      color: themeColors.primary, 
      onPress: () => {} 
    },
    { 
      icon: Bell, 
      label: 'Notifications', 
      color: themeColors.primary, 
      onPress: () => {} 
    },
    { 
      icon: Shield, 
      label: 'Privacy', 
      color: themeColors.primary, 
      onPress: () => {} 
    },
    { 
      icon: HelpCircle, 
      label: 'Help & Support', 
      color: themeColors.primary, 
      onPress: () => {} 
    },
    { 
      icon: LogOut, 
      label: 'Logout', 
      color: themeColors.error, 
      onPress: signOut 
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={[styles.header, { backgroundColor: themeColors.card }]}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000&auto=format&fit=crop' }}
          style={styles.avatar}
        />
        <Text style={[styles.name, { color: themeColors.text }]}>
          {user?.email?.split('@')[0] || 'User'}
        </Text>
        <Text style={[styles.email, { color: themeColors.secondary }]}>
          {user?.email}
        </Text>
      </View>

      <View style={[styles.menuContainer, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
        {menuItems.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={[
              styles.menuItem, 
              { 
                backgroundColor: themeColors.shade1,
                borderBottomColor: themeColors.border,
                borderBottomWidth: index === menuItems.length - 1 ? 0 : 1,
              }
            ]}
            onPress={item.onPress}
          >
            <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
              <item.icon size={24} color={item.color} />
            </View>
            <Text style={[styles.menuText, { color: themeColors.text }]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.statsContainer, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: themeColors.primary }]}>256</Text>
          <Text style={[styles.statLabel, { color: themeColors.secondary }]}>Projects</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: themeColors.primary }]}>1.2k</Text>
          <Text style={[styles.statLabel, { color: themeColors.secondary }]}>Following</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: themeColors.primary }]}>4.8</Text>
          <Text style={[styles.statLabel, { color: themeColors.secondary }]}>Rating</Text>
        </View>
      </View>

      <ThemeSelector 
        visible={themeModalVisible} 
        onClose={() => setThemeModalVisible(false)} 
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  menuContainer: {
    marginTop: 24,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 24,
    marginTop: 24,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  statCard: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});