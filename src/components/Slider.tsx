import { AnimatePresence, Variants, motion } from "framer-motion";
import React from "react";
import styled from "styled-components";
import useWindowDimensions from "../useWindowDimensions";
import { useHistory } from "react-router-dom";
import { IGetMovieResult } from "../api";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  position: relative;
  top: -100px;
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

const Title = styled.h4`
  font-size: 40px;
  font-weight: 600;
  margin-bottom: 10px;
  margin-left: 10px;
`;

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

interface IProps {
  index: number;
  offset: number;
  setDetailMovieId: (movieId: number) => void;
  toggleLeaving: () => void;
  movieData: IGetMovieResult | undefined;
  title: string;
}

const Slider = ({
  index,
  setDetailMovieId,
  toggleLeaving,
  offset,
  movieData,
  title,
}: IProps) => {
  const width = useWindowDimensions();
  const history = useHistory();
  const onBoxClicked = (movieId: number) => {
    history.push(`/movies/${movieId}`);
    setDetailMovieId(movieId);
  };

  return (
    <Wrapper>
      <Title>{title}</Title>
      <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
        <Row
          initial={{ x: width + 10 }}
          animate={{ x: 0 }}
          exit={{ x: -width - 10 }}
          transition={{ type: "tween", duration: 1 }}
          key={index}
        >
          {movieData?.results
            .slice(1)
            .slice(offset * index, offset * index + offset)
            .map((movie) => (
              <Box
                layoutId={movie.id + title}
                variants={boxVariants}
                key={movie.id + title}
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
    </Wrapper>
  );
};

export default Slider;
