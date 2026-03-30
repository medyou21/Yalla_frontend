// src/context/TripContext.js
import React, { createContext, useState, useEffect } from "react";
import API from "../api/api";

export const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrips = async () => {
    try {
      const res = await API.get("/trips");
      setTrips(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const updateTrip = (tripId, update) => {
    setTrips((prev) =>
      prev.map((trip) => (trip._id === tripId ? { ...trip, ...update } : trip))
    );
  };

  return (
    <TripContext.Provider value={{ trips, loading, fetchTrips, updateTrip }}>
      {children}
    </TripContext.Provider>
  );
};