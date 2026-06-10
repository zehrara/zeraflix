import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator, FlatList, Image, ScrollView,
  StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import { contentService } from '../services/api';

export default function HomeScreen() {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [userName, setUserName] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    contentService.getAll()
      .then(r => setContents(r.data.content || []))
      .catch(() => {})
      .finally(() => setLoading(false));
    AsyncStorage.getItem('userName').then(n => { if (n) setUserName(n); });
  }, []);

  const filtered = activeTab === 'all' ? contents
    : activeTab === 'series' ? contents.filter(c => c.type === 'series')
    : activeTab === 'movie' ? contents.filter(c => c.type === 'movie')
    : contents.filter(c => c.genre === 'müzik' || c.genre === 'video' || c.genre === 'anime');

  const featured = contents[0];

  if (loading) return (
    <View style={s.center}>
      <ActivityIndicator color="#E50914" />
    </View>
  );

  return (
    <View style={s.bg}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.logo}>ZERAFLIX</Text>
        <Text style={s.greeting}>{userName ? `Merhaba, ${userName}` : ''}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Featured banner */}
        {featured && (
          <TouchableOpacity onPress={() => navigation.navigate('Detail', { item: featured })} activeOpacity={0.85}>
            <View style={s.banner}>
              {featured.posterUrl
                ? <Image source={{ uri: featured.posterUrl }} style={s.bannerImg} />
                : <View style={[s.bannerImg, s.bannerPlaceholder]} />}
              <View style={s.bannerOverlay}>
                <Text style={s.bannerTitle}>{featured.title}</Text>
                <Text style={s.bannerGenre}>{featured.genre} • {featured.year}</Text>
                <TouchableOpacity style={s.playBtn} onPress={() => navigation.navigate('Detail', { item: featured })}>
                  <Text style={s.playBtnText}>▶  İzle</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.tabRow} contentContainerStyle={{ paddingHorizontal: 16 }}>
          {[
            { key: 'all', label: 'Tümü' },
            { key: 'series', label: 'Diziler' },
            { key: 'movie', label: 'Filmler' },
            { key: 'other', label: 'Müzik & Video' },
          ].map(tab => (
            <TouchableOpacity key={tab.key} onPress={() => setActiveTab(tab.key)}
              style={[s.tab, activeTab === tab.key && s.tabActive]}>
              <Text style={[s.tabText, activeTab === tab.key && s.tabTextActive]}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Grid */}
        <View style={s.grid}>
          {filtered.map(item => (
            <TouchableOpacity key={item.id} style={s.card} onPress={() => navigation.navigate('Detail', { item })}>
              {item.posterUrl
                ? <Image source={{ uri: item.posterUrl }} style={s.poster} resizeMode="cover" />
                : <View style={s.posterPlaceholder}><Text style={{ fontSize: 32 }}>🎬</Text></View>}
              <Text style={s.cardTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={s.cardMeta}>{item.year} • ⭐{item.rating}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const CARD_W = '47%';
const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#141414' },
  center: { flex: 1, backgroundColor: '#141414', justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 52, paddingBottom: 8 },
  logo: { fontSize: 22, fontWeight: '900', color: '#E50914', letterSpacing: 3 },
  greeting: { color: '#aaa', fontSize: 12 },
  banner: { width: '100%', height: 220, position: 'relative' },
  bannerImg: { width: '100%', height: 220 },
  bannerPlaceholder: { backgroundColor: '#222' },
  bannerOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16 },
  bannerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', textShadowColor: '#000', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 6 },
  bannerGenre: { color: '#ccc', fontSize: 12, marginBottom: 10, textTransform: 'capitalize' },
  playBtn: { backgroundColor: '#E50914', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 4, alignSelf: 'flex-start' },
  playBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  tabRow: { marginVertical: 12 },
  tab: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: '#444' },
  tabActive: { backgroundColor: '#E50914', borderColor: '#E50914' },
  tabText: { color: '#aaa', fontSize: 13, fontWeight: '600' },
  tabTextActive: { color: '#fff' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 12 },
  card: { width: CARD_W, marginBottom: 16 },
  poster: { width: '100%', height: 160, borderRadius: 6 },
  posterPlaceholder: { width: '100%', height: 160, backgroundColor: '#2a2a2a', borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  cardTitle: { color: '#fff', fontWeight: '600', fontSize: 13, marginTop: 6 },
  cardMeta: { color: '#888', fontSize: 11, marginTop: 2 },
});
