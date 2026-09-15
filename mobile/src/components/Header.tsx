import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { CustomInput } from './CustomInput';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../theme/theme';

interface HeaderProps {
  onOpenFilterModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenFilterModal }) => {
  const { user } = useAuth();
  const { stats, filters, setFilterOptions } = useTasks();

  const completionRate = stats ? stats.completionRate : 0;

  return (
    <View style={styles.container}>
      {/* Top Greeting */}
      <View style={styles.topRow}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name || 'Task Master'} 👋</Text>
          <Text style={styles.subtitle}>Organize your day with AI Smart Sorting</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onOpenFilterModal}
          style={styles.filterButton}
        >
          <Text style={styles.filterIcon}>⚡</Text>
          <Text style={styles.filterBtnText}>Sort & Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Analytics Summary Banner */}
      <View style={styles.banner}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats?.total || 0}</Text>
            <Text style={styles.statLabel}>Total Tasks</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: COLORS.low }]}>{stats?.completed || 0}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: COLORS.urgent }]}>{stats?.urgent || 0}</Text>
            <Text style={styles.statLabel}>Urgent 🔥</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>Progress Overview</Text>
            <Text style={styles.progressPercent}>{completionRate}%</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${completionRate}%` }]} />
          </View>
        </View>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchRow}>
        <CustomInput
          placeholder="Search tasks by title, tag, or category..."
          value={filters.search}
          onChangeText={(text) => setFilterOptions({ search: text })}
          style={styles.searchInput}
          leftIcon={<Text style={{ fontSize: 16 }}>🔍</Text>}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: SPACING.xs + 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.primaryGlow,
    ...SHADOWS.glow,
  },
  filterIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  filterBtnText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  banner: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.card,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: COLORS.cardBorder,
  },
  progressContainer: {
    width: '100%',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  progressPercent: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '800',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
  },
  searchRow: {
    marginTop: 2,
  },
  searchInput: {
    fontSize: 14,
  },
});
