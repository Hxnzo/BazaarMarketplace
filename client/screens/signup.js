import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import axios from 'axios';

const Signup = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      // Create user with Firebase and get the UID
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Send user data to the backend to save in MongoDB
      await axios.post('http://10.0.2.2:3001/api/signup', {
        uid,
        firstName,
        lastName,
        email,
        city,
        province,
        phoneNumber,
      });

      console.log('User account created & saved in MongoDB!');
      navigation.replace('Home');
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps='handled'>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput style={styles.input} placeholder="First Name" placeholderTextColor="#EEEEEE" onChangeText={setFirstName} value={firstName} color="#EEEEEE" />
        <TextInput style={styles.input} placeholder="Last Name" placeholderTextColor="#EEEEEE" onChangeText={setLastName} value={lastName} color="#EEEEEE" />
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#EEEEEE" onChangeText={setEmail} value={email} keyboardType="email-address" autoCapitalize="none" color="#EEEEEE" />
        <TextInput style={styles.input} placeholder="City" placeholderTextColor="#EEEEEE" onChangeText={setCity} value={city} color="#EEEEEE" />
        <TextInput style={styles.input} placeholder="Province" placeholderTextColor="#EEEEEE" onChangeText={setProvince} value={province} color="#EEEEEE" />
        <TextInput style={styles.input} placeholder="Phone Number" placeholderTextColor="#EEEEEE" onChangeText={setPhoneNumber} value={phoneNumber} keyboardType="phone-pad" color="#EEEEEE" />
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#EEEEEE" onChangeText={setPassword} value={password} secureTextEntry color="#EEEEEE" />
        <TextInput style={styles.input} placeholder="Confirm Password" placeholderTextColor="#EEEEEE" onChangeText={setConfirmPassword} value={confirmPassword} secureTextEntry color="#EEEEEE" />
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
          <Text style={styles.link}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#222831',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#EEEEEE',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#393E46',
    marginBottom: 20,
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  button: {
    backgroundColor: '#00ADB5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#EEEEEE',
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
    color: '#00ADB5',
  },
});

export default Signup;