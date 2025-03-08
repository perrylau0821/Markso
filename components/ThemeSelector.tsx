import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import { useTheme, colors } from '@/providers/ThemeProvider';
import { Moon, Sun, Github, Palette, Apple } from 'lucide-react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const themes = [
  { id: 'notion-light', name: 'Notion Light', icon: Sun },
  { id: 'notion-dark', name: 'Notion Dark', icon: Moon },
  { id: 'apple-light', name: 'Apple Light', icon: Apple },
  { id: 'apple-dark', name: 'Apple Dark', icon: Apple },
  { id: 'light', name: 'Light', icon: Sun },
  { id: 'dark', name: 'Dark', icon: Moon },
  { id: 'github', name: 'GitHub Dark', icon: Github },
] as const;

export default function ThemeSelector({ visible, onClose }: Props) {
  const { theme: currentTheme, setTheme } = useTheme();
  const themeColors = colors[currentTheme];

  const handleThemeSelect = (themeId: typeof themes[number]['id']) => {
    setTheme(themeId);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable 
        style={styles.overlay} 
        onPress={onClose}
      >
        <View style={[styles.container, { 
          backgroundColor: themeColors.card,
          borderColor: themeColors.border,
        }]}>
          <View style={[styles.header, { borderBottomColor: themeColors.border }]}>
            <Palette size={20} color={themeColors.primary} />
            <Text style={[styles.title, { color: themeColors.text }]}>
              Appearance
            </Text>
          </View>

          {themes.map((item) => {
            const Icon = item.icon;
            const isSelected = currentTheme === item.id;
            
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.option,
                  { 
                    backgroundColor: isSelected ? themeColors.shade2 : 'transparent',
                    borderBottomColor: themeColors.border,
                  }
                ]}
                onPress={() => handleThemeSelect(item.id)}
              >
                <View style={[styles.iconContainer, { backgroundColor: `${themeColors.primary}15` }]}>
                  <Icon size={20} color={themeColors.primary} />
                </View>
                <Text style={[styles.optionText, { color: themeColors.text }]}>
                  {item.name}
                </Text>
                {isSelected && (
                  <View style={[styles.checkmark, { backgroundColor: themeColors.primary }]} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  checkmark: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 8,
  },
});