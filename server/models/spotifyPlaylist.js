var SpotifyWebApi = require('spotify-web-api-node');

var scopes = ['playlist-read-private', 'playlist-modify-public', 'playlist-modify-private'],
  clientId = "873379a32a354918b0a54f4f79736716",
  clientSecret = process.env.CLIENT_SECRET,
  state = 'jazz-and-eri-women-powahhh';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

exports.searchForArtist = function(artistName) {
  return spotifyApi.searchArtists(artistName)
    .then(function(data){
      return data.body.artists.items;
    });
};

exports.getTracksAndCreatePlaylist = function(arrayOfArtists, userId, accessToken, festivalName){
  fetchSongsFromArtists(arrayOfArtists)
    .then(function(trackIDsArray){
      newPlaylist(userId, accessToken, festivalName, [].concat.apply([],trackIDsArray));
    });
};

newPlaylist = function(username, accessTok, festivalName, trackIDsArray){
  changeAccessToken(accessTok);
  createPlaylist(username, 'Playfest: '+festivalName)
    .then(function(playlistID){
      addTracksToPlaylist(username, playlistID, trackIDsArray);
    });
};

changeAccessToken = function(accessTok){
  spotifyApi.setAccessToken(accessTok);
};

fetchSongsFromArtists = function(artists){
  return Promise.all(artists.map(function(artist){
    return fetchArtistTracks(artist);
  }));
};

fetchArtistTracks = function(artist) {
  return getTopArtistTracks(artist)
    .then(parseSongsToUri);
};

parseSongsToUri = function(songList){
  return songList.tracks.items.map(function(song) {
    return song.uri;
  });
};

getTopArtistTracks = function (artistName){
  return spotifyApi.searchTracks('artist:'+artistName,{limit: 10})
    .then(function(data){
      return data.body;
    }, function(err) {
      console.error('Something went wrong when searching tracks', err);
    });
};

createPlaylist = function (username, playlistTitle){
  return spotifyApi.createPlaylist(username, playlistTitle, {'public' : false})
  .then(function(data){
    console.log('Your playlist ' +playlistTitle+ ' was created!');
    return data.body.id;
  }, function(err){
    console.log('Something went wrong when creating playlist!', err);
  });
};

addTracksToPlaylist = function(username, playlistID, trackIDsArray){
  spotifyApi.addTracksToPlaylist(username, playlistID, trackIDsArray)
    .then(function(data){
      console.log('Added tracks to playlist!');
    }, function(err){
      console.log('Something went wrong when adding tracks', err);
    });
};
