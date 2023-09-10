const API_KEY = "cc97ec1881b118ab4497adb22372db85";
const BASE_PATH = "https://api.themoviedb.org/3/";

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IGetMovieResult {
  date: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export function getMoives() {
  return fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`
  ).then((response) => response.json());
}
