import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {

    console.log('Email:', email);
    console.log('Password:', password);
  }

    ;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>

        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require('./assets/logo.png')} // Thay đổi đường dẫn đến logo của bạn
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>


        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome!</Text>
          <Text style={styles.loginText}>Login Here</Text>
        </View>


        <View style={styles.formContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Your Email"
            placeholderTextColor="#C0C0C0"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Password"
            placeholderTextColor="#C0C0C0"

            onChangeText={setPassword}
            secureTextEntry
          />
        </View>


        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonLabel}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => console.log('Forgot Password')}>
            <Text style={styles.forgotPassword}>Forgot Password</Text>
          </TouchableOpacity>
        </View>


        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't Have an Account?</Text>

        </View>

        <View style={styles.signupContainer}>

          <TouchableOpacity onPress={() => console.log('Create New Account')}>

            <Text style={styles.signupLink}>Create New Account Now</Text>
          </TouchableOpacity>
        </View>



      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFEBF1',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    backgroundColor: '#FCE7F0',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    height: 300,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 40,
    color: '#600021',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#010101ff',
  },
  loginText: {
    fontSize: 22,
    color: '#010101ff',
  },
  formContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,

    color: '#600021',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fcf2f2ff',
    borderRadius: 10,
    height: 50,

    marginBottom: 20,
    paddingHorizontal: 15,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButton: {
    width: '30%',
    borderRadius: 10,
    backgroundColor: '#fc946aff',
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  loginButtonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000ff',
  },
  forgotPassword: {
    color: '#800026',
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signupText: {
    color: '#800026',
    marginRight: 5,
  },
  signupLink: {
    color: '#FF6347',
    fontWeight: 'bold',
  },
});