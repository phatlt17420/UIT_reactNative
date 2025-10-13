import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator
} from 'react-native';
import { LOGIN_API_URL } from '../App'; // Import URL từ file App.js

/**
 * Component LoginScreen: Xử lý logic đăng nhập bằng API.
 * @param {function} onLogin - Hàm callback để truyền thông tin người dùng lên App.js.
 */
export default function LoginScreen({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLoginPress = async () => {
        if (!username || !password) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(LOGIN_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: username,
                    password: password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Đăng nhập thành công, giả lập dữ liệu trả về từ API
                const mockUserData = {
                    username: username,
                    role: 'Quản trị viên API',
                    loginTime: new Date().toLocaleTimeString(),
                    token: data.token || 'mock-jwt-token-12345', // Lấy token từ API nếu có
                };

                // Truyền thông tin người dùng (user info) lên component cha (App.js) qua Props
                onLogin(mockUserData);

            } else {
                // Đăng nhập thất bại (HTTP 401, 403, etc.)
                Alert.alert(
                    'Lỗi Đăng Nhập',
                    data.message || 'Tên đăng nhập hoặc mật khẩu không hợp lệ.'
                );
            }

        } catch (error) {
            console.error('Lỗi gọi API:', error);
            Alert.alert(
                'Lỗi Hệ Thống',
                'Không thể kết nối đến máy chủ đăng nhập. Vui lòng thử lại.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={loginStyles.container}>
            <Text style={loginStyles.title}>Đăng Nhập Hệ Thống (Dùng API)</Text>
            <TextInput
                style={loginStyles.input}
                placeholder="Tên đăng nhập (Email/Username)"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={loginStyles.input}
                placeholder="Mật khẩu"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TouchableOpacity
                style={loginStyles.loginButton}
                onPress={handleLoginPress}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={loginStyles.loginButtonText}>Đăng Nhập</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

// ====================================================================
// STYLES CHO LOGIN SCREEN
// ====================================================================
const loginStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EBF4FF',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#2B6CB0',
        marginBottom: 30,
    },
    input: {
        width: '100%',
        maxWidth: 350,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#BEE3F8',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    loginButton: {
        width: '100%',
        maxWidth: 350,
        backgroundColor: '#3182CE',
        padding: 15,
        borderRadius: 10,
        marginTop: 10,
        alignItems: 'center',
        shadowColor: '#3182CE',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
        minHeight: 50,
        justifyContent: 'center',
    },
    loginButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
