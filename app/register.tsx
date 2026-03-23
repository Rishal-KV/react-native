import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, ActivityIndicator, Text } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { register, isLoading } = useAuth();
    const { colors } = useTheme();

    const handleRegister = async () => {
        if (name && email && password) {
            const success = await register(name, email, password);
            if (!success) {
                alert('Registration failed. User may already exist.');
            }
        } else {
            alert('Please fill out all fields');
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
                <Text style={[styles.subtitle, { color: colors.textDim }]}>Sign up to get started</Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, { color: colors.text }]}
                        placeholder="Full Name"
                        placeholderTextColor={colors.textDim}
                        value={name}
                        onChangeText={setName}
                    />
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

                <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={isLoading}>
                    {isLoading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.buttonText}>Sign Up</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.linkButton} onPress={() => router.replace('/login')}>
                    <Text style={styles.linkText}>Already have an account? Log In</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
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
    inputContainer: {
        marginBottom: 24,
    },
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
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    linkButton: {
        alignItems: 'center',
        padding: 8,
    },
    linkText: {
        color: '#0a7ea4',
        fontSize: 14,
        fontWeight: '500',
    },
});
