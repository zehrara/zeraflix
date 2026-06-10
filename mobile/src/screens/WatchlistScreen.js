import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { userService } from '../services/api';

export default function WatchlistScreen() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchList = async () => {
    setLoading(true);
    try { const r = await userService.getWatchlist(); setList(r.data.watchlist); }
    catch { setList([]); }
    finally { setLoading(false); }
  };

  useFocusEffect(useCallback(() => { fetchList(); }, []));

  const handleRemove = async (contentId) => {
    try { await userService.removeFromWatchlist(contentId); setList(prev => prev.filter(i => i.contentId !== contentId)); }
    catch { Alert.alert('Hata', 'Kaldırılamadı.'); }
  };

  if (loading) return <View style={s.center}><ActivityIndicator color="#E50914" /></View>;

  return (
    <View style={s.container}>
      <Text style={s.header}>Listem</Text>
      {list.length === 0 ? <Text style={s.empty}>Listeniz boş.</Text> :
        <FlatList data={list} keyExtractor={(item) => String(item.contentId)}
          renderItem={({ item }) => (
            <View style={s.card}>
              <View style={{ flex: 1 }}>
                <Text style={s.title}>{item.content?.title}</Text>
                <Text style={s.genre}>{item.content?.genre || ''}</Text>
              </View>
              <TouchableOpacity onPress={() => handleRemove(item.contentId)}><Text style={s.remove}>✕</Text></TouchableOpacity>
            </View>
          )} />}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#141414', paddingTop: 50, padding: 16 },
  center: { flex: 1, backgroundColor: '#141414', justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 24, color: '#fff', fontWeight: 'bold', marginBottom: 16 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1f1f1f', borderRadius: 8, padding: 14, marginBottom: 10 },
  title: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  genre: { color: '#aaa', fontSize: 12, marginTop: 4 },
  remove: { color: '#E50914', fontSize: 20, padding: 4 },
  empty: { color: '#aaa', textAlign: 'center', marginTop: 64, fontSize: 16 },
});
