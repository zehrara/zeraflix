import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { authService } from '../services/api';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) return Alert.alert('Hata', 'Tüm alanları doldurun.');
    setLoading(true);
    try {
      await authService.register(email, password, name);
      navigation.replace('Login');
    } catch (e) {
      Alert.alert('Kayıt Başarısız', e.response?.data?.message || 'Bir hata oluştu.');
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">
        <Text style={s.logo}>🎬 Zeraflix</Text>
        <Text style={s.title}>Kayıt Ol</Text>
        <TextInput style={s.input} placeholder="Ad Soyad" placeholderTextColor="#888" value={name} onChangeText={setName} />
        <TextInput style={s.input} placeholder="E-posta" placeholderTextColor="#888" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={s.input} placeholder="Şifre" placeholderTextColor="#888" value={password} onChangeText={setPassword} secureTextEntry />
        <TouchableOpacity style={s.btn} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Kayıt Ol</Text>}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={s.link}>Zaten hesabın var mı? <Text style={s.linkBold}>Giriş Yap</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#141414', paddingVertical: 60, padding: 24 },
  logo: { fontSize: 36, textAlign: 'center', marginBottom: 8 },
  title: { fontSize: 28, color: '#fff', fontWeight: 'bold', textAlign: 'center', marginBottom: 32 },
  input: { backgroundColor: '#333', color: '#fff', borderRadius: 8, padding: 14, marginBottom: 14, fontSize: 16 },
  btn: { backgroundColor: '#E50914', borderRadius: 8, padding: 16, alignItems: 'center', marginBottom: 16 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link: { color: '#aaa', textAlign: 'center', fontSize: 14 },
  linkBold: { color: '#E50914', fontWeight: 'bold' },
});
