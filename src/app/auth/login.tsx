


// src/components/LogInComponent.tsx
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logIn } from '~/src/redux/slices/authSlice';
import { AppDispatch, RootState } from '~/src/redux/store';
import Icon from 'react-native-vector-icons/FontAwesome';
import { router } from 'expo-router';

const LogInComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: RootState) => state.auth.loading); // Select loading state
  const [credentials, setCredentials] = useState({
    usernameOrEmail: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleLogIn = async () => {
    try {
      await dispatch(logIn(credentials)).unwrap();
      // Navigate to another page on success
      router.replace('/main/myRobot');
    } catch (error) {
      console.error('Log-in failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Icon name="user" color="#fff" size={100} style={styles.icon} />
      <Text style={styles.title}>Log In</Text>

      <TextInput
        style={styles.input}
        placeholder="Username or Email"
        placeholderTextColor="#aaa"
        value={credentials.usernameOrEmail}
        onChangeText={(text) => setCredentials({ ...credentials, usernameOrEmail: text })}
      />

      <View style={styles.passwordInputContainer}>
        <TextInput
          style={styles.inputWithIcon}
          placeholder="Password"
          placeholderTextColor="#aaa"
          value={credentials.password}
          onChangeText={(text) => setCredentials({ ...credentials, password: text })}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity style={styles.iconContainer} onPress={() => setShowPassword(!showPassword)}>
          <Icon name={showPassword ? "eye" : "eye-slash"} size={20} color="#aaa" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logInButton} onPress={handleLogIn} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" /> // Show loading spinner
        ) : (
          <Text style={styles.logInButtonText}>Log In</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/auth/signUp')}>
        <Text style={styles.signUpText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3b5998',
    paddingHorizontal: 20,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: '#333',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 25,
    marginBottom: 15,
  },
  inputWithIcon: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    color: '#333',
  },
  iconContainer: {
    paddingHorizontal: 15,
  },
  logInButton: {
    width: '100%',
    backgroundColor: '#4c669f',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  logInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpText: {
    color: '#fff',
    marginTop: 15,
    textDecorationLine: 'underline',
  },
});

export default LogInComponent;
