import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
/// ////////////////////
import useSpotify from '../hooks/useSpotify';
import { db, getDocs, collection, query } from '../utils/firebase';
/// ////////////////////
const Context = createContext();

export const StateProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [spotifyPlaylists, setSpotifyPlaylists] = useState();
  const [userPlaylists, setUserPlaylists] = useState();
  // Player states
  const [deviceId, setDeviceId] = useState();
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(null);
  const [duration, setDuration] = useState();
  const [currentUriData, setCurrentUriData] = useState(null);
  const [currentTrackIsLiked, setCurrentTrackIsLiked] = useState(false);
  const spotifyApi = useSpotify();
  // Cookies
  const { data: session } = useSession();

  const calcDuration = (ms) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.round((ms % 60000) / 1000);

    return sec === 60
      ? `${min + 1}:00`
      : `${min}:${sec.toString().padStart(2, '0')}`;
  };

  // Init player
  useEffect(() => {
    if (!session || !spotifyApi) return;

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: 'Web Playback SDK',
        getOAuthToken: (cb) => {
          cb(session.user.accessToken);
        },
        volume: 0.5,
      });

      spotifyPlayer.addListener('ready', ({ device_id }) => {
        // console.log('Ready with Device ID', device_id);
        setDeviceId(device_id);
      });

      spotifyPlayer.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      spotifyPlayer.addListener('player_state_changed', (state) => {
        if (!state) return;

        setDuration(state.duration);
        setCurrentTrack(state.track_window.current_track);
        setIsPlaying(!state.paused);
      });

      spotifyPlayer.connect();
    };
  }, [session, spotifyApi]);

  // Play song
  useEffect(() => {
    if (!currentUriData) return;

    const playSong = async () => {
      if (!currentUriData) return;

      const bodyData = {
        deviceId,
        context_uri: currentUriData.uri,
      };

      if (currentUriData.offset) bodyData.offset = currentUriData.offset;

      await fetch('/api/fetchPlaySong', {
        body: JSON.stringify(bodyData),
        method: 'POST',
      });
    };

    playSong();
  }, [currentUriData]);

  const getLibrary = async () => {
    const q = query(collection(db, 'library'));
    const querySnapshot = await getDocs(q);
    const data = [];

    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      data.push(doc.data());
    });

    return data.length === 0 ? null : data;
  };

  const getSpotifyPlaylists = async () => {
    const querySnapshot = await getDocs(collection(db, 'playlist'));
    const data = [];
    querySnapshot.forEach((doc) => data.push(doc.data()));

    setSpotifyPlaylists(data);

    return data.length === 0 ? null : data;
  };

  const getUserPlaylists = async () => {
    const q = query(collection(db, 'user-playlist'));
    const querySnapshot = await getDocs(q);
    const data = [];

    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      data.push(doc.data());
    });

    setUserPlaylists(data);

    return data;
  };

  return (
    <Context.Provider
      value={{
        isLoading,
        spotifyPlaylists,
        userPlaylists,
        deviceId,
        currentTrack,
        isPlaying,
        currentUriData,
        duration,
        currentTrackIsLiked,
        getLibrary,
        getSpotifyPlaylists,
        getUserPlaylists,
        setDeviceId,
        setCurrentTrack,
        setIsPlaying,
        setIsLoading,
        setCurrentUriData,
        calcDuration,
        setCurrentTrackIsLiked,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
