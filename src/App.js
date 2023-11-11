import React, {useEffect, useState, useCallback} from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  // const dummyMovies = [
  //   {
  //     id: 1,
  //     title: 'Some Dummy Movie',
  //     openingText: 'This is the opening text of the movie',
  //     releaseDate: '2021-05-18',
  //   },
  //   {
  //     id: 2,
  //     title: 'Some Dummy Movie 2',
  //     openingText: 'This is the second opening text of the movie',
  //     releaseDate: '2021-05-19',
  //   },
  // ];

  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async()=>{
    setIsLoading(true);
    setError(null);
    // fetch("https://swapi.dev/api/films/").then(response => {
    //   return response.json();
    // }).then(data => {
    //   const transformedMovies = data.results.map(movieData => {
    //     return {
    //       id: movieData.episode_id,
    //       title: movieData.title,
    //       openingText: movieData.opening_crawl,
    //       releaseDate: movieData.release_date
    //     }
    //   });
    //   setMovies(transformedMovies);
    // })


    // Using async await

    try{
      const response = await fetch("https://swapi.dev/api/films/");

      if(!response.ok){
        throw new Error('Something went wrong ...Retrying');
      }

      const data = await response.json();

      const transformedMovies = data.results.map(movieData => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date
        }
      });
      setMovies(transformedMovies);
      
    }catch(error){
      setError(error.message);
    }
    setIsLoading(false);

  },[]);

  useEffect(()=>{
    fetchMoviesHandler();
  },[fetchMoviesHandler]);


  useEffect(()=>{
    if(error){
      const timer = setTimeout(()=>{
        fetchMoviesHandler();
      },5000);
      return ()=>{
        clearTimeout(timer);
      }
    }
    
  });

  const returnHandler = ()=>{
    setError(null);
    setIsLoading(false);
  }
  

  let content = <p>Found no movies.</p>;
  if(movies.length > 0){
    content = <MoviesList movies={movies} />
  }
  if(error){
    content = <p>{error}</p>
  }
  if(isLoading){
    content = <p>Loading...</p>
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {/* {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && movies.length === 0 && !error && <p>Found no movies.</p>}
        {!isLoading && error && <p>{error}</p>}
        {isLoading && <p>Loading...</p>} */}
        {content}
        {error && <button onClick={returnHandler}>Cancel</button>}
      </section>
    </React.Fragment>
  );
}

export default App;
