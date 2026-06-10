import React, { useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { userService } from '../services/api';

export default function DetailScreen({ route, navigation }) {
  const { item } = route.params;
  const [adding, setAdding] = useState(false);

  const handleAddToList = async () => {
    setAdding(true);
    try {
      await userService.addToWatchlist(item.id);
      Alert.alert('Başarılı', `"${item.title}" listene eklendi.`);
    } catch (e) {
      Alert.alert('Hata', e.response?.data?.error || 'Eklenemedi. Giriş yaptığından emin ol.');
    } finally {
      setAdding(false);
    }
  };

  const handleWatch = async () => {
    if (!item.videoUrl) return Alert.alert('Bilgi', 'Bu içerik için video bağlantısı yok.');
    try {
      await Linking.openURL(item.videoUrl);
    } catch {
      Alert.alert('Hata', 'Video açılamadı.');
    }
  };

  return (
    <ScrollView style={s.container}>
      <TouchableOpacity style={s.back} onPress={() => navigation.goBack()}>
        <Text style={s.backText}>‹ Geri</Text>
      </TouchableOpacity>
      <View style={s.poster}><Text style={s.posterEmoji}>🎬</Text></View>
      <View style={s.body}>
        <Text style={s.title}>{item.title}</Text>
        <View style={s.metaRow}>
          <Text style={s.meta}>{item.type === 'series' ? 'Dizi' : 'Film'}</Text>
          <Text style={s.dot}>•</Text>
          <Text style={s.meta}>{item.genre}</Text>
          <Text style={s.dot}>•</Text>
          <Text style={s.meta}>{item.year}</Text>
        </View>
        {item.rating != null && <Text style={s.rating}>⭐ {item.rating} ({item.ratingCount} oy)</Text>}
        <Text style={s.desc}>{item.description}</Text>
        <TouchableOpacity style={s.watchBtn} onPress={handleWatch}>
          <Text style={s.watchText}>▶  YouTube'da İzle</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.listBtn} onPress={handleAddToList} disabled={adding}>
          <Text style={s.listText}>{adding ? 'Ekleniyor...' : '+  Listeme Ekle'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#141414' },
  back: { paddingTop: 50, paddingHorizontal: 16, paddingBottom: 8 },
  backText: { color: '#fff', fontSize: 18 },
  poster: { height: 220, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center' },
  posterEmoji: { fontSize: 64 },
  body: { padding: 20 },
  title: { color: '#fff', fontSize: 26, fontWeight: 'bold', marginBottom: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  meta: { color: '#aaa', fontSize: 14, textTransform: 'capitalize' },
  dot: { color: '#aaa', marginHorizontal: 8 },
  rating: { color: '#E50914', fontSize: 15, fontWeight: 'bold', marginBottom: 16 },
  desc: { color: '#ddd', fontSize: 15, lineHeight: 22, marginBottom: 24 },
  watchBtn: { backgroundColor: '#E50914', borderRadius: 8, padding: 16, alignItems: 'center', marginBottom: 12 },
  watchText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  listBtn: { backgroundColor: '#333', borderRadius: 8, padding: 16, alignItems: 'center' },
  listText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
