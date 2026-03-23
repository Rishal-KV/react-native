import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useTheme } from '../../../hooks/useTheme';
import { useAuth } from '../../../context/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { user, watchlist, logout, updateProfileName } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(user?.name || '');

  const handleEdit = async () => {
    if (isEditing) {
      if (tempName.trim()) {
        await updateProfileName(tempName.trim());
      }
    } else {
      setTempName(user?.name || '');
    }
    setIsEditing(!isEditing);
  };

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

  const menuItems = [
    { id: 1, title: 'App Settings', icon: 'settings-outline', route: '/profile/settings' },
    { id: 2, title: 'Account Details', icon: 'person-outline', route: null },
    { id: 3, title: 'Help & Support', icon: 'help-circle-outline', route: null },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Profile Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200' }}
            style={[styles.avatar, { borderColor: colors.primary }]}
          />
          {isEditing ? (
            <TextInput
              style={[styles.nameInput, { color: colors.text, borderColor: colors.border }]}
              value={tempName}
              onChangeText={setTempName}
              autoFocus
            />
          ) : (
            <Text style={[styles.name, { color: colors.text }]}>{user?.name || 'Guest'}</Text>
          )}
          <Text style={[styles.email, { color: colors.textDim }]}>{user?.email || 'Not Signed In'}</Text>
          <TouchableOpacity style={[styles.editButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', borderColor: isEditing ? colors.primary : colors.border }]} activeOpacity={0.8} onPress={handleEdit}>
            <Text style={[styles.editButtonText, { color: isEditing ? colors.primary : colors.text }]}>
              {isEditing ? 'Save Profile' : 'Edit Profile'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.statsContainer, { borderBottomColor: colors.border }]}>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: colors.text }]}>{user ? watchlist?.length || 0 : 0}</Text>
            <Text style={[styles.statLabel, { color: colors.textDim }]}>Watchlist</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {user ? (watchlist?.reduce((acc, m) => acc + (m.runtime || 120), 0) / 60).toFixed(1) : '0.0'}h
            </Text>
            <Text style={[styles.statLabel, { color: colors.textDim }]}>Watching Hours</Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, { borderBottomColor: colors.border }]}
              activeOpacity={0.7}
              onPress={() => item.route && router.push(item.route as any)}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: isDark ? 'rgba(229, 9, 20, 0.1)' : 'rgba(229, 9, 20, 0.05)' }]}>
                  <Ionicons name={item.icon as any} size={22} color={colors.primary} />
                </View>
                <Text style={[styles.menuItemText, { color: colors.text }]}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textDim} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.primary, shadowColor: colors.primary }]} activeOpacity={0.8} onPress={confirmLogout}>
          <Ionicons name="log-out-outline" size={22} color="#FFF" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    marginBottom: 16,
  },
  name: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  nameInput: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
    borderBottomWidth: 1,
    paddingVertical: 4,
    minWidth: 150,
    textAlign: 'center',
  },
  email: {
    fontSize: 15,
    marginBottom: 24,
  },
  editButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 100,
    borderWidth: 1,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 40,
  },
  menuContainer: {
    paddingTop: 16,
    paddingHorizontal: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginHorizontal: 24,
    marginTop: 40,
    marginBottom: 40,
    paddingVertical: 18,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
