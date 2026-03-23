import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';

import { useRouter } from 'expo-router';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export default function MovieCard({ id, title, posterPath, rating }: any) {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.primary }]}
      activeOpacity={0.8}
      onPress={() => router.push(`/movie/${id}` as any)}
    >
      <Image
        source={{ uri: `${IMAGE_BASE_URL}${posterPath}` }}
        style={styles.image}
      />
      <View style={styles.overlay}>
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>⭐ {rating ? rating.toFixed(1) : 'NA'}</Text>
        </View>
      </View>
      <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    marginRight: 26,
    borderRadius: 16,
    overflow: 'hidden',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  image: {
    width: '100%',
    height: 210,
    borderRadius: 16,
  },
  overlay: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  ratingBadge: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  ratingText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 12,
    paddingHorizontal: 8,
    textAlign: 'center'
  }
});
