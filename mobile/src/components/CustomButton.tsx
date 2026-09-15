import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../theme/theme';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  style,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return { bg: COLORS.surfaceLight, text: COLORS.text, border: COLORS.cardBorder };
      case 'danger':
        return { bg: COLORS.urgent, text: '#FFF', border: 'transparent' };
      case 'outline':
        return { bg: 'transparent', text: COLORS.primary, border: COLORS.primary };
      case 'primary':
      default:
        return { bg: COLORS.primary, text: '#FFF', border: 'transparent' };
    }
  };

  const vConfig = getVariantStyles();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[
        styles.button,
        { backgroundColor: vConfig.bg, borderColor: vConfig.border },
        variant === 'primary' && SHADOWS.glow,
        disabled && styles.disabled,
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={vConfig.text} size="small" />
      ) : (
        <Text style={[styles.text, { color: vConfig.text }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    borderWidth: 1,
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
