export const getUrl = () => {
  const baseUrl: string = "https://api.intra.42.fr/oauth/authorize";
  const options = {
    redirect_uri: import.meta.env.VITE_BACK_BASE_URL + "/login", //cambia a scuola
    client_id: import.meta.env.VITE_QUARANTADUE_UID,
    response_type: "code",
  };

  const qs = new URLSearchParams(options);
  return `${baseUrl}?${qs.toString()}`;
};
