import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { auth } from '../firebase';

const Home = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const userId = auth.currentUser.uid;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`http://10.0.2.2:3001/api/products/others?userId=${userId}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error fetching products:', errorText);
        return;
      }
  
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const handleProductPress = (product) => {
    navigation.navigate('ViewProduct', { product });
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity onPress={() => handleProductPress(item)}>
      <View style={styles.productBox}>
        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>{item.title}</Text>
          <Text style={styles.productDescription}>{item.description}</Text>
          <Text style={styles.productPrice}>${item.price}</Text>
        </View>

        <Image source={{ uri: item.imageUrl }} style={styles.productImage} onError={() => console.log("Error loading image:", item.imageUrl)}/>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Marketplace</Text>
      
      <TextInput style={styles.searchBar} placeholder="Search for products..." placeholderTextColor="#888" value={searchQuery} onChangeText={handleSearch}/>

      {filteredProducts.length === 0 ? (
          <Text style={styles.noListings}>No listings found</Text>
        ) : (
          <FlatList
            data={filteredProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.list}
          />
        )}
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

  searchBar: {
    backgroundColor: '#EEEEEE',
    color: '#393E46',
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
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
});

export default Home;