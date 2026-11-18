import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { User } from '../types';

type LoginScreenProps = {
  onLogin: (user: User) => void;
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [fullName, setFullName] = useState('');
  const [section, setSection] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!fullName.trim()) {
      setError('Please enter your name.');
      return;
    }
    setError('');
    onLogin({
      fullName: fullName.trim(),
      section: section.trim() || 'BSIT-3A',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoCircle}>
        <Text style={styles.logoText}>S</Text>
      </View>
      <Text style={styles.brandTitle}>StudySpot</Text>
      <Text style={styles.brandSubtitle}>Find and book a campus study space</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Full name</Text>
        <TextInput
          style={[styles.input, !!error && styles.inputError]}
          placeholder="Enter your name"
          value={fullName}
          onChangeText={(text) => {
            setFullName(text);
            if (error) setError('');
          }}
          autoCapitalize="words"
        />
        {!!error && <Text style={styles.errorText}>{error}</Text>}

        <Text style={styles.label}>Section</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., BSIT-3A"
          value={section}
          onChangeText={setSection}
        />

        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Log In</Text>
        </Pressable>

        <Text style={styles.hintText}>Any non-empty name works (simulated sign-in).</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logoCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#1A1751',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1751',
  },
  brandSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 30,
  },
  form: {
    width: '100%',
    maxWidth: 360,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    fontSize: 15,
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    height: 48,
    backgroundColor: '#1A1751',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  hintText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 14,
  },
});