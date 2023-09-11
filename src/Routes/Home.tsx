import React, { useState } from "react";
import { useQuery } from "react-query";
import {
  IGetMovieResult,
  getMoives,
  getMovieDetails,
  getTvShows,
} from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence, Variants, useScroll } from "framer-motion";
import useWindowDimensions from "../useWindowDimensions";
import { useHistory, useRouteMatch } from "react-router-dom";
import MovieModal from "../components/MovieModal";

const Wrapper = styled.div`
  background-color: black;
  height: 100%;
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
  height: 100vh;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
  margin-top: 50px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const offset = 6;

const boxVariants: Variants = {
  normal: {
    scale: 1,
    transition: {
      type: "tween",
    },
  },
  hover: {
    scale: 1.3,
    transition: {
      delay: 0.3,
      type: "tween",
      duration: 0.1,
    },
    y: -50,
  },
};

const infoVariants: Variants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.3,
      type: "tween",
      duration: 0.1,
    },
  },
};

const Home = () => {
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  const history = useHistory();
  const width = useWindowDimensions();
  const { data, isLoading } = useQuery<IGetMovieResult>(
    ["movies", "nowPlaying"],
    getMoives
  );
  const [detailMovieId, setDetailMovieId] = useState(0);

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovie = data.results.length - 1;
      const maxIndex = Math.floor(totalMovie / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (movieId: number) => {
    history.push(`/movies/${movieId}`);
    setDetailMovieId(movieId);
  };

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Laoding...</Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIndex}
            bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                initial={{ x: width + 10 }}
                animate={{ x: 0 }}
                exit={{ x: -width - 10 }}
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ""}
                      variants={boxVariants}
                      key={movie.id}
                      initial="normal"
                      whileHover="hover"
                      bgphoto={makeImagePath(
                        movie.backdrop_path || movie.poster_path,
                        "w500"
                      )}
                      onClick={() => onBoxClicked(movie.id)}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>

          {bigMovieMatch ? <MovieModal detailMovieId={detailMovieId} /> : null}
        </>
      )}
    </Wrapper>
  );
};

export default Home;
