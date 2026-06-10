import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator, FlatList, Image, StyleSheet,
  Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { contentService } from '../services/api';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [all, setAll] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    contentService.getAll().then(r => setAll(r.data.content || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    setLoading(true);
    const timer = setTimeout(() => {
      contentService.search(query)
        .then(r => setResults(r.data.results || []))
        .catch(() => {
          const q = query.toLowerCase();
          setResults(all.filter(c =>
            c.title.toLowerCase().includes(q) ||
            c.genre.toLowerCase().includes(q)
          ));
        })
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <View style={s.container}>
      <Text style={s.header}>Ara</Text>
      <TextInput
        style={s.input}
        placeholder="Film, dizi, müzik ara..."
        placeholderTextColor="#555"
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
      />
      {loading && <ActivityIndicator color="#E50914" style={{ marginTop: 16 }} />}
      {!loading && query.trim() && results.length === 0 &&
        <Text style={s.empty}>Sonuç bulunamadı.</Text>}
      <FlatList
        data={results}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={s.row} onPress={() => navigation.navigate('Detail', { item })}>
            {item.posterUrl
              ? <Image source={{ uri: item.posterUrl }} style={s.thumb} />
              : <View style={[s.thumb, s.thumbPlaceholder]}><Text>🎬</Text></View>}
            <View style={{ flex: 1 }}>
              <Text style={s.title}>{item.title}</Text>
              <Text style={s.meta}>{item.type === 'series' ? 'Dizi' : 'Film'} • {item.genre} • {item.year}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#141414', paddingTop: 52, paddingHorizontal: 16 },
  header: { fontSize: 24, color: '#fff', fontWeight: 'bold', marginBottom: 14 },
  input: { backgroundColor: '#222', color: '#fff', borderRadius: 10, padding: 12, fontSize: 15, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 },
  thumb: { width: 60, height: 85, borderRadius: 5 },
  thumbPlaceholder: { backgroundColor: '#2a2a2a', justifyContent: 'center', alignItems: 'center' },
  title: { color: '#fff', fontWeight: '600', fontSize: 14 },
  meta: { color: '#888', fontSize: 12, marginTop: 3, textTransform: 'capitalize' },
  empty: { color: '#666', textAlign: 'center', marginTop: 40 },
});
