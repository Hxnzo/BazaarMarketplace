import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { auth } from '../firebase';

const Products  = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const userId = auth.currentUser.uid;

  const fetchProducts = async () => {
    try {
      const response = await fetch(`http://10.0.2.2:3001/api/products?userId=${userId}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  const renderProduct = ({ item }) => (
    <View style={styles.productBox}>
      <View style={styles.productInfo}>
        <Text style={styles.productTitle}>{item.title}</Text>
        <Text style={styles.productDescription}>{item.description}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
      </View>
      
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.productImage}
        onError={() => console.log("Error loading image:", item.imageUrl)}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Listings</Text>
      
      {products.length === 0 ? (
        <Text style={styles.noListings}>No listings</Text>
        ) : (
          <FlatList
            data={products}
            renderItem={renderProduct}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.list}
          />
        )}
      
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CreateProduct')}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
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
    marginBottom: 20,
    paddingTop: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#EEEEEE',
  },

  noListings: {
    fontSize: 20,
    color: '#EEEEEE',
    textAlign: 'center',
    marginTop: 50,
  },

  list: {
    paddingHorizontal: 20,
  },

  productBox: {
    flexDirection: 'row',
    backgroundColor: '#393E46',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },

  productInfo: {
    flex: 1,
    marginRight: 10,
  },

  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EEEEEE',
  },

  productDescription: {
    fontSize: 14,
    color: '#EEEEEE',
    marginVertical: 5,
  },

  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00ADB5',
  },

  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },

  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#00ADB5',
    borderRadius: 15,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },

  addButtonText: {
    color: '#000000',
    fontSize: 35,
  },
});

export default Products;