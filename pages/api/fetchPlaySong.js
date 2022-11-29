const baseURI = 'https://api.spotify.com/v1';
import { authOptions } from './auth/[...nextauth].js';
import { unstable_getServerSession } from 'next-auth/next';

const fetchPlaySong = async (req, res) => {
  const data = JSON.parse(req.body);
  const session = await unstable_getServerSession(req, res, authOptions);

  const fetchBody = {
    deviceId: data.deviceId,
    context_uri: data.context_uri,
  };

  if (data.offset) fetchBody.offset = data.offset;

  await fetch(`${baseURI}/me/player/play?device_id=${data.deviceId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.user.accessToken}`,
    },
    body: JSON.stringify(fetchBody),
  }).catch((err) => console.log(err));

  res.statusCode = 200;
  res.json({ success: true });
};

export default fetchPlaySong;
