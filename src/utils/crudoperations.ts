import axios from "axios";

export const createUser = async (
  email: string,
  password: string,
  login: string
) => {
  const url = import.meta.env.VITE_BACK_BASE_URL + `/usrs/`;
  try {
    const resp = await axios.post(url, {
      email: email,
      password: password,
      login: login,
    });
    return resp.status;
  } catch (error) {
    return 500;
  }
};
