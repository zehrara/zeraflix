import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { authService } from '../services/api';

export default function RegisterScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password) return Alert.alert('Hata', 'Tüm alanları doldurun.');
    setLoading(true);
    try {
      const res = await authService.register(email, password, firstName, lastName);
      const { token, userId } = res.data;
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('userId', String(userId));
      navigation.replace('Main');
    } catch (e) {
      Alert.alert('Kayıt Başarısız', e.response?.data?.message || 'Bir hata oluştu.');
    } finally { setLoading(false); }
  };

  return (
    <View style={s.container}>
      <Text style={s.logo}>🎬 Zeraflix</Text>
      <Text style={s.title}>Kayıt Ol</Text>
      <TextInput style={s.input} placeholder="Ad" placeholderTextColor="#888" value={firstName} onChangeText={setFirstName} />
      <TextInput style={s.input} placeholder="Soyad" placeholderTextColor="#888" value={lastName} onChangeText={setLastName} />
      <TextInput style={s.input} placeholder="E-posta" placeholderTextColor="#888" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={s.input} placeholder="Şifre" placeholderTextColor="#888" value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={s.btn} onPress={handleRegister} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Kayıt Ol</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={s.link}>Zaten hesabın var mı? <Text style={s.linkBold}>Giriş Yap</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#141414', justifyContent: 'center', padding: 24 },
  logo: { fontSize: 36, textAlign: 'center', marginBottom: 8 },
  title: { fontSize: 28, color: '#fff', fontWeight: 'bold', textAlign: 'center', marginBottom: 32 },
  input: { backgroundColor: '#333', color: '#fff', borderRadius: 8, padding: 14, marginBottom: 14, fontSize: 16 },
  btn: { backgroundColor: '#E50914', borderRadius: 8, padding: 16, alignItems: 'center', marginBottom: 16 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link: { color: '#aaa', textAlign: 'center', fontSize: 14 },
  linkBold: { color: '#E50914', fontWeight: 'bold' },
});
