import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, ActivityIndicator, Text } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading } = useAuth();
    const { colors } = useTheme();

    const handleLogin = async () => {
        if (email && password) {
            const success = await login(email, password);
            if (!success) {
                alert('Invalid email or password');
            }
        } else {
            alert('Please fill out all fields');
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
                <Text style={[styles.subtitle, { color: colors.textDim }]}>Log in to continue</Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, { color: colors.text }]}
                        placeholder="Email"
                        placeholderTextColor={colors.textDim}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={[styles.input, { color: colors.text }]}
                        placeholder="Password"
                        placeholderTextColor={colors.textDim}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
                    {isLoading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.buttonText}>Log In</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.linkButton} onPress={() => router.push('/register')}>
                    <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { flex: 1, padding: 24, justifyContent: 'center' },
    title: { 
        marginBottom: 8,
        fontSize: 32,
        fontWeight: 'bold',
        lineHeight: 32,
    },
    subtitle: { 
        marginBottom: 32, 
        fontSize: 16,
        lineHeight: 24,
    },
    inputContainer: { marginBottom: 24 },
    input: {
        backgroundColor: 'rgba(150, 150, 150, 0.15)',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#0a7ea4',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 16,
    },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    linkButton: { alignItems: 'center', padding: 8 },
    linkText: { color: '#0a7ea4', fontSize: 14, fontWeight: '500' },
});
