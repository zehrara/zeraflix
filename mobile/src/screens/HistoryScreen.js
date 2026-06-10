import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { userService } from '../services/api';

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { const r = await userService.getHistory(); setHistory(r.data.history); }
      catch { setHistory([]); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <View style={s.center}><ActivityIndicator color="#E50914" /></View>;

  return (
    <View style={s.container}>
      <Text style={s.header}>İzleme Geçmişi</Text>
      {history.length === 0 ? <Text style={s.empty}>Henüz bir şey izlemediniz.</Text> :
        <FlatList data={history} keyExtractor={(_, i) => String(i)}
          renderItem={({ item }) => (
            <View style={s.card}>
              <Text style={s.title}>{item.content?.title || item.title || 'İçerik'}</Text>
              <Text style={s.date}>{item.watchedAt ? new Date(item.watchedAt).toLocaleDateString('tr-TR') : ''}</Text>
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
  date: { color: '#aaa', fontSize: 12, marginTop: 4 },
  empty: { color: '#aaa', textAlign: 'center', marginTop: 64, fontSize: 16 },
});
