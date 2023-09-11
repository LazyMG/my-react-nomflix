import React from "react";
import { useQuery } from "react-query";
import { IDetailMovie, getMovieDetails } from "../api";
import { useHistory, useRouteMatch } from "react-router-dom";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import styled from "styled-components";
import { makeImagePath } from "../utils";

interface IProps {
  detailMovieId: number;
}

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h2`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 20px;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

const MovieModal = ({ detailMovieId }: IProps) => {
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  const { data, isLoading } = useQuery<IDetailMovie>("detailMovie", () =>
    getMovieDetails(detailMovieId)
  );

  const { scrollY } = useScroll();
  const history = useHistory();

  const onOverlayClick = () => {
    history.push("/");
  };

  return (
    <>
      {isLoading ? (
        <Loader>Laoding...</Loader>
      ) : (
        <AnimatePresence>
          {bigMovieMatch ? (
            <>
              <Overlay
                onClick={onOverlayClick}
                exit={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
              <BigMovie
                style={{ top: scrollY.get() + 100 }}
                layoutId={bigMovieMatch.params.movieId}
              >
                {data && (
                  <>
                    <BigCover
                      style={{
                        backgroundImage: `linear-gradient(to top, black, transparent), url(
                ${makeImagePath(data?.backdrop_path, "w500")}
              )`,
                      }}
                    />
                    <BigTitle>{data?.title}</BigTitle>
                    <BigOverview>{data?.overview}</BigOverview>
                  </>
                )}
              </BigMovie>
            </>
          ) : null}
        </AnimatePresence>
      )}
    </>
  );
};

export default MovieModal;
