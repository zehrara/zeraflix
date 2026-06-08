import React, { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { contentService } from '../services/api';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true); setSearched(true);
    try { const r = await contentService.search(query); setResults(r.data); }
    catch { setResults([]); }
    finally { setLoading(false); }
  };

  return (
    <View style={s.container}>
      <Text style={s.header}>Ara</Text>
      <View style={s.searchRow}>
        <TextInput style={s.input} placeholder="Film veya dizi ara..." placeholderTextColor="#888" value={query} onChangeText={setQuery} onSubmitEditing={handleSearch} returnKeyType="search" />
        <TouchableOpacity style={s.btn} onPress={handleSearch}><Text style={s.btnText}>🔍</Text></TouchableOpacity>
      </View>
      {loading && <ActivityIndicator color="#E50914" style={{ marginTop: 24 }} />}
      {!loading && searched && results.length === 0 && <Text style={s.empty}>Sonuç bulunamadı.</Text>}
      <FlatList data={results} keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={s.card}>
            <Text style={s.title}>{item.title}</Text>
            <Text style={s.genre}>{item.genre || item.category || ''}</Text>
          </View>
        )} />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#141414', paddingTop: 50, padding: 16 },
  header: { fontSize: 24, color: '#fff', fontWeight: 'bold', marginBottom: 16 },
  searchRow: { flexDirection: 'row', marginBottom: 16 },
  input: { flex: 1, backgroundColor: '#333', color: '#fff', borderRadius: 8, padding: 12, fontSize: 16 },
  btn: { backgroundColor: '#E50914', borderRadius: 8, padding: 12, marginLeft: 8, justifyContent: 'center' },
  btnText: { fontSize: 18 },
  card: { backgroundColor: '#1f1f1f', borderRadius: 8, padding: 14, marginBottom: 10 },
  title: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  genre: { color: '#aaa', fontSize: 12, marginTop: 4 },
  empty: { color: '#aaa', textAlign: 'center', marginTop: 32, fontSize: 16 },
});
