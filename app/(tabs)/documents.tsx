import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme, colors } from '@/providers/ThemeProvider';
import { FileText, Download, Share2, MoveHorizontal as MoreHorizontal, Search, Plus } from 'lucide-react-native';

export default function DocumentsScreen() {
  const { theme } = useTheme();
  const themeColors = colors[theme];

  const documents = [
    {
      id: 1,
      name: 'Project Proposal.pdf',
      size: '2.4 MB',
      modified: '2 hours ago',
      type: 'PDF',
    },
    {
      id: 2,
      name: 'Financial Report Q4.xlsx',
      size: '1.8 MB',
      modified: '1 day ago',
      type: 'Excel',
    },
    {
      id: 3,
      name: 'Meeting Notes.docx',
      size: '856 KB',
      modified: '3 days ago',
      type: 'Word',
    },
    {
      id: 4,
      name: 'Product Roadmap.pptx',
      size: '4.2 MB',
      modified: '1 week ago',
      type: 'PowerPoint',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: themeColors.text }]}>Documents</Text>
        <TouchableOpacity 
          style={[styles.newButton, { backgroundColor: themeColors.primary }]}
        >
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.newButtonText}>Upload</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.searchContainer, { 
        backgroundColor: themeColors.card,
        borderColor: themeColors.border,
      }]}>
        <Search size={20} color={themeColors.secondary} />
        <Text style={[styles.searchPlaceholder, { color: themeColors.secondary }]}>
          Search documents...
        </Text>
      </View>

      <ScrollView style={styles.documentsList}>
        {documents.map((doc) => (
          <View
            key={doc.id}
            style={[
              styles.documentItem,
              { 
                backgroundColor: themeColors.card,
                borderColor: themeColors.border,
              }
            ]}
          >
            <View style={styles.documentInfo}>
              <View style={[styles.iconContainer, { backgroundColor: `${themeColors.primary}15` }]}>
                <FileText size={24} color={themeColors.primary} />
              </View>
              <View style={styles.documentDetails}>
                <Text style={[styles.documentName, { color: themeColors.text }]}>
                  {doc.name}
                </Text>
                <View style={styles.documentMeta}>
                  <Text style={[styles.metaText, { color: themeColors.secondary }]}>
                    {doc.size}
                  </Text>
                  <Text style={[styles.metaText, { color: themeColors.secondary }]}>
                    {doc.modified}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionButton}>
                <Download size={20} color={themeColors.secondary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Share2 size={20} color={themeColors.secondary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <MoreHorizontal size={20} color={themeColors.secondary} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 24,
    gap: 12,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  documentsList: {
    flex: 1,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  documentDetails: {
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  documentMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
});