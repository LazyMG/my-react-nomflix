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

interface ITv {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
  overview: string;
}

export interface IGetTvResult {
  page: number;
  results: ITv[];
  total_pages: number;
  total_results: number;
}

interface IResults {
  id: number;
  backdrop_path?: string;
  poster_path: string;
  name?: string;
  title?: string;
  overview: string;
}

export interface ISeachResult {
  page: number;
  results: IResults[];
  total_pages: number;
  total_results: number;
}

export interface IDetailMovie{
  backdrop_path: string;
  genres:[
    id:number,
    name:string
  ];
  id:number;
  overview:string;
  poster_path:string;
  release_date:string;
  runtime:number;
  tagline:string;
  title:string;
}

export function getMoives() {
  return fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`
  ).then((response) => response.json());
}

export function getTvShows() {
  return fetch(
    `${BASE_PATH}/trending/tv/day?api_key=${API_KEY}`
  ).then((response) => response.json());
}

export function searchContents(query: string) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjYzk3ZWMxODgxYjExOGFiNDQ5N2FkYjIyMzcyZGI4NSIsInN1YiI6IjYzZjQwY2ZlMTUzNzZjMDBjYjI0NDA2OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.t12G9y2andkQCU0-bthCVJi4eJi5RN13ZOw4SRHWAOg",
    },
  };
  return fetch(
    `${BASE_PATH}/search/multi?query=${query}`,
    options
  ).then((response) => response.json());
}

export function getMovieDetails(movidId: number) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjYzk3ZWMxODgxYjExOGFiNDQ5N2FkYjIyMzcyZGI4NSIsInN1YiI6IjYzZjQwY2ZlMTUzNzZjMDBjYjI0NDA2OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.t12G9y2andkQCU0-bthCVJi4eJi5RN13ZOw4SRHWAOg",
    },
  };
  return fetch(`${BASE_PATH}/movie/${movidId}`, options).then((response) =>
    response.json()
  );
}
