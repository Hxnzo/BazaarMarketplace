import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Home = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Marketplace</Text>
      <Text style={styles.infoText}>SEE ALL AD POSTINGS HERE!</Text>
      <Text style={{ color:'#EEEEEE' }}>Development In Progress</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
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

  infoText: {
    fontSize: 20,
    marginBottom: 10,
    paddingTop: 20,
    textAlign: 'center',
    fontWeight: 'bold',
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
});

export default Home;