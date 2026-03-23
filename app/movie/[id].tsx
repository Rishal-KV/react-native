import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, ImageBackground, Dimensions, TouchableOpacity, Image, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { fetchMovieDetails, fetchMovieCast, fetchMovieVideos } from '../../api/tmdb';
import { useTheme } from '../../hooks/useTheme';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import YoutubePlayer from 'react-native-youtube-iframe';
import { BlurView } from 'expo-blur';
import { useAuth } from '../../context/AuthContext';

const { width, height } = Dimensions.get('window');
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';
const PROFILE_BASE_URL = 'https://image.tmdb.org/t/p/w200';

export default function MovieDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const [movie, setMovie] = useState<any>(null);
  const [cast, setCast] = useState<any[]>([]);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [playingTrailer, setPlayingTrailer] = useState(false);
  const [loading, setLoading] = useState(true);

  const { watchlist, addToWatchlist, removeFromWatchlist } = useAuth();

  const inWatchlist = movie ? watchlist?.some(m => m.id === movie.id) : false;

  const toggleWatchlist = async () => {
    if (!movie) return;
    if (inWatchlist) {
      await removeFromWatchlist(movie.id);
    } else {
      await addToWatchlist(movie);
    }
  };

  useEffect(() => {
    if (!id) return;

    const loadDetails = async () => {
      setLoading(true);
      const [movieData, castData, videosData] = await Promise.all([
        fetchMovieDetails(Number(id)),
        fetchMovieCast(Number(id)),
        fetchMovieVideos(Number(id))
      ]);
      setMovie(movieData);
      setCast(castData.slice(0, 10));

      const trailer = videosData?.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer');
      if (trailer) {
        setTrailerKey(trailer.key);
      }

      setLoading(false);
    };

    loadDetails();
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.loader, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={[styles.loader, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Failed to load movie details.</Text>
      </View>
    );
  }

  const playTrailer = () => {
    if (trailerKey) {
      setPlayingTrailer(true);
    } else {
      alert("Trailer not available");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="light" />

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

        {/* Header Hero Section */}
        <View style={styles.heroContainer}>
          <ImageBackground
            source={{ uri: `${IMAGE_BASE_URL}${movie.backdrop_path || movie.poster_path}` }}
            style={styles.heroImage}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0)', isDark ? colors.background : 'rgba(255,255,255,1)']}
              style={styles.gradient}
            />

            {/* Back Button */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <BlurView intensity={isDark ? 60 : 90} tint={isDark ? "dark" : "light"} style={styles.blurContainer}>
                <Ionicons name="chevron-back" size={28} color={isDark ? "#FFF" : "#000"} />
              </BlurView>
            </TouchableOpacity>
          </ImageBackground>
        </View>

        {/* Content Section */}
        <View style={styles.contentContainer}>
          <Text style={[styles.title, { color: colors.text }]}>{movie.title || movie.name}</Text>

          <View style={styles.metaData}>
            <BlurView intensity={isDark ? 60 : 80} tint={isDark ? "dark" : "light"} style={styles.metaBadge}>
              <Text style={styles.metaBadgeTextStar}>⭐ {movie.vote_average?.toFixed(1)}</Text>
            </BlurView>
            <BlurView intensity={isDark ? 60 : 80} tint={isDark ? "dark" : "light"} style={styles.metaBadge}>
              <Text style={[styles.metaBadgeText, { color: isDark ? '#FFF' : '#000' }]}>{movie.release_date?.substring(0, 4) || 'N/A'}</Text>
            </BlurView>
            <BlurView intensity={isDark ? 60 : 80} tint={isDark ? "dark" : "light"} style={styles.metaBadge}>
              <Text style={[styles.metaBadgeText, { color: isDark ? '#FFF' : '#000' }]}>{movie.runtime} min</Text>
            </BlurView>
          </View>

          <View style={styles.genresRow}>
            {movie.genres?.map((g: any) => (
              <BlurView key={g.id} intensity={isDark ? 50 : 70} tint={isDark ? "dark" : "light"} style={styles.genreBadge}>
                <Text style={[styles.genreText, { color: isDark ? '#FFF' : '#000' }]}>{g.name}</Text>
              </BlurView>
            ))}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.playBtn, { opacity: trailerKey ? 1 : 0.6 }]}
              onPress={playTrailer}
            >
              <BlurView intensity={isDark ? 60 : 90} tint={isDark ? "light" : "dark"} style={styles.playBtnBlur}>
                <Ionicons name="play" size={24} color={isDark ? "#000" : "#FFF"} />
                <Text style={[styles.playBtnText, { color: isDark ? "#000" : "#FFF" }]}>{trailerKey ? "Watch Trailer" : "No Trailer"}</Text>
              </BlurView>
            </TouchableOpacity>
            <TouchableOpacity style={styles.trailerBtn} onPress={toggleWatchlist}>
              <BlurView intensity={isDark ? 50 : 80} tint={isDark ? "dark" : "light"} style={styles.trailerBtnBlur}>
                <Ionicons name={inWatchlist ? "checkmark" : "add"} size={26} color={inWatchlist ? colors.primary : (isDark ? "#FFF" : "#000")} />
              </BlurView>
            </TouchableOpacity>
          </View>

          {/* Overview */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Storyline</Text>
          <Text style={[styles.overview, { color: colors.textDim }]}>{movie.overview}</Text>

          {/* Cast */}
          {cast.length > 0 && (
            <View style={styles.castSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Top Cast</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.castList}>
                {cast.map(actor => (
                  <View key={actor.id} style={styles.actorCard}>
                    <Image
                      source={{ uri: actor.profile_path ? `${PROFILE_BASE_URL}${actor.profile_path}` : 'https://via.placeholder.com/200x300?text=No+Image' }}
                      style={styles.actorImage}
                    />
                    <Text style={[styles.actorName, { color: colors.text }]} numberOfLines={1}>{actor.name}</Text>
                    <Text style={[styles.actorRole, { color: colors.textDim }]} numberOfLines={1}>{actor.character}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          <View style={{ height: 100 }} />
        </View>

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
    width: width,
    height: height * 0.55,
  },
  heroImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    borderRadius: 22,
    overflow: 'hidden',
  },
  blurContainer: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    paddingHorizontal: 24,
    marginTop: -40,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  metaData: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  metaBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    overflow: 'hidden',
  },
  metaBadgeTextStar: {
    color: '#FFCC00',
    fontWeight: 'bold',
    fontSize: 14,
  },
  metaBadgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  genresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  genreBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  genreText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  playBtn: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  playBtnBlur: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  playBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  trailerBtn: {
    width: 52,
    height: 52,
    borderRadius: 16,
    overflow: 'hidden',
  },
  trailerBtnBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  overview: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 32,
  },
  castSection: {
    marginTop: 8,
  },
  castList: {
    gap: 16,
  },
  actorCard: {
    width: 100,
    marginRight: 16,
  },
  actorImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  actorName: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 2,
  },
  actorRole: {
    fontSize: 12,
    textAlign: 'center',
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
