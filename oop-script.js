//the API documentation site https://developers.themoviedb.org/3/
class App {
    static async run() {
        const movies = await APIService.fetchMovies();
        const genres = await APIService.fetchGenres();
        HomePage.renderMovies(movies);
        MoviesByGenre.renderGenres(genres);
    }

    static async runActorsListPage() {
        const actors = await APIService.fetchActors();
        ActorsListPage.renderActors(actors);
    }

    static async runAboutPage() {
        AboutPage.renderAbout();
    }

    static async runNowPlaying() {
        const data = await APIService.fetchNowPlaying();
        HomePage.renderMovies(data);
    }

    static async runPopularMovies() {
        const data = await APIService.fetchPopular();
        HomePage.renderMovies(data);
    }

    static async runTopRatedMovies() {
        const data = await APIService.fetchTopRated();
        HomePage.renderMovies(data);
    }

    static async runUpcomingMovies() {
        const data = await APIService.fetchUpcoming();
        HomePage.renderMovies(data);
    }

    static async runSearch(queryString) {
        const data = await APIService.fetchSearch(queryString);
        HomePage.renderMovies(data)
    }

    static async runActorSearch(queryString) {
        const data = await APIService.fetchActorSearch(queryString);
        ActorsListPage.renderActors(data);
    }
}

//----------------------------------------------------------------------------------------------------

class APIService {
    static TMDB_BASE_URL = "https://api.themoviedb.org/3";

    static async fetchMovies() {
        const url = APIService._constructUrl(`movie/now_playing`);
        //   console.log(url);
        const response = await fetch(url);
        const data = await response.json();
        return data.results.map((movie) => new Movie(movie));
    }

    static async fetchMovie(movieId) {
        const url = APIService._constructUrl(`movie/${movieId}`);
        const response = await fetch(url);
        const data = await response.json();
        console.log(data)
        return new Movie(data);
    }

    static async fetchActorsPerMovie(movieId) {
        const url = APIService._constructUrl(`movie/${movieId}/credits`);
        const response = await fetch(url);
        const data = await response.json();
        const actors = data.cast
            .map((staff) => new Staff(staff))
            .filter((staff) => staff.isActor())
            .slice(0, 5);
        return actors;
    }

    static async fetchSimilarMovies(movieId) {
        const url = APIService._constructUrl(`movie/${movieId}/similar`);
        const response = await fetch(url);
        const data = await response.json();
        const similarMovies = data.results
            .map((movie) => new Movie(movie))
            .slice(0, 5);
        return similarMovies;
    }

    static async fetchTrailer(movieId) {
        const url = APIService._constructUrl(`movie/${movieId}/videos`);
        const response = await fetch(url);
        const data = await response.json();
        const trailer = data.results ? data.results[0] : null;
        return new Trailer(trailer);
    }

    static async fetchRatingMovie(movieId) {
        const url = APIService._constructUrl(`/movie/${movieId}`);
        const response = await fetch(url);
        const data = await response.json();
        const rat = data.vote_average;
        const vote = data.vote_count
        return { rat, vote };
    }

    static async fetchDirectorPerMovie(movieId) {
        const url = APIService._constructUrl(`movie/${movieId}/credits`);
        const response = await fetch(url);
        const data = await response.json();
        const directors = data.crew
            .map((staff) => new Staff(staff))
            .filter((staff) => staff.isDirector())
        return directors;
    }

    static async fetchActors() {
        const url = APIService._constructUrl(`person/popular`);
        const response = await fetch(url);
        const data = await response.json();
        const actors = data.results.map((staff) => new Staff(staff));
        return actors;
    }

    static async fetchActor(personId) {
        const url = APIService._constructUrl(`person/${personId}`)
        const response = await fetch(url)
        const data = await response.json()
        return new Staff(data)
    }

    static async fetchActorsMovies(personId) {
        const url = APIService._constructUrl(`person/${personId}/movie_credits`)
        const response = await fetch(url)
        const data = await response.json()
        return data.cast.map(movie => new Movie(movie)).slice(0, 5)
    }

    static async fetchGenres() {
        const url = APIService._constructUrl(`genre/movie/list`)
        const response = await fetch(url)
        const data = await response.json()
        return data.genres;
    }

    static async fetchDiscover(genreId) {
        const url = APIService._constructUrl(`discover/movie`) + `&with_genres=${genreId}`;
        const response = await fetch(url)
        const data = await response.json()
        return data.results.map(movie => new Movie(movie));
    }

    static async fetchNowPlaying() {
        const url = APIService._constructUrl(`movie/now_playing`)
        const response = await fetch(url)
        const data = await response.json()
        const result = data.results.map(movie => new Movie(movie));
        return result;
    }

    static async fetchPopular() {
        const url = APIService._constructUrl(`movie/popular`)
        const response = await fetch(url)
        const data = await response.json()
        return data.results.map(movie => new Movie(movie));
    }

    static async fetchUpcoming() {
        const url = APIService._constructUrl(`movie/upcoming`)
        const response = await fetch(url)
        const data = await response.json()
        return data.results.map(movie => new Movie(movie));
    }

    static async fetchTopRated() {
        const url = APIService._constructUrl(`movie/top_rated`)
        const response = await fetch(url)
        const data = await response.json()
        return data.results.map(movie => new Movie(movie));
    }

    static async fetchLatest() {
        const url = APIService._constructUrl(`movie/latest`)
        const response = await fetch(url)
        const data = await response.json()
        return data.results.map(movie => new Movie(movie));
    }

    static async fetchSearch(queryString) {
        const url = APIService._constructUrl(`search/movie`) + `&query=${queryString}`
        const response = await fetch(url)
        const data = await response.json()
        return data.results.map(movie => new Movie(movie));
    }

    static async fetchActorSearch(queryString) {
        const url = APIService._constructUrl(`search/person`) + `&query=${queryString}`
        const response = await fetch(url)
        const data = await response.json()
        return data.results.map(actor => new Staff(actor));
    }

    static _constructUrl(path) {
        return `${this.TMDB_BASE_URL}/${path}?api_key=${atob(
            "ZjJhN2MzNTI5MDg3YjgxZGFjYTUxOGM4MzhlMDY1NTE="
        )}`;
    }
}

//----------------------------------------------------------------------------------------------------

class HomePage {
    static container = document.getElementById("container");
    static renderMovies(movies) {
        movies.forEach((movie) => {
            const movieDiv = document.createElement("div");
            movieDiv.classList.add("py-5", "bg-light")
            movieDiv.setAttribute('id', 'main-div');
            const movieImage = document.createElement("img");
            movieImage.setAttribute('id', 'main-div-img');
            movieImage.classList.add("movie-image-div", "img-thumbnail", "img-fluid")
            movieImage.src = `${movie.backdropUrl}`;
            const movieTitle = document.createElement("h3");
            movieTitle.classList.add("text-dark")
            movieTitle.textContent = `${movie.title}`;
            movieImage.addEventListener("click", function () {
                Movies.run(movie.id);
            });
            movieDiv.appendChild(movieTitle);
            movieDiv.appendChild(movieImage);
            this.container.appendChild(movieDiv);
        });
    }
}

//----------------------------------------------------------------------------------------------------
class AboutPage {
    static container = document.getElementById("container");
    static renderAbout() {
        ActorPage.container.innerHTML = `
    
      <div class="row d-flex justify-content-center p-5">
      <div class="container-fluid d-flex justify-content-center p-2">
      <h3> Movies are nice aren't they?</h3>
      </div>
      <div class="container-fluid d-flex justify-content-center p-2">
      <h3>Developing this page was nice too...</h3>
      </div>
      <div class="container-fluid d-flex justify-content-center p-2">
      <h3>A bit too nice if you'd ask us...</h3>
      </div>
      <div class="container-fluid d-flex justify-content-center p-2 font-italic ">
      <h3>It was <b class="font-weight-bold text-danger"> painful </b>but it was well worth it!</h3>
      </div>
      <div class="container-fluid d-flex justify-content-center p-2">
      <p>Coded and Designed for Re:Coded Istanbul 2021 Bootcamp</p>
      </div>
    </div>
    
    `
    }
}
//----------------------------------------------------------------------------------------------------

class ActorsListPage {
    static container = document.getElementById("container");

    static renderActors(actors) {
        actors.forEach(actor => {
            const actorDiv = document.createElement("div");
            actorDiv.classList.add("bg-light", "actor-div")
            const actorImage = document.createElement("img");
            actorImage.classList.add("actor-image-div", "img-thumbnail", "img-fluid")
            actorImage.src = `${actor.profilePathUrl}`;
            const actorName = document.createElement("p");
            actorName.textContent = `${actor.name}`;
            actorImage.addEventListener("click", function () {
                Actors.runActor(actor.id);
            });
            actorDiv.appendChild(actorName);
            actorDiv.appendChild(actorImage);
            this.container.appendChild(actorDiv);
        });
    }
}

class Actors {
    static async runActor(id) {
        const singleActorData = await APIService.fetchActor(id);
        const actorsData = await APIService.fetchActors();
        const knownForData = await APIService.fetchActorsMovies(id);
        const daBigData = {
            singleActorData,
            actorsData,
            knownForData
        }
        ActorPage.renderActorsSection(daBigData);
    }
}

class ActorPage {
    static container = document.getElementById("container");
    static renderActorsSection(data) {
        ActorsSection.renderActors(data);
    }
}

class ActorsSection {
    static renderActors(actorData) {
        const {
            singleActorData,
            actorsData,
            knownForData
        } = actorData;

        const knownFor = knownForData.map(movie => {
            return `
      <div class="movie-card">
        <h5 class="movie-name fluid">${movie.title}</h2>
        <img id=${movie.id} class="movie-backdrop fluid" src=${movie.backdropUrl}>
        <p class="character-name fluid">As ${movie.character}</p>
      </div>
      `
        }).join("")

        ActorPage.container.innerHTML = `
    <div class="container">
      <div class="row">
        <div class="col-sm-4">
          <img id="actor-backdrop" class = "actor-image-div img-thumbnail img-fluid" src=${singleActorData.profilePathUrl}> 
        </div>
        <div class="col-sm-8">
          <h2 id="actor-name"> ${singleActorData.name}</h2>
          <p id="actor-gender"><b>Gender:</b> ${singleActorData.getGender}</p>
          <p id="actor-birthday"><b>Birthday:</b> ${singleActorData.birthday}</p>
          ${singleActorData.getDeathDay}
          <p id="actor-popularity"><b>Popularity:</b> ${singleActorData.popularity}</p>
        </div>
      </div>
      <div>
        <h3>Biography:</h3>
        <p id="actor-biography"> ${singleActorData.biography}</p>
      </div>
        <h3>Known For:</h3>
      <div class="row container.fluid">
          ${knownFor}
      </div>
    </div>
    `
        const knownForMovies = document.getElementsByClassName("movie-backdrop");
        Array.from(knownForMovies).forEach(image => image.addEventListener("click", function (e) {
            Movies.run(e.target.id)
        }))
    }
}

//----------------------------------------------------------------------------------------------------

class Genres {
    static async run(genre) {
        MoviesByGenrePage.renderDiscoveredByGenre(genre);
    }
}

class MoviesByGenrePage {
    static container = document.getElementById('container');
    static renderDiscoveredByGenre(genres) {
        genres.forEach(genre => {
            const genreDiv = document.createElement("div");
            genreDiv.classList.add("genre-div", "album", "py-5", "bg-light")
            const genreImage = document.createElement("img");
            genreImage.setAttribute('id', 'main-div-img');
            genreImage.classList.add("genre-image-div")
            genreImage.src = `${genre.backdropUrl}`;
            const genreName = document.createElement("h3");
            genreName.classList.add("text-dark")
            genreName.textContent = `${genre.title}`;
            genreImage.addEventListener("click", function () {
                Movies.run(genre.id);
            })
            genreDiv.appendChild(genreName);
            genreDiv.appendChild(genreImage);
            this.container.appendChild(genreDiv);
        })
    }
}

class MoviesByGenre {
    static renderGenres(genres) {
        const dropdown = document.getElementById("dropdown-genre-list");
        dropdown.innerHTML = genres.map(genre => {
            return `<a class="dropdown-item" id=${genre.id} href="#">${genre.name}</a>`
        }).join("")
        const dropdownItems = document.querySelectorAll(".dropdown-item");
        const dropdownItemsArr = [...dropdownItems];
        dropdownItemsArr.map(item => {
            item.addEventListener("click", async function () {
                const data = await APIService.fetchDiscover(item.id)
                HomePage.container.innerHTML = ""
                Genres.run(data);
            })
        })
    }
}

//----------------------------------------------------------------------------------------------------

class Movies {
    static async run(id) {
        const movieData = await APIService.fetchMovie(id);
        const actorData = await APIService.fetchActorsPerMovie(id);
        const similarMoviesData = await APIService.fetchSimilarMovies(id);
        const trailerData = await APIService.fetchTrailer(id);
        const ratingData = await APIService.fetchRatingMovie(id)
        const directorData = await APIService.fetchDirectorPerMovie(id);

        const daBigData = {
            movieData,
            actorData,
            similarMoviesData,
            trailerData,
            ratingData,
            directorData,
        };

        MoviePage.renderMovieSection(daBigData);
    }
}

class MoviePage {
    static container = document.getElementById("container");
    static renderMovieSection(data) {
        MovieSection.renderMovie(data);
    }
}

class MovieSection {
    static renderMovie(data) {
        const {
            movieData,
            actorData,
            similarMoviesData,
            trailerData,
            ratingData,
            directorData,
        } = data;

        const actors = actorData.reduce((acc, curr) => {
            return (acc = `${acc}
      <div class=" bg-light actor-div">
        <p class="actor-name">${curr.name}</p>
        <img class="actor-image-div img-thumbnail img-fluid" id=${curr.id} src=${curr.profilePathUrl}>
      </div>`);
        }, "");

        const director = directorData.reduce((acc, curr) => {
            return (acc = `${acc}
      <div class="director-div  bg-light actor-div">
        <img class="actor-image-div img-thumbnail img-fluid" src="${curr.profilePathUrl}">
        <p class="director-name">${curr.name}</p>
      </div>`);
        }, "");

        const similarMovies = similarMoviesData
            .map((curr) => {
                return `
      <div class=" album row production-companies-div">
        <div class="col-md-8 "">
          <img class="similar-movies-image " width="300" max-heigth="100%" id=${curr.id} src =${curr.backdropUrl}>
          <h6 id="sim-mov-title">${curr.title}</h6>
        </div>
      </div>`
            })
            .join("");

        const production = movieData.getProdInfo.map((curr) => {
            return `
      <div class="production-companies-div bg-light actor-div">
        <div class="col-md-8">
          <img id="production-company-image img-thumbnail img-fluid" width ="200"src =${curr.logoPath}>
          <p id="production-company-name">${curr.name}</p>
        </div>
      </div>`
        })
            .join("");

        MoviePage.container.innerHTML = `
    <div class="row">
      <div class="row ">

        <div class="col-sm-6 fluid" >
          <ul class="list-group list-group-flush fluid">
            <li id="movie-title" class="list-group-item"><h3>${movieData.title}</h3></li>
            <li id="genres" class="list-group-item"><p class ="bold">Genres: ${movieData.getGenres}</p></li>
            <li id="movie-release-date" class="list-group-item">Release Date: ${movieData.releaseDate}</li>
            <li id="movie-runtime" class="list-group-item">Runtime: ${movieData.runtime}</li>
            <li id="movie-language" class="list-group-item">Movie Language: ${movieData.getLanguage}</li>
            <li id="movie-rating" class="list-group-item">Rating: ${ratingData.rat}</li>
            <li id="movie-votes" class="list-group-item">Votes: ${ratingData.vote}</li>
          </ul>
        </div>

        <div class="col-sm-6" >
         <img id ="movie-backdrop" width="720" src=${movieData.backdropUrl}>
        </div>

        <div class="container-fluid d-flex justify-content-center p-2">
          <h3 class="text-danger">Overview</h3>
        </div>

        <div class="container-fluid d-flex justify-content-center p-2">
          <p id="movie-overview" class="container-fluid d-flex justify-content-center p-2">${movieData.overview}</p>
        </div>
  
      </div>

      <div class="row ">
        
        <div>  
          
        </div>  

        <div class="d-flex flex-row bd-highlight mb-3">
          <h3>Actors:</h3>
          ${actors}
        </div>

        
        <div class="d-flex flex-row bd-highlight mb-3"><h3>Directors:</h3>${director}</div>

        
        <div class="d-flex flex-row bd-highlight mb-3"><h3>More like ${movieData.title}: </h3>${similarMovies}</div>

        <div class="row d-flex justify-content-center p-5">
          <h3 class="font-weight-bold">Production:</h3>${production}
        </div>

        <div class="col-sm-6" >
         <iframe class= "text-center" width="940" height="500" src=${trailerData.trailerUrl}></iframe>
        </div>

      </div>
        </div>   
    </div>
    </div>

  `;

        const actorImages = document.getElementsByClassName("actor-image");
        Array.from(actorImages).forEach(image => image.addEventListener("click", function (e) {
            Actors.runActor(e.target.id)
        }))

        const similarMovieImages = document.getElementsByClassName("similar-movies-image");
        Array.from(similarMovieImages).forEach(image => image.addEventListener("click", function (e) {
            Movies.run(e.target.id)
        }))
    }
}

//----------------------------------------------------------------------------------------------------

class Movie {
    static BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
    static NOT_FOUND = "./notFound300.png"
    constructor(json) {
        this.id = json.id;
        this.title = json.title;
        this.character = json.character;
        this.releaseDate = json.release_date;
        this.runtime = json.runtime + " minutes";
        this.overview = json.overview;
        this.backdropPath = json.backdrop_path;
        this.language = json.original_language;
        this.genres = json.genres;
        this.production = json.production_companies;
    }

    get getProdInfo() {
        return this.production.map(el => {
            return { name: el.name, logoPath: el.logo_path ? Movie.BACKDROP_BASE_URL + el.logo_path : Movie.NOT_FOUND }
        })
    }

    get getGenres() {
        return this.genres.map(el => {
            return `<span> ${el.name}</span>`
        }).join("")
    }

    get getLanguage() { return this.language.toUpperCase(); }

    get backdropUrl() { return this.backdropPath ? Movie.BACKDROP_BASE_URL + this.backdropPath : Movie.NOT_FOUND }
}

class Staff {
    static PROFILE_BASE_URL = "http://image.tmdb.org//t/p/w138_and_h175_face";
    static NOT_FOUND = "./notFound138.png"
    constructor(json) {
        this.id = json.id;
        this.name = json.name;
        this.gender = json.gender;
        this.birthday = json.birthday
        this.popularity = json.popularity;
        this.biography = json.biography;
        this.deathday = json.deathday;
        this.profession = json.known_for_department;
        this.path = json.profile_path ? json.profile_path : json.path;
        this.job = json.job;
        this.starredMovies = json.known_for
    }
    get getDeathDay() { return this.deathday !== null ? `<p id="actor-deathday"><b>Date of Death:</b> ${this.deathday}</p>` : " " }

    get getGender() { return this.gender === 2 ? "Male" : "Female" }

    get profilePathUrl() { return this.path ? Staff.PROFILE_BASE_URL + this.path : Staff.NOT_FOUND; }

    isActor() { return this.profession === "Acting"; }

    isDirector() { return this.job === "Director"; }
}

class Trailer {
    static TRAILER_BASE_URL = "https://www.youtube.com/embed/";
    constructor(json) { this.key = json.key; this.site = json.site }

    get trailerUrl() { return (this.key !== null && this.site === "YouTube") ? Trailer.TRAILER_BASE_URL + this.key : `<p>Trailer not found on Youtube</p>`; }
}

//----------------------------------------------------------------------------------------------------

const actorsListPageButton = document.getElementById("actors-list-page");
actorsListPageButton.addEventListener("click", function () {
    MoviePage.container.innerHTML = ""
    App.runActorsListPage();
})

const aboutButton = document.getElementById("about-page");
aboutButton.addEventListener("click", function () {
    MoviePage.container.innerHTML = ""
    App.runAboutPage();
})

const homeButton = document.getElementById("home-page");
homeButton.addEventListener("click", function () {
    ActorsListPage.container.innerHTML = ""
    App.run();
})

const nowPlaying = document.getElementById("now-playing");
nowPlaying.addEventListener("click", function (e) {
    e.stopImmediatePropagation() //preventDefault() does not work.
    MoviePage.container.innerHTML = ""
    ActorPage.container.innerHTML = ""
    AboutPage.container.innerHTML = ""
    App.runNowPlaying();
})

const popular = document.querySelector("#popular-movies");
popular.addEventListener("click", function (e) {
    e.stopImmediatePropagation()
    MoviePage.container.innerHTML = ""
    ActorPage.container.innerHTML = ""
    AboutPage.container.innerHTML = ""
    App.runPopularMovies();
})

const topRated = document.querySelector("#toprated-movies");
topRated.addEventListener("click", function (e) {
    e.stopImmediatePropagation()
    MoviePage.container.innerHTML = ""
    ActorPage.container.innerHTML = ""
    AboutPage.container.innerHTML = ""
    App.runTopRatedMovies();
})

const upcoming = document.querySelector("#upcoming-movies");
upcoming.addEventListener("click", function (e) {
    e.stopImmediatePropagation()
    MoviePage.container.innerHTML = ""
    ActorPage.container.innerHTML = ""
    AboutPage.container.innerHTML = ""
    App.runUpcomingMovies();
})

const query = document.querySelector("#search-input");
const searchButtonMovies = document.querySelector("#search-button-movies");
searchButtonMovies.addEventListener("click", function (e) {
    e.stopImmediatePropagation()
    e.preventDefault();
    MoviePage.container.innerHTML = ""
    ActorPage.container.innerHTML = ""
    AboutPage.container.innerHTML = ""
    App.runSearch(query.value);
})

const queryActor = document.querySelector("#search-input");
const searchButtonActors = document.querySelector("#search-button-actors");
searchButtonActors.addEventListener("click", function (e) {
    e.stopImmediatePropagation()
    e.preventDefault();
    MoviePage.container.innerHTML = ""
    ActorPage.container.innerHTML = ""
    AboutPage.container.innerHTML = ""
    App.runActorSearch(queryActor.value);
})


//----------------------------------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", App.run);
