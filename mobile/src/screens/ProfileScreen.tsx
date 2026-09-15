import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { CustomButton } from '../components/CustomButton';
import { CustomInput } from '../components/CustomInput';
import { getCustomApiUrl, setCustomApiUrl } from '../api/client';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../theme/theme';

export const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const { stats } = useTasks();

  const [currentApiUrl, setCurrentApiUrl] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [inputUrl, setInputUrl] = useState('');

  useEffect(() => {
    loadUrl();
  }, []);

  const loadUrl = async () => {
    const url = await getCustomApiUrl();
    setCurrentApiUrl(url);
  };

  const handleOpenConfig = () => {
    setInputUrl(currentApiUrl);
    setModalVisible(true);
  };

  const handleSaveConfig = async () => {
    if (!inputUrl.trim()) return;
    await setCustomApiUrl(inputUrl.trim());
    await loadUrl();
    setModalVisible(false);
    Alert.alert('Config Saved', 'API Endpoint updated successfully!');
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => logout(),
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Profile Header */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </Text>
        </View>
        <Text style={styles.name}>{user?.name || 'User Profile'}</Text>
        <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>⚡ Verified MenuVerse User</Text>
        </View>
      </View>

      {/* Analytics Overview */}
      <Text style={styles.sectionTitle}>Productivity Dashboard</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statVal}>{stats?.total || 0}</Text>
          <Text style={styles.statLbl}>Total Tasks Created</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statVal, { color: COLORS.low }]}>{stats?.completed || 0}</Text>
          <Text style={styles.statLbl}>Completed Tasks</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statVal, { color: COLORS.high }]}>{stats?.pending || 0}</Text>
          <Text style={styles.statLbl}>Pending Tasks</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statVal, { color: COLORS.urgent }]}>{stats?.urgent || 0}</Text>
          <Text style={styles.statLbl}>Urgent Tasks 🔥</Text>
        </View>
      </View>

      {/* Completion Percentage Banner */}
      <View style={styles.scoreBanner}>
        <View style={{ flex: 1 }}>
          <Text style={styles.scoreTitle}>Productivity Score</Text>
          <Text style={styles.scoreDesc}>
            {stats?.completionRate && stats.completionRate > 70
              ? 'Outstanding performance! Keep crushing your goals.'
              : 'Keep pushing! Complete pending tasks to boost your score.'}
          </Text>
        </View>
        <View style={styles.rateBadge}>
          <Text style={styles.rateText}>{stats?.completionRate || 0}%</Text>
        </View>
      </View>

      {/* Backend & Environment Info */}
      <Text style={styles.sectionTitle}>Backend Architecture</Text>
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>REST API Engine:</Text>
          <Text style={styles.infoValue}>FastAPI (Python 3.13)</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Database:</Text>
          <Text style={styles.infoValue}>MySQL 8.0 Server</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Active Endpoint:</Text>
          <Text style={[styles.infoValue, { color: COLORS.primary }]} numberOfLines={1}>
            {currentApiUrl}
          </Text>
        </View>

        <TouchableOpacity style={styles.configBtn} onPress={handleOpenConfig}>
          <Text style={styles.configBtnText}>⚙️ Change API Server Base URL</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Action */}
      <View style={{ marginTop: SPACING.xl, marginBottom: SPACING.xxl }}>
        <CustomButton title="Logout" variant="danger" onPress={handleLogout} />
      </View>

      {/* Config Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Configure API Server</Text>
            <Text style={styles.modalSub}>
              Enter FastAPI server URL (e.g. http://10.0.2.2:5000/api or host IP)
            </Text>

            <CustomInput
              label="API Base URL"
              value={inputUrl}
              onChangeText={setInputUrl}
              placeholder="http://10.0.2.2:5000/api"
            />

            <View style={{ flexDirection: 'row', marginTop: SPACING.md }}>
              <CustomButton
                title="Cancel"
                variant="secondary"
                onPress={() => setModalVisible(false)}
                style={{ flex: 1, marginRight: 6 }}
              />
              <CustomButton
                title="Save Endpoint"
                onPress={handleSaveConfig}
                style={{ flex: 1, marginLeft: 6 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingTop: SPACING.lg,
  },
  profileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.card,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.glow,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFF',
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
  },
  email: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  badge: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  badgeText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: SPACING.md,
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  statVal: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.text,
  },
  statLbl: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4,
    fontWeight: '600',
  },
  scoreBanner: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  scoreTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  scoreDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    paddingRight: SPACING.sm,
  },
  rateBadge: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.glow,
  },
  rateText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 15,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs + 2,
    borderBottomWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  infoLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  configBtn: {
    marginTop: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  configBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
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
  },
  modalSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },
});
