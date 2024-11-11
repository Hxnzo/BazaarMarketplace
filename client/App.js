import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import Signin from './screens/signin';
import Signup from './screens/signup';
import Home from './screens/home';
import PostProduct from './screens/products';
import Profile from './screens/profile';
import CreateProduct from './screens/createProduct';
import EditProduct from './screens/editProduct';
import { Ionicons } from '@expo/vector-icons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator initialRouteName="Home" screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Post') iconName = 'add-circle';
          else if (route.name === 'Profile') iconName = 'person';
          return <Ionicons name={iconName} size={size} color={color} />;
        },

        tabBarActiveTintColor: '#00ADB5',
        tabBarInactiveTintColor: '#EEEEEE',
        headerShown: false,
        tabBarStyle: { backgroundColor: '#222831' },
      })}>

      <Tab.Screen name="Home" component={ScreenWrapper(Home)} />
      <Tab.Screen name="Post" component={ScreenWrapper(PostProduct)} />
      <Tab.Screen name="Profile" component={ScreenWrapper(Profile)} />
    </Tab.Navigator>
  );
}

function ScreenWrapper(ScreenComponent) {
  return (props) => (
    <View style={styles.globalContainer}>
      <ScreenComponent {...props} />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Signin" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Signin" component={ScreenWrapper(Signin)} />
        <Stack.Screen name="Signup" component={ScreenWrapper(Signup)} />
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="CreateProduct" component={ScreenWrapper(CreateProduct)} />
        <Stack.Screen name="EditProduct" component={ScreenWrapper(EditProduct)} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  globalContainer: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
    backgroundColor: '#222831',
  },
});
