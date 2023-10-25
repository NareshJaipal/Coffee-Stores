const getUrlForPizzaStores = (latlong, query, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latlong}&limit=${limit}`;
};

export const fetchPizzaStores = async () => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: process.env.FORSQUARE_API_KEY,
    },
  };

  const response = await fetch(
    getUrlForPizzaStores("24.888151915782476%2C67.00405267277932", "Pizza", 6),
    options
  );
  const data = await response.json();

  return data.results;

  // .catch(err => console.error(err));
};
