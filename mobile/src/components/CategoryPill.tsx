import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../theme/theme';

interface CategoryPillProps {
  label: string;
  isSelected?: boolean;
  onPress?: () => void;
  color?: string;
}

export const CategoryPill: React.FC<CategoryPillProps> = ({
  label,
  isSelected = false,
  onPress,
  color = COLORS.primary,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.pill,
        isSelected
          ? { backgroundColor: color, borderColor: color }
          : { backgroundColor: COLORS.surfaceLight, borderColor: COLORS.cardBorder },
      ]}
    >
      <Text
        style={[
          styles.text,
          isSelected ? { color: '#FFF', fontWeight: '700' } : { color: COLORS.textSecondary },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm - 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    marginRight: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 13,
    fontWeight: '500',
  },
});
