import { Tabs } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { useTheme, colors } from '@/providers/ThemeProvider';
import { Chrome as Home, User, FolderKanban, Database, Files } from 'lucide-react-native';

export default function TabLayout() {
  const { theme } = useTheme();
  const themeColors = colors[theme];

  return (
    <SafeAreaView 
      style={{ 
        flex: 1, 
        backgroundColor: themeColors.background,
      }}
      edges={['top']}
    >
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: themeColors.primary,
          tabBarInactiveTintColor: themeColors.secondary,
          tabBarStyle: {
            borderTopWidth: 1,
            borderTopColor: themeColors.border,
            backgroundColor: themeColors.tabBar,
            height: Platform.select({
              ios: 85,
              android: 60,
              default: 60,
            }),
            paddingBottom: Platform.select({
              ios: 30,
              default: 10,
            }),
            paddingTop: 10,
          },
          tabBarItemStyle: {
            paddingVertical: 0,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ size, color }) => <Home size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="projects"
          options={{
            title: 'Projects',
            tabBarIcon: ({ size, color }) => <FolderKanban size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="entities"
          options={{
            title: 'Entities',
            tabBarIcon: ({ size, color }) => <Database size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="documents"
          options={{
            title: 'Docs',
            tabBarIcon: ({ size, color }) => <Files size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ size, color }) => <User size={size} color={color} />,
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}