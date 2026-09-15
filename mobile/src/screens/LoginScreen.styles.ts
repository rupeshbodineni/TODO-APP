import { StyleSheet } from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../theme/theme';

export const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  configButton: {
    position: 'absolute',
    top: SPACING.xl,
    right: SPACING.lg,
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  configButtonText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    marginTop: SPACING.xxl,
  },
  logoIcon: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    ...SHADOWS.glow,
    marginBottom: SPACING.sm,
  },
  logoText: {
    fontSize: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  card: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.card,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },
  cardSub: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: SPACING.lg,
  },
  errorContainer: {
    backgroundColor: COLORS.urgentBg,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.urgent,
    marginBottom: SPACING.md,
  },
  errorText: {
    color: COLORS.urgent,
    fontSize: 13,
    fontWeight: '600',
  },
  demoButton: {
    marginTop: SPACING.md,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },
  demoButtonText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  footerText: {
    color: COLORS.textMuted,
    fontSize: 14,
    marginRight: 6,
  },
  linkText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  modalDescription: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },
  modalButtonRow: {
    flexDirection: 'row',
    marginTop: SPACING.md,
  },
  cancelButton: {
    flex: 1,
    marginRight: 6,
  },
  saveButton: {
    flex: 1,
    marginLeft: 6,
  },
  signInButton: {
    marginTop: SPACING.md,
  },
  icon: {
    fontSize: 16,
  },
});
