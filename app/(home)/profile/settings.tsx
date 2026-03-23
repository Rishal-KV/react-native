import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../../hooks/useTheme';
import { useAuth } from '../../../context/AuthContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { isDark, toggleTheme, colors } = useTheme();
  const { logout } = useAuth();

  const confirmLogout = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Sign Out", style: "destructive", onPress: logout }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>App Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={[styles.settingRow, { borderBottomColor: colors.border }]} activeOpacity={0.8} onPress={toggleTheme}>
          <View style={styles.settingRowLeft}>
            <View style={[styles.iconContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
              <Ionicons name={isDark ? "moon" : "sunny"} size={22} color={isDark ? '#F5DD4B' : '#FFA500'} />
            </View>
            <Text style={[styles.settingText, { color: colors.text }]}>Dark Mode</Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#D1D1D6', true: '#E50914' }}
            thumbColor={'#FFF'}
            ios_backgroundColor="#D1D1D6"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutRow} activeOpacity={0.8} onPress={confirmLogout}>
          <Ionicons name="log-out" size={24} color="#E50914" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
  },
  settingRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 17,
    fontWeight: '600',
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    marginTop: 32,
    gap: 12,
  },
  logoutText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E50914',
  }
});
