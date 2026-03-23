import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, ImageBackground, Dimensions, TouchableOpacity, Modal } from 'react-native';
import { fetchTrending, fetchPopular, fetchMovieVideos } from '../../api/tmdb';
import MovieCard from '../../components/MovieCard';
import YoutubePlayer from 'react-native-youtube-iframe';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../hooks/useTheme';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

export default function Index() {
  const [trending, setTrending] = useState<any[]>([]);
  const [popular, setPopular] = useState<any[]>([]);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [playingTrailer, setPlayingTrailer] = useState(false);
  const [loading, setLoading] = useState(true);
  const { colors, isDark } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      const [trendingData, popularData] = await Promise.all([
        fetchTrending(),
        fetchPopular()
      ]);
      setTrending(trendingData.slice(0, 10)); // Top 10 trending
      setPopular(popularData);

      const hero = trendingData[0];
      if (hero) {
        try {
          const videosData = await fetchMovieVideos(hero.id);
          const trailer = videosData?.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer');
          if (trailer) setTrailerKey(trailer.key);
        } catch (e) {}
      }

      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <View style={[styles.loader, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const heroMovie = trending[0];

  const playTrailer = () => {
    if (trailerKey) {
      setPlayingTrailer(true);
    } else {
      alert("Trailer not available");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Video Modal */}
      <Modal visible={playingTrailer} animationType="fade" transparent={true} onRequestClose={() => setPlayingTrailer(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.closeModalButton} onPress={() => setPlayingTrailer(false)}>
            <Ionicons name="close-circle" size={40} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.videoWrapper}>
            <YoutubePlayer
              height={width * (9 / 16)}
              width={width}
              play={playingTrailer}
              videoId={trailerKey || ""}
              onChangeState={(state: string) => {
                if (state === "ended") setPlayingTrailer(false);
              }}
            />
          </View>
        </View>
      </Modal>

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Hero Section */}
        {heroMovie && (
          <View style={[styles.heroContainer, { shadowColor: colors.primary }]}>
            <ImageBackground
              source={{ uri: `${IMAGE_BASE_URL}${heroMovie.poster_path || heroMovie.backdrop_path}` }}
              style={styles.heroImage}
            >
              <View style={[styles.gradientOverlay, { backgroundColor: isDark ? 'rgba(9, 9, 15, 0.65)' : 'rgba(255, 255, 255, 0.65)' }]}>
                <View style={styles.heroContent}>
                  <Text style={[styles.heroTitle, { color: isDark ? '#FFF' : '#000', textShadowColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)' }]}>{heroMovie.title || heroMovie.name}</Text>
                  <Text style={[styles.heroOverview, { color: isDark ? '#D0D0E0' : '#444' }]} numberOfLines={3}>
                    {heroMovie.overview}
                  </Text>
                  <View style={styles.heroButtons}>
                    <TouchableOpacity style={[styles.playButton, { backgroundColor: colors.primary, shadowColor: colors.primary, opacity: trailerKey ? 1 : 0.7 }]} activeOpacity={0.8} onPress={playTrailer}>
                      <Text style={styles.playButtonText}>{trailerKey ? '▶ Play' : 'No Trailer'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.infoButton, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.15)', borderColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)' }]}
                      activeOpacity={0.8}
                      onPress={() => router.push(`/movie/${heroMovie.id}` as any)}
                    >
                      <Text style={[styles.infoButtonText, { color: isDark ? '#FFF' : '#000' }]}>ⓘ Details</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ImageBackground>
          </View>
        )}

        {/* Categories Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>🔥 Trending Today</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {trending.map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title || movie.name}
                posterPath={movie.poster_path}
                rating={movie.vote_average}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>⭐ Popular Matches</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {popular.map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title || movie.name}
                posterPath={movie.poster_path}
                rating={movie.vote_average}
              />
            ))}
          </ScrollView>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContainer: {
    height: height * 0.7,
    width: width,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
    backgroundColor: '#000', // Base before image loads
  },
  heroImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  gradientOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 24,
    paddingBottom: 40,
  },
  heroContent: {
    gap: 8,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: -1.5,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
    marginBottom: 8,
  },
  heroOverview: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
    fontWeight: '500',
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  playButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  playButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  infoButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  infoButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginLeft: 24,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingLeft: 24,
    paddingRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeModalButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 100,
  },
  videoWrapper: {
    width: width,
    height: width * (9 / 16),
    backgroundColor: '#000',
  }
});
