import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen({ navigation }) {
  const [userId, setUserId] = useState('');

  useEffect(() => { AsyncStorage.getItem('userId').then(id => setUserId(id || '')); }, []);

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
      <TouchableOpacity style={s.btn} onPress={handleLogout}>
        <Text style={s.btnText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#141414', paddingTop: 50, padding: 24, alignItems: 'center' },
  header: { fontSize: 24, color: '#fff', fontWeight: 'bold', marginBottom: 32 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  avatarText: { fontSize: 48 },
  info: { color: '#aaa', fontSize: 14, marginBottom: 32 },
  btn: { backgroundColor: '#E50914', borderRadius: 8, padding: 14, width: '100%', alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
