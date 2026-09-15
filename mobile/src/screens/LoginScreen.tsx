import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { getCustomApiUrl, setCustomApiUrl } from '../api/client';
import { styles } from './LoginScreen.styles';

export const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { login, isLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [serverModalVisible, setServerModalVisible] = useState(false);
  const [customUrl, setCustomUrl] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Validation Error', 'Please enter email and password');
      return;
    }

    await login(email.trim(), password);
  };

  const handleFillDemoUser = () => {
    setEmail('rupesh@example.com');
    setPassword('password123');
  };

  const openServerConfig = async () => {
    const current = await getCustomApiUrl();
    setCustomUrl(current);
    setServerModalVisible(true);
  };

  const saveServerConfig = async () => {
    await setCustomApiUrl(customUrl.trim());
    setServerModalVisible(false);
    Alert.alert('Config Saved', `API server URL updated to: ${customUrl.trim()}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <TouchableOpacity style={styles.configButton} onPress={openServerConfig}>
          <Text style={styles.configButtonText}>⚙️ Server API Settings</Text>
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoText}>⚡</Text>
          </View>
          <Text style={styles.title}>MenuVerse To-Do</Text>
          <Text style={styles.subtitle}>FastAPI + MySQL Smart Task Master</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome Back</Text>
          <Text style={styles.cardSub}>Sign in to sync your smart tasks</Text>

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <CustomInput
            label="Email Address"
            placeholder="you@example.com"
            value={email}
            onChangeText={(text) => {
              clearError();
              setEmail(text);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Text style={styles.icon}>✉️</Text>}
          />

          <CustomInput
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={(text) => {
              clearError();
              setPassword(text);
            }}
            secureTextEntry
            leftIcon={<Text style={styles.icon}>🔒</Text>}
          />

          <CustomButton
            title="Sign In"
            onPress={handleLogin}
            isLoading={isLoading}
            style={styles.signInButton}
          />

          <TouchableOpacity style={styles.demoButton} onPress={handleFillDemoUser}>
            <Text style={styles.demoButtonText}>💡 Auto-fill Test Credentials (rupesh@example.com)</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.linkText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={serverModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>API Server Endpoint</Text>
            <Text style={styles.modalDescription}>
              Configure API host (e.g. http://10.0.2.2:5000/api for Android Emulator or your PC LAN IP)
            </Text>

            <CustomInput
              label="Backend API Base URL"
              value={customUrl}
              onChangeText={setCustomUrl}
              placeholder="http://10.0.2.2:5000/api"
            />

            <View style={styles.modalButtonRow}>
              <CustomButton
                title="Cancel"
                variant="secondary"
                onPress={() => setServerModalVisible(false)}
                style={styles.cancelButton}
              />
              <CustomButton
                title="Save URL"
                onPress={saveServerConfig}
                style={styles.saveButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
