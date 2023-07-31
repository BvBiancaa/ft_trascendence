import axios from 'axios';

const getQuarantadueToken = async (code) => {
  const baseUrl = 'https://api.intra.42.fr/oauth/token';
  const options = {
    grant_type: 'authorization_code',
    code: code,
    client_id: process.env.QUARANTADUE_UID,
    client_secret: process.env.QUARANTADUE_SECRET,
    redirect_uri: process.env.SELF_URL + '/login', //cambia a scuola
  };
  try {
    const { data } = await axios.post(baseUrl, options);

    return data;
  } catch (err) {
    console.log(err);
  }
};

const getQuarantadueUser = async (id_token) => {
  try {
    const { data } = await axios.get('https://api.intra.42.fr/v2/me', {
      headers: {
        Authorization: `Bearer ${id_token}`,
      },
    });
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const quarantadueAuthHandler = async (req, res) => {
  try {
    const code = req.query.code as string;
    if (!code) {
      return;
    }
    const id_token = await getQuarantadueToken(code);
    const userData = await getQuarantadueUser(id_token.access_token);
    userData.token42 = id_token.access_token;
    return userData;
  } catch (error) {
    console.log(error);
  }
};
