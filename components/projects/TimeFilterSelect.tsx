import { View, Text, TouchableOpacity, Modal, Pressable, StyleSheet } from 'react-native';
import { Calendar, ChevronDown } from 'lucide-react-native';
import { useTime, TIME_FILTERS } from '@/providers/TimeProvider';
import { useState } from 'react';

interface TimeFilterSelectProps {
  themeColors: any;
}

export default function TimeFilterSelect({ themeColors }: TimeFilterSelectProps) {
  const { selectedFilter, setSelectedFilter } = useTime();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentFilter = TIME_FILTERS.find(f => f.id === selectedFilter)!;

  return (
    <>
      <TouchableOpacity
        style={[styles.filterSelect, { 
          backgroundColor: themeColors.card,
          borderColor: themeColors.border,
        }]}
        onPress={() => setIsOpen(true)}
      >
        <Calendar size={20} color={themeColors.primary} style={styles.filterIcon} />
        <Text style={[styles.filterSelectText, { color: themeColors.text }]}>
          {currentFilter.label}
        </Text>
        <ChevronDown size={20} color={themeColors.secondary} />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setIsOpen(false)}
        >
          <View style={[styles.modalContent, { 
            backgroundColor: themeColors.card,
            borderColor: themeColors.border,
          }]}>
            {TIME_FILTERS.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[styles.filterOption, { 
                  backgroundColor: selectedFilter === filter.id 
                    ? `${themeColors.primary}15`
                    : 'transparent'
                }]}
                onPress={() => {
                  setSelectedFilter(filter.id);
                  setIsOpen(false);
                }}
              >
                <Calendar 
                  size={20} 
                  color={themeColors.primary}
                  style={styles.filterIcon} 
                />
                <Text style={[styles.filterOptionText, { 
                  color: themeColors.text,
                  fontFamily: selectedFilter === filter.id 
                    ? 'Inter-Medium' 
                    : 'Inter-Regular'
                }]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  filterSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  filterSelectText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  filterOptionText: {
    fontSize: 16,
    marginLeft: 12,
  },
  filterIcon: {
    marginRight: 4,
  },
});