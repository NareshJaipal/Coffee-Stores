import { useContext, useState } from "react";
import { ACTION_TYPES, StoreContext } from "../store/store-context";

const useTrackLocation = () => {
  const [locationErrorMsg, setLocationErrorMsg] = useState("");
  // const [latLong, setLatLong] = useState("");
  const [isFindingLocation, setIsFindingLocation] = useState(false);

  const { dispatch } = useContext(StoreContext);

  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // setLatLong(`${latitude},${longitude}`);
    dispatch({
      type: ACTION_TYPES.SET_LAT_LONG,
      payload: { latLong: `${latitude},${longitude}` },
    });
    setLocationErrorMsg("");
    setTimeout(() => {
      setIsFindingLocation(false);
    }, 1000);
  };

  const error = () => {
    setLocationErrorMsg("Unable to retrieve your location");
    setTimeout(() => {
      setIsFindingLocation(false);
    }, 1000);
  };

  const handleTrackLocation = () => {
    setIsFindingLocation(true);
    if (!navigator.geolocation) {
      setTimeout(() => {
        setIsFindingLocation(false);
      }, 1000);
      setLocationErrorMsg("Geolocation is not supported by your browser");
    } else {
      // status.textContent = "Locating…";
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  return {
    handleTrackLocation,
    // latLong,
    locationErrorMsg,
    isFindingLocation,
  };
};

export default useTrackLocation;
