import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Import các màn hình đã tách
import LoginScreen from './screens/LoginScreen';
import BookListScreen from './screens/BookListScreen';

// URL API Mock (dùng chung cho toàn ứng dụng)
// URL API quản lý sách (CRUD)
export const API_URL = 'https://68ed21bbeff9ad3b1404af32.mockapi.io/api/books';
// URL API đăng nhập giả lập
export const LOGIN_API_URL = 'https://68ed21bbeff9ad3b1404af32.mockapi.io/api/login-mock';


// ====================================================================
// COMPONENT CHÍNH CỦA ỨNG DỤNG
// ====================================================================
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  // Quản lý trạng thái hiển thị: 'login' | 'list'
  const [currentView, setCurrentView] = useState('login');

  // Hàm nhận thông tin đăng nhập từ LoginScreen (Props)
  const handleLogin = (user) => {
    setUserInfo(user);
    setIsLoggedIn(true);
    setCurrentView('list'); // Chuyển sang màn hình danh sách
  };

  const handleLogout = () => {
    // Xử lý đăng xuất đơn giản
    setUserInfo(null);
    setIsLoggedIn(false);
    setCurrentView('login'); // Quay lại màn hình đăng nhập
  };

  // ====================================================================
  // RENDER GIAO DIỆN CHÍNH (ROUTER)
  // ====================================================================

  if (currentView === 'login') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        {/* Truyền handleLogin xuống LoginScreen qua Props */}
        <LoginScreen onLogin={handleLogin} />
      </SafeAreaView>
    );
  }

  if (currentView === 'list' && isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        {/* Truyền userInfo và handleLogout xuống BookListScreen qua Props */}
        <BookListScreen
          userInfo={userInfo}
          onLogout={handleLogout}
        />
      </SafeAreaView>
    );
  }

  // Màn hình loading hoặc lỗi mặc định
  return (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color="#3182CE" />
      <Text style={{ marginTop: 10, color: '#4A5568' }}>Đang tải ứng dụng...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
    paddingTop: 30, // Đảm bảo nội dung không bị che bởi status bar
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
  },
});
