const express = require('express');
const path = require('path')
const ejs = require('ejs');
const axios = require('axios');
require('dotenv').config()

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.render('home');
})

app.post('/', (req, res) => {
    const year = req.body.year;
    let url = `http://www.omdbapi.com/?apikey=${process.env.API_KEY}&t=${req.body.movie}`;
    if (year) {
        url = url + `&y=${year}`;
    }

    axios.get(url)
        .then((response) => {
            if (response.data.Response === 'True') {
                res.render('movie', {
                    movieTitle: response.data.Title,
                    moviePlot: response.data.Plot,
                    moviePoster: response.data.Poster === 'N/A' ? 'images/noposter.jpg' : response.data.Poster,
                    imdbRating: typeof response.data.Ratings[0] === 'undefined' ? "-/-" : response.data.Ratings[0].Value,
                    rottenRating: typeof response.data.Ratings[1] === 'undefined' ? "-/-" : response.data.Ratings[1].Value,
                    collection: typeof response.data.BoxOffice === 'undefined' ? "-/-" : response.data.BoxOffice,
                    genre: response.data.Genre,
                    actors: response.data.Actors,
                    director: response.data.Director,
                    language: response.data.Language,
                    awards: response.data.Awards,
                });
            } else {
                res.render("error");
            }
        })
        .catch((err) => {
            res.render('error');
        })
})

app.get('/about', (req, res) => {
    res.render('about');
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});