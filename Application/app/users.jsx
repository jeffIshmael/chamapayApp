import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import axios from 'axios';

const App = () => {
  const [users, setUsers] = useState([]);

  // Fetch users from the backend using axios
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Add a new user using axios
  const addUser = async () => {
    try {
      const response = await axios.post('http://localhost:3000/users', {
        name: 'New User',
        email: 'newuser@example.com',
      });
      setUsers((prevUsers) => [...prevUsers, response.data]);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <View>
      <Button title="Add User" onPress={addUser} />
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text>{item.name} - {item.email}</Text>
        )}
      />
    </View>
  );
};

export default App;
