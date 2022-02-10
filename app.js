require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

const SpotifyWebApi = require("spotify-web-api-node");
const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
app.get("/", function (req, res, next) {
  res.render("index");
});
app.get("/artists-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artists)
    .then( data => {
      res.render("artist-search-results", { artist: data.body.artists.items });
      //   console.log(
      //     `Data: ${data.body.artists.items} ${res.json(data.body.artists.items)}`
      //   );
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});
app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi
  .getArtistAlbums(req.params.artistId)
  .then((data)=>{
      res.render("albums",{album: data.body.items});
  })
});
app.get("/tracks/:albumsId", (req, res, next) => {
    spotifyApi
    .getAlbumTracks(req.params.albumsId)
    .then((data)=>{
        res.render("tracks",{tracks: data.body.items});
    })
  });

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
