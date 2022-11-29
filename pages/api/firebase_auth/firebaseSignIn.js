import cookie from 'cookie';

export default (req, res) => {
  console.log(req.body);
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('currentUser', JSON.stringify(req.body), {
      httpOnly: true,
      maxAge: 60 * 60 * 60 * 24,
      path: '/',
    }),
  );

  res.statusCode = 200;
  res.json({ success: true });
};
