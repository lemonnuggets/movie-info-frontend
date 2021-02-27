const DATA_URL =
    "https://raw.githubusercontent.com/erik-sytnyk/movies-list/master/db.json";
const DARK = "dark";
const LIGHT = "light";

let selected = null;
let cards = {};
const scrollOptions = {
    behavior: "smooth",
    block: "center",
};
const options = {
    shouldSort: true,
    threshold: 0.4,
    keys: ["title", "actors", "director", "plot"],
};
const fuse = new Fuse([], options);

const change_theme = (theme) => {
    let bgCol = null;
    let cardBgCol = null;
    let imgBgCol = null;
    let glowCol = null;
    let shadowCol = null;
    let fontCol = null;
    if (theme === DARK) {
        bgCol = "grey";
        cardBgCol = "#280f34";
        imgBgCol = "#b30753";
        glowCol = "#bff4ed";
        shadowCol = "#555";
        // fontCol = bgCol;
        fontCol = "white";
    } else if (theme === LIGHT) {
        bgCol = "#f9ffdc";
        cardBgCol = "#c3baa4";
        imgBgCol = "#ecddc7";
        glowCol = "#c3fff1";
        shadowCol = "#555";
        // fontCol = bgCol;
        fontCol = "black";
    }
    const root = document.querySelector(":root");
    root.style.setProperty("--bg-col", bgCol);
    root.style.setProperty("--card-bg-col", cardBgCol);
    root.style.setProperty("--img-bg-col", imgBgCol);
    root.style.setProperty("--glow-col", glowCol);
    root.style.setProperty("--shadow-col", shadowCol);
    root.style.setProperty("--font-col", fontCol);
};
const toggleSelect = (element) => {
    if (selected === null) {
        selected = element;
        element?.classList.add("selected");
    } else if (selected === element) {
        selected = null;
        element?.classList.remove("selected");
    } else {
        selected.classList.remove("selected");
        selected = element;
        element?.classList.add("selected");
    }
    if (selected === element) {
        element?.scrollIntoView(scrollOptions);
    }
};

const populateDOM = async () => {
    const data = await fetch(DATA_URL);
    const json = await data.json();
    movies = json.movies;
    const container = document.querySelector(".movies-container");
    movies.forEach((movie) => {
        const moviePoster = document.createElement("img");
        moviePoster.className = "poster";
        moviePoster.src = movie.posterUrl;
        moviePoster.onload = () => {
            const posterContainer = document.createElement("div");
            posterContainer.className = "poster-container";
            posterContainer.appendChild(moviePoster);

            const infoContainer = document.createElement("div");
            infoContainer.className = "info-container";

            const movieName = document.createElement("h1");
            movieName.className = "movie-name";
            movieName.textContent = movie.title;
            infoContainer.appendChild(movieName);
            const moviePlot = document.createElement("h3");
            moviePlot.className = "movie-plot";
            moviePlot.textContent = "Plot: " + movie.plot;
            infoContainer.appendChild(moviePlot);
            const directorName = document.createElement("h3");
            directorName.className = "director-name";
            directorName.textContent = "Directed by " + movie.director;
            infoContainer.appendChild(directorName);
            const castNames = document.createElement("h3");
            castNames.className = "cast-names";
            castNames.textContent = "Cast: " + movie.actors;
            infoContainer.appendChild(castNames);

            const movieCard = document.createElement("div");
            movieCard.className = "movie-card";
            movieCard.id = `card-${movie.id}`;
            movieCard.onclick = () => toggleSelect(movieCard);
            movieCard.appendChild(posterContainer);
            movieCard.appendChild(infoContainer);

            container.appendChild(movieCard);
            cards[movie.id] = movieCard;
            fuse.add(movie);
        };
    });
};

const darkTheme = document.querySelector(".dark-theme");
const lightTheme = document.querySelector(".light-theme");
darkTheme.onclick = () => change_theme(DARK);
lightTheme.onclick = () => change_theme(LIGHT);

// document.querySelector(".search-button").onclick = () => {
//     const searchText = document.querySelector(".search-bar").value;
//     console.log(searchText);
//     const result = fuse.search(searchText);
//     console.log(result, result[0].id, cards[result[0].id]);
//     toggleSelect(cards[result[0].item.id]);
// };
document.querySelector(".search").onsubmit = (e) => {
    e.preventDefault();
    const searchText = document.querySelector(".search-bar").value;
    console.log(searchText);
    const result = fuse.search(searchText);
    console.log(result, result[0].id, cards[result[0].id]);
    toggleSelect(cards[result[0].item.id]);
};

populateDOM();
change_theme(DARK);
