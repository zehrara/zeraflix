import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { userService } from '../services/api';

export default function ProfileScreen({ navigation }) {
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => { AsyncStorage.getItem('userId').then(id => setUserId(id || '')); }, []);

  const handleUpdateProfile = async () => {
    if (!name && !email) return Alert.alert('Hata', 'Ad veya e-posta girin.');
    setUpdating(true);
    try {
      const data = {};
      if (name) data.name = name;
      if (email) data.email = email;
      await userService.updateProfile(data);
      Alert.alert('Başarılı', 'Profil güncellendi.');
    } catch (e) {
      Alert.alert('Hata', e.response?.data?.error || 'Güncellenemedi.');
    } finally { setUpdating(false); }
  };

  const handleDeleteProfile = () => {
    Alert.alert(
      'Hesabı Sil',
      'Hesabını kalıcı olarak silmek istediğine emin misin?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil', style: 'destructive', onPress: async () => {
            try {
              await userService.deleteProfile();
              await AsyncStorage.removeItem('token');
              await AsyncStorage.removeItem('userId');
              navigation.replace('Login');
            } catch (e) {
              Alert.alert('Hata', e.response?.data?.error || 'Hesap silinemedi.');
            }
          }
        }
      ]
    );
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userId');
    navigation.replace('Login');
  };

  return (
    <View style={s.container}>
      <Text style={s.header}>Profil</Text>
      <View style={s.avatar}><Text style={s.avatarText}>👤</Text></View>
      <Text style={s.info}>Kullanıcı ID: {userId}</Text>

      <Text style={s.sectionTitle}>Profil Güncelle</Text>
      <TextInput style={s.input} placeholder="Yeni Ad" placeholderTextColor="#888" value={name} onChangeText={setName} />
      <TextInput style={s.input} placeholder="Yeni E-posta" placeholderTextColor="#888" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TouchableOpacity style={s.btn} onPress={handleUpdateProfile} disabled={updating}>
        {updating ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Güncelle</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
        <Text style={s.btnText}>Çıkış Yap</Text>
      </TouchableOpacity>
      <TouchableOpacity style={s.deleteBtn} onPress={handleDeleteProfile}>
        <Text style={s.btnText}>Hesabı Sil</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#141414', paddingTop: 50, padding: 24, alignItems: 'center' },
  header: { fontSize: 24, color: '#fff', fontWeight: 'bold', marginBottom: 16 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  avatarText: { fontSize: 48 },
  info: { color: '#aaa', fontSize: 14, marginBottom: 24 },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', alignSelf: 'flex-start', marginBottom: 8 },
  input: { backgroundColor: '#333', color: '#fff', borderRadius: 8, padding: 14, marginBottom: 12, fontSize: 16, width: '100%' },
  btn: { backgroundColor: '#E50914', borderRadius: 8, padding: 14, width: '100%', alignItems: 'center', marginBottom: 12 },
  logoutBtn: { backgroundColor: '#555', borderRadius: 8, padding: 14, width: '100%', alignItems: 'center', marginBottom: 12 },
  deleteBtn: { backgroundColor: '#8B0000', borderRadius: 8, padding: 14, width: '100%', alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
