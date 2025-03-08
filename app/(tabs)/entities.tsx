import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme, colors } from '@/providers/ThemeProvider';
import { User as User2, Building2, ShoppingBag, Briefcase, Plus } from 'lucide-react-native';

const entities = [
  {
    id: 1,
    type: 'Customer',
    name: 'John Smith',
    icon: User2,
    count: 156,
    color: '#3B82F6',
  },
  {
    id: 2,
    type: 'Company',
    name: 'Tech Corp',
    icon: Building2,
    count: 89,
    color: '#10B981',
  },
  {
    id: 3,
    type: 'Product',
    name: 'Smart Watch',
    icon: ShoppingBag,
    count: 234,
    color: '#F59E0B',
  },
  {
    id: 4,
    type: 'Service',
    name: 'Consulting',
    icon: Briefcase,
    count: 67,
    color: '#8B5CF6',
  },
];

export default function EntitiesScreen() {
  const { theme } = useTheme();
  const themeColors = colors[theme];

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: themeColors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: themeColors.text }]}>Entities</Text>
        <TouchableOpacity 
          style={[styles.newButton, { backgroundColor: themeColors.primary }]}
        >
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.newButtonText}>New Entity</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {entities.map((entity) => (
          <TouchableOpacity
            key={entity.id}
            style={[
              styles.card,
              { 
                backgroundColor: themeColors.card,
                borderColor: themeColors.border,
              }
            ]}
          >
            <View style={[styles.iconContainer, { backgroundColor: `${entity.color}15` }]}>
              <entity.icon size={24} color={entity.color} />
            </View>
            <Text style={[styles.entityType, { color: themeColors.text }]}>
              {entity.type}
            </Text>
            <Text style={[styles.entityName, { color: themeColors.secondary }]}>
              {entity.name}
            </Text>
            <Text style={[styles.entityCount, { color: entity.color }]}>
              {entity.count} records
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  newButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  card: {
    width: '47%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  entityType: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  entityName: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 12,
  },
  entityCount: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
});