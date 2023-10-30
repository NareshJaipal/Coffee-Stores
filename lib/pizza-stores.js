import { createApi } from "unsplash-js";
import useTrackLocation from "../hooks/use-track-location";

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
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

  return unsplashResults;
};

export const fetchPizzaStores = async (
  latLong = "24.888151915782476%2C67.00405267277932",
  limit = 6
) => {
  const photo = await getUnsplashImages();

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: process.env.NEXT_PUBLIC_FORSQUARE_API_KEY,
    },
  };

  const response = await fetch(
    getUrlForPizzaStores(latLong, "Pizza", limit),
    options
  );
  const data = await response.json();
  return data.results.map((result, indx) => {
    return {
      name: result.name,
      id: result.fsq_id,
      address: result.location.address || result.location.formatted_address,
      locality: result.location.locality,
      imgUrl: photo.length > 0 ? photo[indx] : null,
    };
  });

  // .catch(err => console.error(err));
};
