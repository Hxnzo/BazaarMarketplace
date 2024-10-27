import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const Signin = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      console.log('User signed in!');
      navigation.navigate('Main');
    } 
    catch (error) {
      console.error(error);
      alert('Invalid credentials');
    }
  };  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#EEEEEE" onChangeText={setEmail} value={email} keyboardType="email-address" autoCapitalize="none" />

      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#EEEEEE" onChangeText={setPassword} value={password} secureTextEntry />

      <TouchableOpacity style={styles.button} onPress={handleSignin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#222831',
  },

  title: {
    fontSize: 34,
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
    color: '#EEEEEE', 
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
    padding: 10
  },
});

export default Signin;