import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useState } from 'react';

export default function App() {
  const [username, setUsername] = useState('');

  const onPressLearnMore = () => {
    Alert.alert('Hello ' + username);
  };

  return (
    <View style={styles.container}>
      <Text>Use Name</Text>
      <TextInput
        onChangeText={text => setUsername(text)}
        value={username}
        style={{ width: '90%', height: 50, backgroundColor: 'red' }}
      />
      <Button
        title="Click Here"
        color="#0000ff"
        onPress={onPressLearnMore}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    backgroundColor: 'white'
  },
});