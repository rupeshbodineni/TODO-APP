import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Task } from '../types';
import { PriorityBadge } from './PriorityBadge';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../theme/theme';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onDelete, onEdit }) => {
  // Format Date and Deadline
  const formatDeadline = (deadlineStr?: string) => {
    if (!deadlineStr) return null;
    const deadline = new Date(deadlineStr);
    const now = new Date();
    const diffMs = deadline.getTime() - now.getTime();
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));

    if (diffMs < 0) {
      return { text: `Overdue (${Math.abs(diffHours)}h ago)`, isOverdue: true };
    } else if (diffHours <= 3) {
      return { text: `Due in ${diffHours}h!`, isUrgent: true };
    } else if (diffHours <= 24) {
      return { text: `Due today (${deadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`, isSoon: true };
    } else {
      return { text: `Due ${deadline.toLocaleDateString([], { month: 'short', day: 'numeric' })}` };
    }
  };

  const deadlineInfo = formatDeadline(task.deadline);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onEdit && onEdit(task)}
      style={[
        styles.card,
        task.isCompleted && styles.completedCard,
        task.priority === 'urgent' && !task.isCompleted && styles.urgentCardBorder,
      ]}
    >
      <View style={styles.contentRow}>
        {/* Toggle Checkbox Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onToggle(task.id)}
          style={[styles.checkbox, task.isCompleted && styles.checkboxChecked]}
        >
          {task.isCompleted && <Text style={styles.checkIcon}>✓</Text>}
        </TouchableOpacity>

        {/* Task Details */}
        <View style={styles.mainInfo}>
          <View style={styles.headerRow}>
            <Text
              style={[styles.title, task.isCompleted && styles.completedText]}
              numberOfLines={2}
            >
              {task.title}
            </Text>
          </View>

          {task.description ? (
            <Text
              style={[styles.description, task.isCompleted && styles.completedMutedText]}
              numberOfLines={2}
            >
              {task.description}
            </Text>
          ) : null}

          {/* Badges & Category Row */}
          <View style={styles.metaRow}>
            <PriorityBadge priority={task.priority} size="small" />

            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{task.category || 'General'}</Text>
            </View>

            {task.mixScore !== undefined && !task.isCompleted && (
              <View style={styles.scoreBadge}>
                <Text style={styles.scoreText}>⚡ {task.mixScore}</Text>
              </View>
            )}
          </View>

          {/* Deadline / Time row */}
          {deadlineInfo && !task.isCompleted && (
            <View
              style={[
                styles.deadlineContainer,
                deadlineInfo.isOverdue && styles.overdueBg,
                deadlineInfo.isUrgent && styles.urgentBg,
              ]}
            >
              <Text
                style={[
                  styles.deadlineText,
                  deadlineInfo.isOverdue && { color: COLORS.urgent },
                  deadlineInfo.isUrgent && { color: COLORS.high },
                ]}
              >
                ⏰ {deadlineInfo.text}
              </Text>
            </View>
          )}
        </View>

        {/* Delete Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onDelete(task.id)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteIcon}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.card,
  },
  completedCard: {
    opacity: 0.6,
    backgroundColor: COLORS.surfaceLight,
  },
  urgentCardBorder: {
    borderColor: 'rgba(239, 68, 68, 0.5)',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    marginRight: SPACING.md,
  },
  checkboxChecked: {
    backgroundColor: COLORS.low,
    borderColor: COLORS.low,
  },
  checkIcon: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 14,
  },
  mainInfo: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 22,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: COLORS.textMuted,
  },
  completedMutedText: {
    color: COLORS.textMuted,
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: SPACING.sm + 2,
    gap: 6,
  },
  categoryBadge: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  categoryText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  scoreBadge: {
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  scoreText: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: '700',
  },
  deadlineContainer: {
    marginTop: SPACING.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  overdueBg: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  urgentBg: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  deadlineText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  deleteButton: {
    padding: SPACING.xs,
    marginLeft: SPACING.sm,
  },
  deleteIcon: {
    fontSize: 18,
  },
});
