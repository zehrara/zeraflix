import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { userService } from '../services/api';

export default function RecommendationsScreen() {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { const userId = await AsyncStorage.getItem('userId'); const r = await userService.getRecommendations(userId); setRecs(r.data); }
      catch { setRecs([]); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <View style={s.center}><ActivityIndicator size="large" color="#E50914" /></View>;

  return (
    <View style={s.container}>
      <Text style={s.header}>✨ Sana Özel</Text>
      {recs.length === 0 ? <Text style={s.empty}>Henüz öneri yok.</Text> :
        <FlatList data={recs} keyExtractor={(_, i) => String(i)}
          renderItem={({ item }) => (
            <View style={s.card}>
              <Text style={s.title}>{item.title}</Text>
              <Text style={s.genre}>{item.genre || item.category || ''}</Text>
            </View>
          )} />}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#141414', paddingTop: 50, padding: 16 },
  center: { flex: 1, backgroundColor: '#141414', justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 24, color: '#fff', fontWeight: 'bold', marginBottom: 16 },
  card: { backgroundColor: '#1f1f1f', borderRadius: 8, padding: 14, marginBottom: 10 },
  title: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  genre: { color: '#aaa', fontSize: 12, marginTop: 4 },
  empty: { color: '#aaa', textAlign: 'center', marginTop: 64, fontSize: 16 },
});
