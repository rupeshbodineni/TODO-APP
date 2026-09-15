import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const STORAGE_KEYS = {
  TOKEN: 'todo_auth_token',
  API_URL: 'todo_custom_api_url',
};

// Default API URL based on platform (10.0.2.2 for Android Emulator, localhost for iOS/Metro)
const DEFAULT_BASE_URL = Platform.OS === 'android' 
  ? 'http://10.0.2.2:5000/api' 
  : 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: DEFAULT_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT auth token
apiClient.interceptors.request.use(
  async (config) => {
    // Check if user specified a custom API Base URL
    const customUrl = await AsyncStorage.getItem(STORAGE_KEYS.API_URL);
    if (customUrl) {
      config.baseURL = customUrl;
    }

    const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const setAuthToken = async (token: string | null): Promise<void> => {
  if (token) {
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
  } else {
    await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
  }
};

export const getStoredToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
};

export const setCustomApiUrl = async (url: string): Promise<void> => {
  if (url) {
    await AsyncStorage.setItem(STORAGE_KEYS.API_URL, url);
    apiClient.defaults.baseURL = url;
  } else {
    await AsyncStorage.removeItem(STORAGE_KEYS.API_URL);
    apiClient.defaults.baseURL = DEFAULT_BASE_URL;
  }
};

export const getCustomApiUrl = async (): Promise<string> => {
  const custom = await AsyncStorage.getItem(STORAGE_KEYS.API_URL);
  return custom || DEFAULT_BASE_URL;
};

export default apiClient;
