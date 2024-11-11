import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth } from '../firebase';

const EditProduct = ({ route, navigation }) => {
  const { product } = route.params;
  const [title, setTitle] = useState(product.title);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(String(product.price));
  const [location, setLocation] = useState(product.location);
  const [selectedImage, setSelectedImage] = useState(product.imageUrl);

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

  const handleUpdateProduct = async () => {
    if (!title.trim() || !description.trim() || isNaN(price) || parseFloat(price) <= 0 || !location.trim() || !selectedImage) {
      Alert.alert('Validation Error', 'Please fill all fields correctly.');
      return;
    }
  
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', parseFloat(price));
    formData.append('location', location);
    formData.append('userId', auth.currentUser.uid);
    
    // Check if the image was updated
    if (selectedImage !== product.imageUrl) {
      formData.append('image', {
        uri: selectedImage,
        name: selectedImage.split('/').pop(),
        type: `image/${selectedImage.split('.').pop()}`,
      });
    }
  
    try {
      const response = await fetch(`http://10.0.2.2:3001/api/products/${product._id}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
  
      if (response.ok) {
        Alert.alert('Success', 'Product updated successfully');
        navigation.goBack();
      } else {
        console.error('Error updating product:', response.statusText);
        Alert.alert('Error', 'Failed to update product');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'There was an error with the server.');
    }
  };
  

  const handleDeleteProduct = async () => {
    try {
      const response = await fetch(`http://10.0.2.2:3001/api/products/${product._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        Alert.alert('Success', 'Product deleted successfully');
        navigation.goBack();
      } else {
        console.error('Error deleting product:', response.statusText);
        Alert.alert('Error', 'Failed to delete product');
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
      <Text style={styles.title}>Edit Ad</Text>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Title</Text>
        <TextInput style={styles.input} placeholder="Title" placeholderTextColor="#EEEEEE" value={title} onChangeText={setTitle} />

        <Text style={styles.label}>Description</Text>
        <TextInput style={styles.input} placeholder="Description" placeholderTextColor="#EEEEEE" value={description} onChangeText={setDescription} />

        <Text style={styles.label}>Price</Text>
        <TextInput style={styles.input} placeholder="Price" placeholderTextColor="#EEEEEE" keyboardType="numeric" value={price} onChangeText={setPrice} />

        <Text style={styles.label}>Location</Text>
        <TextInput style={styles.input} placeholder="Location" placeholderTextColor="#EEEEEE" value={location} onChangeText={setLocation} />

        <TouchableOpacity onPress={pickImageAsync} style={styles.imageButton}>
          <Text style={styles.imageButtonText}>Select Image</Text>
        </TouchableOpacity>

        {selectedImage && (
          <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
        )}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleUpdateProduct}>
          <Text style={styles.saveButtonText}>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteProduct}>
          <Text style={styles.deleteButtonText}>Delete</Text>
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
    marginBottom: 5,
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
    width: '30%',
  },

  saveButtonText: {
    color: '#EEEEEE',
    fontSize: 16,
    fontWeight: 'bold',
  },

  deleteButton: {
    backgroundColor: '#000000', 
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '30%',
  },

  deleteButtonText: {
    color: '#FF6B6B', 
    fontSize: 16,
    fontWeight: 'bold',
  },

  cancelButton: {
    backgroundColor: '#FF6B6B', 
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '30%',
  },
  
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProduct;