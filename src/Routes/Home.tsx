import React, { useState } from "react";
import { useQuery } from "react-query";
import {
  IGetMovieResult,
  getMoives,
  getMovieDetails,
  getPopularMoives,
  getTopRatedMovies,
  getTvShows,
} from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence, Variants, useScroll } from "framer-motion";
import useWindowDimensions from "../useWindowDimensions";
import { useHistory, useRouteMatch } from "react-router-dom";
import MovieModal from "../components/MovieModal";
import Slider from "../components/Slider";

const Wrapper = styled.div`
  background-color: black;
  height: 100vh;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 36px;
  width: 50%;
`;

const Sliders = styled.div`
  display: grid;
  grid-template-rows: repeat(2, 1fr);
  gap: 300px;
`;

const Home = () => {
  const offset = 6;
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  const history = useHistory();

  const { data: nowPlaying, isLoading: nowPlayingLoading } = useQuery<
    IGetMovieResult
  >(["movies", "nowPlaying"], getMoives);
  const { data: popular } = useQuery<IGetMovieResult>(
    "popularMovie",
    getPopularMoives
  );
  const { data: top_rated } = useQuery<IGetMovieResult>(
    "topRatedMovie",
    getTopRatedMovies
  );

  const [detailMovieId, setDetailMovieId] = useState(0);

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const increaseIndex = () => {
    console.log(leaving);
    if (nowPlaying) {
      if (leaving) return;
      toggleLeaving();
      const totalMovie = nowPlaying.results.length - 1;
      const maxIndex = Math.floor(totalMovie / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);

  return (
    <Wrapper>
      {nowPlayingLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIndex}
            bgphoto={makeImagePath(nowPlaying?.results[0].backdrop_path || "")}
          >
            <Title>{nowPlaying?.results[0].title}</Title>
            <Overview>{nowPlaying?.results[0].overview}</Overview>
          </Banner>
          <Sliders>
            <Slider
              index={index}
              setDetailMovieId={setDetailMovieId}
              toggleLeaving={toggleLeaving}
              offset={offset}
              movieData={nowPlaying}
              title="Now Playing"
            />
            <Slider
              index={index}
              setDetailMovieId={setDetailMovieId}
              toggleLeaving={toggleLeaving}
              offset={offset}
              movieData={popular}
              title="Popular"
            />
            <Slider
              index={index}
              setDetailMovieId={setDetailMovieId}
              toggleLeaving={toggleLeaving}
              offset={offset}
              movieData={top_rated}
              title="Top Rated"
            />
          </Sliders>
          {bigMovieMatch ? <MovieModal detailMovieId={detailMovieId} /> : null}
        </>
      )}
    </Wrapper>
  );
};

export default Home;
