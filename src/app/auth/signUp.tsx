import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Alert, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { useDispatch } from 'react-redux';
import { signUp } from '~/src/redux/slices/authSlice';
import { AppDispatch, RootState } from '~/src/redux/store';
import Icon from 'react-native-vector-icons/FontAwesome';
import { router } from 'expo-router';
import { useSelector } from 'react-redux';

const SignUpComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: RootState) => state.auth.loading); // Select loading state

  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',  // Added fullName field
    location: { lat: 0, lon: 0 },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fetchUserLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied');
      return;
    }
    const location = await Location.getCurrentPositionAsync({});
    setUserData((prevData) => ({
      ...prevData,
      location: {
        lat: location.coords.latitude,
        lon: location.coords.longitude,
      },
    }));
  };

  const handleSignUp = async () => {
    if (userData.password !== userData.confirmPassword) {
      Alert.alert("Passwords don't match!");
      return;
    }
    try {
      await fetchUserLocation();
      await dispatch(signUp(userData)).unwrap();
      console.log('user data---->', userData)
    } catch (error) {
      console.error('Sign-up failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Icon name="user" color="#fff" size={100} style={styles.icon} />
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"  // Added placeholder for full name
        placeholderTextColor="#aaa"
        value={userData.fullName}
        onChangeText={(text) => setUserData({ ...userData, fullName: text })}  // Update fullName in state
      />

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#aaa"
        value={userData.username}
        onChangeText={(text) => setUserData({ ...userData, username: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={userData.email}
        onChangeText={(text) => setUserData({ ...userData, email: text })}
        keyboardType="email-address"
      />

      <View style={styles.passwordInputContainer}>
        <TextInput
          style={styles.inputWithIcon}
          placeholder="Password"
          placeholderTextColor="#aaa"
          value={userData.password}
          onChangeText={(text) => setUserData({ ...userData, password: text })}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity style={styles.iconContainer} onPress={() => setShowPassword(!showPassword)}>
          <Icon name={showPassword ? "eye" : "eye-slash"} size={20} color="#aaa" />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordInputContainer}>
        <TextInput
          style={styles.inputWithIcon}
          placeholder="Confirm Password"
          placeholderTextColor="#aaa"
          value={userData.confirmPassword}
          onChangeText={(text) => setUserData({ ...userData, confirmPassword: text })}
          secureTextEntry={!showConfirmPassword}
        />
        <TouchableOpacity style={styles.iconContainer} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <Icon name={showConfirmPassword ? "eye" : "eye-slash"} size={20} color="#aaa" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp} disabled={loading}>
        {
          loading ? (
            <ActivityIndicator size='small' color="#fff" /> // Show loading spinner
          ) : (
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          )
        }
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/auth/login')}>
        <Text style={styles.loginText}>Already have an account? Log In</Text>
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
    color: '#333',
    marginBottom: 15,
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
  signUpButton: {
    width: '100%',
    backgroundColor: '#4c669f',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginText: {
    color: '#fff',
    marginTop: 15,
    textDecorationLine: 'underline',
  },
});

export default SignUpComponent;
