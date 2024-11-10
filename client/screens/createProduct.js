import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth } from '../firebase';

const CreateProduct = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const pickImageAsync = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleSaveProduct = async () => {
    // Validation
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Please enter a valid title.');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Validation Error', 'Please enter a valid description.');
      return;
    }

    if (!price || isNaN(price) || parseFloat(price) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid price greater than zero.');
      return;
    }

    if (!location.trim()) {
      Alert.alert('Validation Error', 'Please enter a valid location.');
      return;
    }

    if (!selectedImage) {
      Alert.alert('Validation Error', 'Please select an image.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', parseFloat(price)); // Convert price to a number
    formData.append('location', location);
    formData.append('userId', auth.currentUser.uid);
    formData.append('image', {
      uri: selectedImage,
      name: selectedImage.split('/').pop(),
      type: `image/${selectedImage.split('.').pop()}`,
    });

    try {
      const response = await fetch('http://10.0.2.2:3001/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: formData,
      });

      if (response.ok) {
        Alert.alert('Success', 'Product added successfully');
        navigation.goBack();
      } else {
        console.error('Error adding product:', response.statusText);
        Alert.alert('Error', 'There was an issue adding the product.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'There was an error with the server.');
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Ad</Text>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Title</Text>
        <TextInput style={styles.input} placeholder="Title" placeholderTextColor="#EEEEEE" value={title} onChangeText={setTitle}/>

        <Text style={styles.label}>Description</Text>
        <TextInput style={styles.input} placeholder="Description" placeholderTextColor="#EEEEEE" value={description} onChangeText={setDescription}/>

        <Text style={styles.label}>Price</Text>
        <TextInput style={styles.input} placeholder="Price" placeholderTextColor="#EEEEEE" keyboardType="numeric" value={price} onChangeText={setPrice}/>

        <Text style={styles.label}>Location</Text>
        <TextInput style={styles.input} placeholder="Location" placeholderTextColor="#EEEEEE" value={location} onChangeText={setLocation}/>

        <TouchableOpacity onPress={pickImageAsync} style={styles.imageButton}>
          <Text style={styles.imageButtonText}>Select Image</Text>
        </TouchableOpacity>

        {selectedImage && (
          <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
        )}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProduct}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222831',
  },

  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#EEEEEE',
    textAlign: 'center',
    paddingTop: 40,
  },

  content: {
    padding: 20,
  },

  label: {
    fontSize: 16,
    color: '#00ADB5',
  },

  input: {
    backgroundColor: '#393E46',
    color: '#EEEEEE',
    padding: 10,
    marginVertical: 10,
    borderRadius: 8,
  },
  
  imageButton: {
    backgroundColor: '#00ADB5',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },

  imageButtonText: {
    color: '#EEEEEE',
    fontSize: 16,
    fontWeight: 'bold',
  },

  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 10,
    resizeMode: 'contain',
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  saveButton: {
    backgroundColor: '#00ADB5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '48%',
  },

  saveButtonText: {
    color: '#EEEEEE',
    fontSize: 16,
    fontWeight: 'bold',
  },

  cancelButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '48%',
  },

  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateProduct;