import Places from './Places.jsx';
import {useEffect, useState} from "react";
import Error from "./Error.jsx";
import {sortPlacesByDistance} from "../loc.js";

export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching, setIsFetching] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] = useState()

  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);

      try {
        const response = await fetch('http://localhost:3000/places');
        const data = await response.json();

        if(!response.ok){
          throw new Error('Failed to fetch places.');
        }

        navigator.geolocation.getCurrentPosition(position => {
          const sortedPlaces = sortPlacesByDistance(data.places, position.coords.latitude, position.coords.longitude);
          setAvailablePlaces(sortedPlaces);
          setIsFetching(false);
        });

      } catch (error) {
        setError({message: error.message || 'Could not fetch places, please try again later.'});
        setIsFetching(false);
      }

    }

    fetchPlaces();
  }, []);

  if(error) {
    return <Error title='An error occured!' message={error.message} />;
  }

  return (
    <Places
      title="Available Places"
      loadingText="Fetching place data..."
      isLoading={isFetching}
      places={availablePlaces}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
