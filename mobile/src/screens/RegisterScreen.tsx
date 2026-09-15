import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../theme/theme';

export const RegisterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { register, isLoading, error, clearError } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert('Validation Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match');
      return;
    }

    const success = await register(name.trim(), email.trim(), password);
    if (!success) {
      // Error handled by AuthContext
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        {/* Brand Header */}
        <View style={styles.logoContainer}>
          <Text style={styles.title}>Join MenuVerse ✨</Text>
          <Text style={styles.subtitle}>Create your account for Smart To-Do Management</Text>
        </View>

        {/* Register Form */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Create Account</Text>
          <Text style={styles.cardSub}>Fast, secure user authentication</Text>

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <CustomInput
            label="Full Name *"
            placeholder="Rupesh Bodineni"
            value={name}
            onChangeText={(text) => {
              clearError();
              setName(text);
            }}
            leftIcon={<Text style={{ fontSize: 16 }}>👤</Text>}
          />

          <CustomInput
            label="Email Address *"
            placeholder="you@example.com"
            value={email}
            onChangeText={(text) => {
              clearError();
              setEmail(text);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Text style={{ fontSize: 16 }}>✉️</Text>}
          />

          <CustomInput
            label="Password *"
            placeholder="At least 6 characters"
            value={password}
            onChangeText={(text) => {
              clearError();
              setPassword(text);
            }}
            secureTextEntry
            leftIcon={<Text style={{ fontSize: 16 }}>🔒</Text>}
          />

          <CustomInput
            label="Confirm Password *"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            leftIcon={<Text style={{ fontSize: 16 }}>🔑</Text>}
          />

          <CustomButton
            title="Register Account"
            onPress={handleRegister}
            isLoading={isLoading}
            style={{ marginTop: SPACING.md }}
          />
        </View>

        {/* Login Link */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    marginTop: SPACING.lg,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
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
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
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
});
