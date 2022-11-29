import SpotifyWebApi from "spotify-web-api-node";

const scopes = [
  "ugc-image-upload",
  "streaming",
  "playlist-read-collaborative",
  "playlist-read-private",
  "user-read-private",
  "user-read-email",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-playback-position",
  "user-read-currently-playing",
  "user-read-recently-played",
].join(",");

const params = {
  scope: scopes,
};

const query = new URLSearchParams(params).toString();

const LOGIN_URL = `https://accounts.spotify.com/authorize?${query}`;

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
  redirectUri: "http://localhost:3000/browse",
});

export default spotifyApi;
export { LOGIN_URL };
