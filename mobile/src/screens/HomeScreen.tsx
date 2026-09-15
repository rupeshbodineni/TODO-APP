import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useTasks } from '../context/TaskContext';
import { Header } from '../components/Header';
import { TaskCard } from '../components/TaskCard';
import { CategoryPill } from '../components/CategoryPill';
import { AddTaskModal } from '../components/AddTaskModal';
import { FilterModal } from '../components/FilterModal';
import { Task, FilterStatus } from '../types';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../theme/theme';

const STATUS_TABS: { key: FilterStatus; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
  { key: 'today', label: 'Today 📅' },
];

const CATEGORIES = ['All', 'General', 'Work', 'Personal', 'Fitness', 'Study', 'Finance', 'Shopping'];

export const HomeScreen: React.FC = () => {
  const {
    tasks,
    isLoading,
    isRefreshing,
    error,
    filters,
    refreshTasks,
    toggleTask,
    deleteTask,
    addTask,
    updateTask,
    setFilterOptions,
  } = useTasks();

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setAddModalVisible(true);
  };

  const handleSaveTask = async (data: Partial<Task>): Promise<boolean> => {
    if (editingTask) {
      const res = await updateTask(editingTask.id, data);
      setEditingTask(null);
      return res;
    } else {
      return await addTask(data);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header onOpenFilterModal={() => setFilterModalVisible(true)} />

      {/* Status Filter Tabs */}
      <View style={styles.tabRow}>
        {STATUS_TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            activeOpacity={0.8}
            onPress={() => setFilterOptions({ status: tab.key })}
            style={[
              styles.tab,
              filters.status === tab.key && styles.activeTab,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                filters.status === tab.key && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Category Pills Bar */}
      <View style={styles.categoryBar}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <CategoryPill
              label={item}
              isSelected={filters.category === item}
              onPress={() => setFilterOptions({ category: item })}
            />
          )}
          contentContainerStyle={{ paddingHorizontal: SPACING.md }}
        />
      </View>

      {/* Sort Indicator Banner */}
      <View style={styles.sortBanner}>
        <Text style={styles.sortBannerText}>
          ⚡ Mode: <Text style={{ color: COLORS.primary, fontWeight: '700' }}>
            {filters.sortBy === 'mix' ? 'Smart Mix (Priority + Deadline + Time)' : filters.sortBy.toUpperCase()}
          </Text>
        </Text>
        <Text style={styles.taskCountBadge}>{tasks.length} tasks</Text>
      </View>

      {/* Main Task List */}
      {isLoading && tasks.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Fetching tasks from FastAPI + MySQL...</Text>
        </View>
      ) : error && tasks.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={refreshTasks}>
            <Text style={styles.retryText}>Retry Connection</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onEdit={handleEditTask}
            />
          )}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refreshTasks}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🎉</Text>
              <Text style={styles.emptyTitle}>No Tasks Found</Text>
              <Text style={styles.emptySub}>
                {filters.search
                  ? 'No tasks match your search query.'
                  : 'You have completed all your tasks or none created yet!'}
              </Text>
              <TouchableOpacity
                style={styles.emptyAddBtn}
                onPress={() => {
                  setEditingTask(null);
                  setAddModalVisible(true);
                }}
              >
                <Text style={styles.emptyAddText}>+ Add First Task</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.fab}
        onPress={() => {
          setEditingTask(null);
          setAddModalVisible(true);
        }}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* Create / Edit Task Modal */}
      <AddTaskModal
        visible={addModalVisible}
        editingTask={editingTask}
        onClose={() => setAddModalVisible(false)}
        onSave={handleSaveTask}
      />

      {/* Sort & Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    gap: 6,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.xs + 4,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: '#FFF',
    fontWeight: '800',
  },
  categoryBar: {
    marginBottom: SPACING.sm,
  },
  sortBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    backgroundColor: COLORS.surface,
    marginBottom: SPACING.xs,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  sortBannerText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  taskCountBadge: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '700',
  },
  listContainer: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xs,
    paddingBottom: 90,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  errorIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  errorText: {
    color: COLORS.urgent,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  retryBtn: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  retryText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  emptySub: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: SPACING.xl,
  },
  emptyAddBtn: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.full,
    ...SHADOWS.glow,
  },
  emptyAddText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    bottom: SPACING.lg,
    right: SPACING.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.glow,
    elevation: 8,
  },
  fabIcon: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '300',
    lineHeight: 34,
  },
});
