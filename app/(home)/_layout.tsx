import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';

export default function TabsLayout() {
    const { colors, isDark } = useTheme();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    position: 'absolute',
                    backgroundColor: 'transparent',
                    borderTopWidth: 0,
                    elevation: 0,
                    height: 64,
                    justifyContent: 'center', // centers items perfectly horizontally
                    alignItems: 'center',     // centers items perfectly vertically
                },
                tabBarItemStyle: {
                    flex: 0,
                    width: 64,
                    height: 64,
                    marginHorizontal: 10, // Adds gap between tabs!
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                tabBarBackground: () => (
                    <BlurView
                        tint={isDark ? "dark" : "light"}
                        intensity={85}
                        style={StyleSheet.absoluteFill}
                    />
                ),
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textDim,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="watchlist"
                options={{
                    title: "Watchlist",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="bookmark" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}