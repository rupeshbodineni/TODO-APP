import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useTasks } from '../context/TaskContext';
import { SortMode, FilterStatus, TaskPriority } from '../types';
import { CustomButton } from './CustomButton';
import { COLORS, RADIUS, SPACING } from '../theme/theme';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
}

const SORT_OPTIONS: { key: SortMode; label: string; desc: string }[] = [
  {
    key: 'mix',
    label: 'Smart AI Mix Algorithm ⚡ (Recommended)',
    desc: 'Combines Priority, Deadline Urgency, and Time score dynamically.',
  },
  {
    key: 'deadline',
    label: 'Deadline Closeness ⏰',
    desc: 'Sorts tasks strictly by nearest due date.',
  },
  {
    key: 'priority',
    label: 'Highest Priority 🚀',
    desc: 'Sorts Urgent -> High -> Medium -> Low.',
  },
  {
    key: 'date',
    label: 'Recently Scheduled 📅',
    desc: 'Sorts by task scheduled date & time.',
  },
];

const STATUS_OPTIONS: { key: FilterStatus; label: string }[] = [
  { key: 'all', label: 'All Statuses' },
  { key: 'pending', label: 'Pending Only' },
  { key: 'completed', label: 'Completed Only' },
  { key: 'today', label: 'Due Today' },
];

const CATEGORIES = ['All', 'General', 'Work', 'Personal', 'Fitness', 'Study', 'Finance', 'Shopping'];

export const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose }) => {
  const { filters, setFilterOptions, resetFilters } = useTasks();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Filter & Smart Sort ⚡</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Sort Mode Selection */}
            <Text style={styles.sectionTitle}>Sorting Engine</Text>
            {SORT_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.key}
                activeOpacity={0.8}
                onPress={() => setFilterOptions({ sortBy: opt.key })}
                style={[
                  styles.optionCard,
                  filters.sortBy === opt.key && styles.selectedOptionCard,
                ]}
              >
                <Text
                  style={[
                    styles.optionLabel,
                    filters.sortBy === opt.key && styles.selectedText,
                  ]}
                >
                  {opt.label}
                </Text>
                <Text style={styles.optionDesc}>{opt.desc}</Text>
              </TouchableOpacity>
            ))}

            {/* Status Filter */}
            <Text style={styles.sectionTitle}>Task Status</Text>
            <View style={styles.chipRow}>
              {STATUS_OPTIONS.map((s) => (
                <TouchableOpacity
                  key={s.key}
                  onPress={() => setFilterOptions({ status: s.key })}
                  style={[
                    styles.chip,
                    filters.status === s.key && styles.selectedChip,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      filters.status === s.key && styles.selectedChipText,
                    ]}
                  >
                    {s.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Category Filter */}
            <Text style={styles.sectionTitle}>Category</Text>
            <View style={styles.chipRow}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setFilterOptions({ category: cat })}
                  style={[
                    styles.chip,
                    filters.category === cat && styles.selectedChip,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      filters.category === cat && styles.selectedChipText,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Buttons */}
          <View style={styles.footer}>
            <CustomButton
              title="Reset All"
              variant="outline"
              onPress={resetFilters}
              style={{ flex: 1, marginRight: SPACING.sm }}
            />
            <CustomButton
              title="Apply Filters"
              onPress={onClose}
              style={{ flex: 1, marginLeft: SPACING.sm }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.lg,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },
  closeBtn: {
    fontSize: 20,
    color: COLORS.textMuted,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  optionCard: {
    backgroundColor: COLORS.surfaceLight,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  selectedOptionCard: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  selectedText: {
    color: COLORS.primary,
  },
  optionDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: SPACING.sm,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  selectedChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  selectedChipText: {
    color: '#FFF',
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    marginTop: SPACING.md,
  },
});
