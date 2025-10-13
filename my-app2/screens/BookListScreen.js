import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Image,
    TouchableOpacity,
    Alert,
    TextInput,
} from 'react-native';
import { API_URL } from '../App'; // Import URL từ file App.js

// ====================================================================
// SUB-COMPONENTS & ICONS
// ====================================================================

const DeleteIcon = () => (
    <Text style={{ color: '#E53E3E', fontSize: 24 }}>🗑️</Text>
);
const EditIcon = () => (
    <Text style={{ color: '#3182CE', fontSize: 24 }}>✏️</Text>
);
const CloseIcon = () => (
    <Text style={{ color: '#4A5568', fontSize: 24, fontWeight: 'bold' }}>✕</Text>
);

// Component hiển thị từng mục sách
const BookItem = ({ item, onEdit, onDelete }) => (
    <View style={styles.card}>
        <View style={styles.headerContainer}>
            <Image
                style={styles.avatar}
                source={{
                    uri: item.avatar || 'https://placehold.co/100x100/3182CE/ffffff?text=Book',
                }}
                resizeMode="cover"
            />
            <View style={styles.textContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.author}>{item.author}</Text>
                <Text style={styles.price}>
                    {item.price ? parseFloat(item.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                </Text>
            </View>
            <View style={styles.iconContainer}>
                <TouchableOpacity onPress={() => onDelete(item.id, item.name)} style={styles.iconButton}>
                    <DeleteIcon />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onEdit(item)} style={styles.iconButton}>
                    <EditIcon />
                </TouchableOpacity>
            </View>
        </View>
        <Text style={styles.description} numberOfLines={3}>
            {item.description || 'Không có mô tả cho mục này.'}
        </Text>
    </View>
);

// Màn hình chi tiết/chỉnh sửa sách
const BookDetailsScreen = ({ book, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        id: book.id,
        name: book.name || '',
        author: book.author || '',
        price: book.price ? book.price.toString() : '0.00',
        description: book.description || '',
        avatar: book.avatar || '',
    });
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    const handlePressSave = () => {
        const dataToSave = {
            ...formData,
            price: parseFloat(formData.price.replace(/,/g, '') || '0')
        };
        onSave(dataToSave);
    };

    return (
        <View style={detailStyles.container}>
            <View style={detailStyles.header}>
                <Text style={detailStyles.title}>
                    {book.id ? 'Cập nhật Sách' : 'Thêm Sách Mới'}
                </Text>
                <TouchableOpacity onPress={onCancel} style={detailStyles.closeButton}>
                    <CloseIcon />
                </TouchableOpacity>
            </View>
            <TextInput style={detailStyles.input} value={formData.name} onChangeText={(text) => handleChange('name', text)} placeholder="Tên Sách/Người" />
            <TextInput style={detailStyles.input} value={formData.author} onChangeText={(text) => handleChange('author', text)} placeholder="Tác giả/Chi tiết phụ" />
            <TextInput style={detailStyles.input} value={formData.price} onChangeText={(text) => handleChange('price', text)} placeholder="Giá/Số liệu (ví dụ: 688.40)" keyboardType="numeric" />
            <TextInput style={detailStyles.input} value={formData.avatar} onChangeText={(text) => handleChange('avatar', text)} placeholder="URL Hình ảnh (Avatar)" />
            <TextInput style={[detailStyles.input, detailStyles.descriptionInput]} value={formData.description} onChangeText={(text) => handleChange('description', text)} placeholder="Mô tả chi tiết" multiline numberOfLines={4} />
            <TouchableOpacity style={detailStyles.saveButton} onPress={handlePressSave}>
                <Text style={detailStyles.saveButtonText}>Lưu</Text>
            </TouchableOpacity>
        </View>
    );
};


// ====================================================================
// COMPONENT CHÍNH: BOOK LIST SCREEN (PRODUCT)
// ====================================================================
/**
 * Màn hình danh sách sách (Product Component).
 * @param {object} userInfo - Thông tin đăng nhập được truyền từ App.js (Props).
 * @param {function} onLogout - Hàm đăng xuất được truyền từ App.js (Props).
 */
export default function BookListScreen({ userInfo, onLogout }) {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);

    // Quản lý trạng thái hiển thị: 'list' | 'edit'
    const [viewState, setViewState] = useState('list');
    const [selectedBook, setSelectedBook] = useState(null);

    // Hàm tải dữ liệu từ API
    const fetchBooks = async () => {
        setLoading(true);

        const headers = { 'Content-Type': 'application/json' };
        if (userInfo?.token) {
            // Gửi token xác thực nếu có
            headers['Authorization'] = `Bearer ${userInfo.token}`;
        }

        try {
            const response = await fetch(API_URL, { headers });
            if (!response.ok) {
                throw new Error(`HTTP status: ${response.status}`);
            }
            const json = await response.json();
            if (Array.isArray(json)) {
                setBooks(json);
            } else {
                throw new Error("API did not return an array.");
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu:', error.message);
            Alert.alert(
                'Lỗi Kết Nối',
                'Không thể tải dữ liệu từ MockAPI. Vui lòng kiểm tra lại URL API.'
            );
        } finally {
            setLoading(false);
        }
    };

    // Tải dữ liệu khi component được mount
    useEffect(() => {
        fetchBooks();
    }, []); // Chỉ gọi 1 lần khi màn hình list load lần đầu

    // Hàm CRUD
    const handleEditBook = (book) => {
        setSelectedBook(book);
        setViewState('edit');
    };

    const handleAddNew = () => {
        setSelectedBook({ id: null, name: '', author: '', price: '0.00', description: '', avatar: '' });
        setViewState('edit');
    };

    const handleDeleteBook = (bookId, bookName) => {
        Alert.alert(
            'Xác nhận Xóa',
            `Bạn chắc chắn muốn xóa mục "${bookName}"?`,
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const response = await fetch(`${API_URL}/${bookId}`, { method: 'DELETE' });
                            if (!response.ok) { throw new Error(`Status: ${response.status}`); }
                            Alert.alert('Thành công', `Đã xóa mục "${bookName}".`);
                            fetchBooks();
                        } catch (error) {
                            Alert.alert('Lỗi', `Không thể xóa mục.`);
                        }
                    },
                },
            ]
        );
    };

    const handleSaveBook = async (bookData) => {
        const isNew = !bookData.id;
        const method = isNew ? 'POST' : 'PUT';
        const url = isNew ? API_URL : `${API_URL}/${bookData.id}`;
        const payload = isNew ? { ...bookData, id: undefined } : bookData;

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Status: ${response.status}`);
            }

            Alert.alert('Thành công', isNew ? 'Đã thêm sách mới.' : 'Đã cập nhật sách.');
            setViewState('list'); // Quay lại danh sách
            fetchBooks();
        } catch (error) {
            console.error('Lỗi khi lưu:', error.message);
            Alert.alert('Lỗi', `Không thể lưu dữ liệu.`);
        }
    };

    // ====================================================================
    // RENDER THE VIEW
    // ====================================================================

    if (viewState === 'edit' && selectedBook) {
        return (
            <BookDetailsScreen
                book={selectedBook}
                onSave={handleSaveBook}
                onCancel={() => setViewState('list')}
            />
        );
    }

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#3182CE" />
                <Text style={{ marginTop: 10, color: '#4A5568' }}>Đang tải dữ liệu sách...</Text>
            </View>
        );
    }

    // Màn hình chính (list)
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Quản Lý Dữ Liệu Sách</Text>

            {/* HIỂN THỊ THÔNG TIN NGƯỜI DÙNG TỪ PROPS */}
            {userInfo && (
                <View style={styles.userInfoContainer}>
                    <Text style={styles.welcomeText}>
                        Xin chào: {userInfo.username} ({userInfo.role})
                    </Text>
                    <TouchableOpacity onPress={onLogout}>
                        <Text style={styles.logoutText}>[Đăng xuất]</Text>
                    </TouchableOpacity>
                </View>
            )}

            <FlatList
                data={books}
                keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
                renderItem={({ item }) => (
                    <BookItem
                        item={item}
                        onEdit={handleEditBook}
                        onDelete={handleDeleteBook}
                    />
                )}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={() => (
                    <View style={styles.centerContainer}>
                        <Text style={styles.emptyText}>Không tìm thấy dữ liệu nào.</Text>
                        <TouchableOpacity onPress={fetchBooks} style={styles.reloadButton}>
                            <Text style={styles.reloadText}>Tải lại</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />

            <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
        </View>
    );
}

// ====================================================================
// STYLES
// ====================================================================

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7FAFC',
        // paddingTop: 30, (Đã chuyển lên SafeAreaView của App.js)
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#F7FAFC',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 100,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#2D3748',
    },
    userInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        paddingBottom: 8,
    },
    welcomeText: {
        fontSize: 14,
        color: '#38A169',
        fontWeight: '600',
    },
    logoutText: {
        color: '#E53E3E',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderLeftWidth: 4,
        borderLeftColor: '#3182CE',
    },
    headerContainer: {
        flexDirection: 'row',
        marginBottom: 8,
        alignItems: 'flex-start',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    textContainer: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A202C',
    },
    author: {
        fontSize: 14,
        color: '#718096',
        marginBottom: 4,
    },
    price: {
        fontSize: 18,
        fontWeight: '900',
        color: '#48BB78',
    },
    description: {
        fontSize: 14,
        color: '#4A5568',
        lineHeight: 20,
        marginTop: 8,
    },
    iconContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginLeft: 10,
    },
    iconButton: {
        padding: 8,
        marginBottom: 4,
    },
    addButton: {
        position: 'absolute',
        bottom: 30,
        right: 30, // Đặt ở góc dưới bên phải
        backgroundColor: '#3182CE',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    addButtonText: {
        color: 'white',
        fontSize: 35,
        lineHeight: 35,
        fontWeight: '300',
    },
    emptyText: {
        fontSize: 16,
        color: '#718096',
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 10,
    },
    reloadButton: {
        backgroundColor: '#4299E1',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    reloadText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

const detailStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7FAFC',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingTop: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2D3748',
    },
    closeButton: {
        padding: 5,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        fontSize: 16,
        color: '#1A202C',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    descriptionInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    saveButton: {
        backgroundColor: '#3182CE',
        padding: 15,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
