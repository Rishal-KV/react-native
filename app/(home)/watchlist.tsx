import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../hooks/useTheme';
import { useRouter } from 'expo-router';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export default function WatchlistScreen() {
  const { watchlist } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>My Watchlist</Text>
      
      {(!watchlist || watchlist.length === 0) ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.textDim }]}>Your watchlist is empty.</Text>
        </View>
      ) : (
        <FlatList
          data={watchlist}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity 
                style={styles.card}
                activeOpacity={0.8}
                onPress={() => router.push(`/movie/${item.id}`)}
            >
              <Image 
                source={{ uri: `${IMAGE_BASE_URL}${item.poster_path}` }} 
                style={styles.image}
              />
              <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
                {item.title || item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { fontSize: 24, fontWeight: 'bold', marginHorizontal: 20, marginVertical: 16 },
  listContainer: { paddingHorizontal: 16, paddingBottom: 120 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16 },
  card: { flex: 1, margin: 8, maxWidth: '45%' },
  image: { width: '100%', aspectRatio: 2/3, borderRadius: 12, marginBottom: 8 },
  title: { fontSize: 14, fontWeight: '600', textAlign: 'center' }
});
