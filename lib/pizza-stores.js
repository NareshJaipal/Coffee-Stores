import { createApi } from "unsplash-js";

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
});

const getUrlForPizzaStores = (latlong, query, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latlong}&limit=${limit}`;
};

const getUnsplashImages = async () => {
  const photos = await unsplash.search.getPhotos({
    query: "pizza shops",
    page: 1,
    perPage: 10,
  });
  const unsplashResults = photos.response.results.map(
    (result) => result.urls["small"]
  );
  console.log(unsplashResults);

  return unsplashResults;
};

export const fetchPizzaStores = async () => {
  const photo = await getUnsplashImages();

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
  return data.results.map((results, indx) => {
    return {
      ...results,
      imgUrl: photo[indx],
    };
  });

  // .catch(err => console.error(err));
};
