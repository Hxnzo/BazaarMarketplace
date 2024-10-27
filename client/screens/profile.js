import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';
import { signOut, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';

const Profile = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    city: '',
    province: '',
    phoneNumber: '',
  });

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Signin'); 
    } 
    catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      const uid = auth.currentUser.uid;
      const response = await axios.get(`http://10.0.2.2:3001/api/user/${uid}`);

      setUser(response.data);
      setFormData(response.data);
    } 
    catch (error) {
      console.error('Error fetching user data:', error);
    } 
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleEditToggle = () => {
    setEditing(!editing);

    if (editing) {
      setFormData(user);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleSave = async () => {
    try {
      const uid = auth.currentUser.uid;
      const updatedData = { ...formData };
  
      // Reauthenticate with current password
      if (oldPassword) 
      {
        const credential = EmailAuthProvider.credential(auth.currentUser.email, oldPassword);
        await reauthenticateWithCredential(auth.currentUser, credential);
      } 
      else {
        alert('Please fill in \'Current Password\' field to make changes to email.');
        return;
      }
  
      // Check if the email was changed
      if (user.email !== formData.email) {
        await updateEmail(auth.currentUser, formData.email);
        updatedData.email = formData.email;
      }
  
      // Check if the password is being changed
      if (newPassword && newPassword === confirmPassword) {
        await updatePassword(auth.currentUser, newPassword);
        alert('Password updated successfully');
      } 
      else if (newPassword !== confirmPassword) {
        alert('New password and confirmation do not match');
        return;
      }
  
      // Update other fields in MongoDB
      await axios.put(`http://10.0.2.2:3001/api/user/${uid}`, updatedData);
      setUser(updatedData);

      alert('Profile updated successfully');
      setEditing(false);
    } 
    catch (error) 
    {
      console.error('Error updating profile:', error);
      alert(error.message);
    }
  };
  

  if (loading) {
    return <ActivityIndicator size="large" color="#00ADB5" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>

        <TextInput style={[styles.input, !editing && styles.readOnly]} placeholder="First Name" value={formData.firstName} onChangeText={(text) => setFormData({ ...formData, firstName: text })} editable={editing}/>

        <TextInput style={[styles.input, !editing && styles.readOnly]} placeholder="Last Name" value={formData.lastName} onChangeText={(text) => setFormData({ ...formData, lastName: text })} editable={editing}/>

        <TextInput style={[styles.input, !editing && styles.readOnly]} placeholder="Email" value={formData.email} onChangeText={(text) => setFormData({ ...formData, email: text })} editable={editing}/>

        <TextInput style={[styles.input, !editing && styles.readOnly]} placeholder="City" value={formData.city} onChangeText={(text) => setFormData({ ...formData, city: text })} editable={editing}/>

        <TextInput style={[styles.input, !editing && styles.readOnly]} placeholder="Province" value={formData.province} onChangeText={(text) => setFormData({ ...formData, province: text })} editable={editing}/>

        <TextInput style={[styles.input, !editing && styles.readOnly]} placeholder="Phone Number" value={formData.phoneNumber} onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })} editable={editing}/>

        {editing && (
          <>
            <TextInput style={styles.input} placeholder="Current Password" value={oldPassword} onChangeText={setOldPassword} secureTextEntry/>
            <TextInput style={styles.input} placeholder="New Password" value={newPassword} onChangeText={setNewPassword} secureTextEntry/>
            <TextInput style={styles.input} placeholder="Confirm New Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry/>
          </>
        )}

        {editing ? 
        (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleEditToggle}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : 
        (
          <TouchableOpacity style={[styles.button, styles.editButton]} onPress={handleEditToggle}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#222831',
  },

  scrollView: {
    backgroundColor: '#222831',
  },

  container: { 
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#222831',
    alignItems: 'center',
  },

  title: { 
    fontSize: 28, 
    marginBottom: 20, 
    color: '#EEEEEE', 
    textAlign: 'center', 
    fontWeight: 'bold' 
  },

  input: {
    width: '90%',
    borderColor: '#393E46',
    borderWidth: 1,
    marginBottom: 15,
    padding: 12,
    borderRadius: 8,
    color: '#EEEEEE',
    backgroundColor: '#333',
  },

  readOnly: {
    backgroundColor: '#2d2d2d',
    color: '#888',
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginVertical: 10,
  },

  button: {
    width: '48%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },

  saveButton: {
    backgroundColor: '#00ADB5',
  },

  cancelButton: {
    backgroundColor: '#FF6B6B',
  },

  editButton: {
    backgroundColor: '#007b83',
    width: '90%',
    marginVertical: 10,
  },

  signOutButton: {
    backgroundColor: 'black',
    width: '90%',
    marginVertical: 10,
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
  },

  signOutButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: 'bold',
  },

  buttonText: {
    color: '#EEEEEE',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Profile;