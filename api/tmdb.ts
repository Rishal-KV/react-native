export const TMDB_API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY || "";
export const TMDB_ACCESS_TOKEN = process.env.EXPO_PUBLIC_TMDB_ACCESS_TOKEN || "";
const BASE_URL = "https://api.tmdb.org/3";

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`
  }
};

export const fetchTrending = async () => {

  console.log("Fetching trending...");
  try {
    const res = await fetch(`${BASE_URL}/trending/movie/day?language=en-US`, options);
    const data = await res.json();

    return data.results;
  } catch (err) {

    console.error("Error fetching trending:", err);
    return [];
  }
};

export const fetchPopular = async () => {
  try {
    const res = await fetch(`${BASE_URL}/movie/popular?language=en-US&page=1`, options);
    const data = await res.json();
    return data.results;
  } catch (err) {
    console.error("Error fetching popular:", err);
    return [];
  }
};

export const fetchMovieDetails = async (id: number) => {
  try {
    const res = await fetch(`${BASE_URL}/movie/${id}?language=en-US`, options);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(`Error fetching movie details for ${id}:`, err);
    return null;
  }
};

export const fetchMovieCast = async (id: number) => {
  try {
    const res = await fetch(`${BASE_URL}/movie/${id}/credits?language=en-US`, options);
    const data = await res.json();
    return data.cast;
  } catch (err) {
    console.error(`Error fetching movie cast for ${id}:`, err);
    return [];
  }
};

export const fetchMovieVideos = async (id: number) => {
  try {
    const res = await fetch(`${BASE_URL}/movie/${id}/videos?language=en-US`, options);
    const data = await res.json();
    return data.results;
  } catch (err) {
    console.error(`Error fetching movie videos for ${id}:`, err);
    return [];
  }
};
