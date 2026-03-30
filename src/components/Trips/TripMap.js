import React, { useEffect, useState } from "react";
import { GoogleMap, DirectionsRenderer, useLoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "350px"
};

const TripMap = ({ departure, arrival }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY
  });

  const [directions, setDirections] = useState(null);
  const [center, setCenter] = useState({ lat: 36.8065, lng: 10.1815 });

  useEffect(() => {
    if (!departure || !arrival || !isLoaded) return;

    const service = new window.google.maps.DirectionsService();
    service.route(
      {
        origin: departure,
        destination: arrival,
        travelMode: window.google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);

          // Recentre sur le milieu de l'itinéraire
          const route = result.routes[0].overview_path;
          const midPoint = route[Math.floor(route.length / 2)];
          setCenter({ lat: midPoint.lat(), lng: midPoint.lng() });
        } else {
          console.error("Erreur directions:", status);
        }
      }
    );
  }, [departure, arrival, isLoaded]);

  if (!isLoaded) return <p style={{ textAlign: "center" }}>Chargement de la carte...</p>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={6}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false
      }}
    >
      {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
  );
};

export default TripMap;