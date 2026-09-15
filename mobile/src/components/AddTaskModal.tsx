import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Task, TaskPriority } from '../types';
import { CustomInput } from './CustomInput';
import { CustomButton } from './CustomButton';
import { PriorityBadge } from './PriorityBadge';
import { CategoryPill } from './CategoryPill';
import { COLORS, RADIUS, SPACING } from '../theme/theme';

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (taskData: Partial<Task>) => Promise<boolean>;
  editingTask?: Task | null;
}

const CATEGORIES = ['General', 'Work', 'Personal', 'Fitness', 'Study', 'Finance', 'Shopping'];
const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high', 'urgent'];

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  visible,
  onClose,
  onSave,
  editingTask,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [category, setCategory] = useState('General');
  const [tagsInput, setTagsInput] = useState('');
  const [deadlinePreset, setDeadlinePreset] = useState<string>('none');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setPriority(editingTask.priority);
      setCategory(editingTask.category || 'General');
      setTagsInput(editingTask.tags ? editingTask.tags.join(', ') : '');
      setDeadlinePreset('none');
    } else {
      resetForm();
    }
  }, [editingTask, visible]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setCategory('General');
    setTagsInput('');
    setDeadlinePreset('none');
  };

  const calculateDeadlineDate = (preset: string): string | undefined => {
    const now = new Date();
    if (preset === '2h') {
      return new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString();
    } else if (preset === '12h') {
      return new Date(now.getTime() + 12 * 60 * 60 * 1000).toISOString();
    } else if (preset === '1d') {
      return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    } else if (preset === '3d') {
      return new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();
    }
    return undefined;
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Please enter a task title');
      return;
    }

    setIsSubmitting(true);
    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const deadlineVal = calculateDeadlineDate(deadlinePreset);

    const success = await onSave({
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      tags: tagsArray,
      deadline: deadlineVal || editingTask?.deadline,
    });

    setIsSubmitting(false);
    if (success) {
      resetForm();
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingTask ? 'Edit Task ✏️' : 'Create New Task 🚀'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
            {/* Title */}
            <CustomInput
              label="Task Title *"
              placeholder="e.g. Complete React Native Assignment"
              value={title}
              onChangeText={setTitle}
            />

            {/* Description */}
            <CustomInput
              label="Description (Optional)"
              placeholder="Add key notes, links, or requirements..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              style={styles.textArea}
            />

            {/* Priority Selector */}
            <Text style={styles.sectionLabel}>Priority Level</Text>
            <View style={styles.priorityRow}>
              {PRIORITIES.map((p) => (
                <TouchableOpacity
                  key={p}
                  activeOpacity={0.8}
                  onPress={() => setPriority(p)}
                  style={[
                    styles.priorityOption,
                    priority === p && styles.selectedPriorityOption,
                  ]}
                >
                  <PriorityBadge priority={p} size="small" />
                </TouchableOpacity>
              ))}
            </View>

            {/* Category Selector */}
            <Text style={styles.sectionLabel}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
              {CATEGORIES.map((cat) => (
                <CategoryPill
                  key={cat}
                  label={cat}
                  isSelected={category === cat}
                  onPress={() => setCategory(cat)}
                />
              ))}
            </ScrollView>

            {/* Deadline Presets */}
            <Text style={styles.sectionLabel}>Deadline Urgency</Text>
            <View style={styles.presetRow}>
              {[
                { key: 'none', label: 'No Deadline' },
                { key: '2h', label: 'In 2 Hours 🔥' },
                { key: '12h', label: 'Today (12h)' },
                { key: '1d', label: 'Tomorrow' },
                { key: '3d', label: 'In 3 Days' },
              ].map((p) => (
                <TouchableOpacity
                  key={p.key}
                  onPress={() => setDeadlinePreset(p.key)}
                  style={[
                    styles.presetPill,
                    deadlinePreset === p.key && styles.presetPillSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.presetText,
                      deadlinePreset === p.key && styles.presetTextSelected,
                    ]}
                  >
                    {p.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Tags Input */}
            <CustomInput
              label="Tags (comma separated)"
              placeholder="e.g. React, Urgent, Mobile"
              value={tagsInput}
              onChangeText={setTagsInput}
            />
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <CustomButton
              title="Cancel"
              variant="secondary"
              onPress={onClose}
              style={{ flex: 1, marginRight: SPACING.sm }}
            />
            <CustomButton
              title={editingTask ? 'Save Changes' : 'Create Task'}
              onPress={handleSave}
              isLoading={isSubmitting}
              style={{ flex: 1, marginLeft: SPACING.sm }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.lg,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },
  closeBtn: {
    padding: SPACING.xs,
  },
  closeBtnText: {
    fontSize: 20,
    color: COLORS.textMuted,
  },
  scrollBody: {
    paddingBottom: SPACING.md,
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  sectionLabel: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: SPACING.sm,
    marginTop: SPACING.sm,
  },
  priorityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: SPACING.md,
  },
  priorityOption: {
    padding: 2,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  selectedPriorityOption: {
    borderColor: COLORS.primary,
  },
  categoriesScroll: {
    marginBottom: SPACING.md,
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: SPACING.md,
  },
  presetPill: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  presetPillSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  presetText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  presetTextSelected: {
    color: '#FFF',
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: SPACING.md,
  },
});
