import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const ViewProduct = ({ route, navigation }) => {
  const { product } = route.params;
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`http://10.0.2.2:3001/api/user/${product.userId}`);
      
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        console.error('Error fetching user data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <FontAwesome name="arrow-left" size={20} color="#222831" />
      </TouchableOpacity>

      {/* Product Image */}
      <Image source={{ uri: product.imageUrl }} style={styles.productImage} />

      {/* Product Title and Price */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>${product.price}</Text>
      </View>

      {/* Product Description */}
      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.description}>{product.description}</Text>

      {/* Product Location */}
      <Text style={styles.sectionTitle}>Location</Text>
      <Text style={styles.location}>{product.location}</Text>

      {/* User Information */}
      {userData && (
        <View style={styles.userContainer}>
          <FontAwesome name="user-circle" size={50} color="#EEEEEE" style={styles.userIcon} />
          <Text style={styles.userName}>{userData.firstName} {userData.lastName}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222831',
    padding: 20,
  },

  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    zIndex: 1,
    backgroundColor: '#00ADB5',
    padding: 10,
    borderRadius: 8,
  },

  productImage: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginTop: 60,
    marginBottom: 20,
    resizeMode: 'contain',
  },

  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EEEEEE',
    flex: 1,
    flexWrap: 'wrap',
  },

  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00ADB5',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00ADB5',
    marginTop: 10,
    marginBottom: 5,
  },

  description: {
    fontSize: 16,
    color: '#EEEEEE',
    marginBottom: 15,
  },

  location: {
    fontSize: 16,
    color: '#EEEEEE',
    marginBottom: 20,
  },

  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },

  userIcon: {
    marginRight: 10,
  },

  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EEEEEE',
  },
});

export default ViewProduct;