import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TaskPriority } from '../types';
import { COLORS, RADIUS, SPACING } from '../theme/theme';

interface PriorityBadgeProps {
  priority: TaskPriority;
  size?: 'small' | 'medium';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'medium' }) => {
  const getBadgeStyle = () => {
    switch (priority) {
      case 'urgent':
        return { bg: COLORS.urgentBg, text: COLORS.urgent, label: 'Urgent 🔥' };
      case 'high':
        return { bg: COLORS.highBg, text: COLORS.high, label: 'High ⚡' };
      case 'medium':
        return { bg: COLORS.mediumBg, text: COLORS.medium, label: 'Medium 🔷' };
      case 'low':
      default:
        return { bg: COLORS.lowBg, text: COLORS.low, label: 'Low 🌱' };
    }
  };

  const config = getBadgeStyle();
  const isSmall = size === 'small';

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }, isSmall && styles.smallBadge]}>
      <Text style={[styles.text, { color: config.text }, isSmall && styles.smallText]}>
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
  },
  smallBadge: {
    paddingHorizontal: SPACING.xs + 2,
    paddingVertical: 2,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  smallText: {
    fontSize: 10,
  },
});
