import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { contentService } from '../services/api';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    contentService.getAll().then(r => setContents(r.data.content)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <View style={s.center}><ActivityIndicator color="#E50914" /></View>;

  return (
    <View style={s.container}>
      <Text style={s.header}>🎬 Zeraflix</Text>
      <FlatList data={contents} keyExtractor={(item) => String(item.id)} numColumns={2} columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => (
          <TouchableOpacity style={s.card} onPress={() => navigation.navigate('Detail', { item })}>
            {item.posterUrl ? <Image source={{ uri: item.posterUrl }} style={s.poster} /> : <View style={s.posterPlaceholder}><Text style={s.posterText}>🎬</Text></View>}
            <Text style={s.title} numberOfLines={2}>{item.title}</Text>
            <Text style={s.genre}>{item.genre || item.category || ''}</Text>
          </TouchableOpacity>
        )} />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#141414', paddingTop: 50 },
  center: { flex: 1, backgroundColor: '#141414', justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 24, color: '#E50914', fontWeight: 'bold', paddingHorizontal: 16, marginBottom: 16 },
  card: { width: '48%', backgroundColor: '#1f1f1f', borderRadius: 8, marginBottom: 16, overflow: 'hidden' },
  poster: { width: '100%', height: 160 },
  posterPlaceholder: { width: '100%', height: 160, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center' },
  posterText: { fontSize: 40 },
  title: { color: '#fff', fontWeight: 'bold', padding: 8, fontSize: 13 },
  genre: { color: '#aaa', fontSize: 11, paddingHorizontal: 8, paddingBottom: 8 },
});
