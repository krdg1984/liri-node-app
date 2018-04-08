require("dotenv").config();

var twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');

var keys = require('./keys.js');
var twitterKeys = keys.twitter;
var spotifyKeys = keys.spotify;

var liriInput = '';
for (var i = 3; i < process.argv.length; i++) {
    liriInput += process.argv[i] + ' ';
}


function myTweets() {

    var client = new twitter(twitterKeys);

    client.get('statuses/user_timeline', {
        screen_name: '@realDonaldTrump',
        count: 20
    }, function(error, tweets, response) {
        if (error) {

            return console.log('Oops!: ' + error);

        } else {

            console.log('------------------------');
            console.log('***These are actually Donald Trump Tweets:*** ');
            console.log('------------------------');


            for (var i = 0; i < tweets.length; i++) {
                console.log('');
                console.log('------------------------');
                console.log(tweets[i].created_at);
                console.log(tweets[i].text);
                console.log('------------------------');
            }


        }
    });
}


function spotifyThisSong(song) {


    var spotify = new Spotify(keys.spotify);


    var search;
    if (song === '') {
        search = 'The Sign Ace Of Base';
    } else {
        search = song;
    }

    spotify.search({
        type: 'track',
        query: search
    }, function(error, data) {
        if (error) {

            return console.log('Oops!: ' + error);
        } else {
            var songInfo = data.tracks.items[0];
            if (!songInfo) {

                console.log('Oh no cant find that song');

                return;
            } else {


                console.log('------------------------');
                console.log('Artist: ' + songInfo.artists[0].name);
                console.log('Song Name: ' + songInfo.name);
                console.log('Preview Link: ' + songInfo.preview_url);
                console.log('Album: ' + songInfo.album.name)

            }
        }
    });
}


function movieThis(movie) {

    var search;
    if (movie === '') {
        search = 'Mr. Nobody';
    } else {
        search = movie;
    }

    request("https://www.omdbapi.com/?t=" + search.split(' ').join('+') + "&y=&plot=short&apikey=trilogy", function(error, response, body) {
            if (!error && response.statusCode === 200) {


                console.log('Movie Information:');
                console.log('------------------------');
                console.log('Title: ' + JSON.parse(body).Title);
                console.log('Released: ' + JSON.parse(body).Released);
                console.log('Rotten Tomatoes Rating: ' + JSON.parse(body).tomatoRating);
                console.log('Country Produced: ' + JSON.parse(body).Country);
                console.log('Language: ' + JSON.parse(body).Language);
                console.log('Plot: ' + JSON.parse(body).Plot);
                console.log('Actors: ' + JSON.parse(body).Actors);

            }
        }

    )
}

function doWhatItSays() {

    fs.readFile('./random.txt', 'utf8', function(error, data) {
        if (error) {
            console.log('Oops ' + error);
            return;
        } else {

            var cms = data.split(',');
            var cmd = cms[0].trim();
            var par = cms[1].trim();

            switch (cmd) {
                case 'my-tweets':
                    myTweets();
                    break;

                case 'spotify-this-song':
                    spotifyThisSong(par);
                    break;

                case 'movie-this':
                    movieThis(par);
                    break;
            }
        }
    });
}


if (process.argv[2] === 'my-tweets') {
    myTweets();

} else if (process.argv[2] === `spotify-this-song`) {
    spotifyThisSong(liriInput);

} else if (process.argv[2] === `movie-this`) {
    movieThis(liriInput);

} else if (process.argv[2] === `do-what-it-says`) {
    doWhatItSays();

} else {


}



