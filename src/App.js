import React, {useEffect, useState, useCallback} from 'react';

import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
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
      const response = await fetch("https://react-movies-4255c-default-rtdb.firebaseio.com/movies.json");  //https://swapi.dev/api/films/ 
      //OR 
      //https://console.firebase.google.com/project/react-movies-4255c/database/react-movies-4255c-default-rtdb/data/~2F
      if(!response.ok){
        throw new Error('Something went wrong ...Retrying');
      }

      const data = await response.json();

      const loadedMovies = [];

      for(const key in data){
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate
        })
      }

      // const transformedMovies = data.results.map(movieData => {
      //   return {
      //     id: movieData.episode_id,
      //     title: movieData.title,
      //     openingText: movieData.opening_crawl,
      //     releaseDate: movieData.release_date
      //   }
      // });
      setMovies(loadedMovies);
      
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

  const addMovieHandler = async (movie)=>{
    const response = await fetch("https://react-movies-4255c-default-rtdb.firebaseio.com/movies.json",{
      method: "POST",
      body: JSON.stringify(movie),
      headers: {
        'Content-Type': 'appication/json'
      }
    });
    const data = await response.json();
    console.log(data);
    setMovies(prevMovie=>{
      return [...prevMovie, {...movie, id: data.name}];
    })
  }

  const returnHandler = ()=>{
    setError(null);
    setIsLoading(false);
  }

  const deleteMovieHandler = async (id)=>{
    console.log(id);
    await fetch(`https://react-movies-4255c-default-rtdb.firebaseio.com/movies/${id}.json`,{  
    method: "DELETE"
    });
    setMovies(prevList =>{
      return prevList.filter(movieId=>movieId.id !== id);
    })
  }
  

  let content = <p>Found no movies.</p>;
  if(movies.length > 0){
    content = <MoviesList movies={movies} onDelete={deleteMovieHandler} />
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
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
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
