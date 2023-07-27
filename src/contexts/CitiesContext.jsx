import { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useReducer } from "react";

const BASE_URL = "https://world-wide-json-data-b167ad32a9c4.herokuapp.com";

// const BASE_URL = "http://localhost:8000";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, cities: action.payload, isLoading: false, error: "" };
    case "city/loaded":
      return {
        ...state,
        currentCity: action.payload,
        isLoading: false,
        error: "",
      };
    case "city/created":
      return {
        ...state,
        cities: [...state.cities, action.payload],
        isLoading: false,
      };
    case "city/deleted":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        isLoading: false,
      };
    case "rejected": {
      return { ...state, isLoading: false, error: action.payload };
    }

    default:
      return state;
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data.data });
      } catch (err) {
        dispatch({
          type: "rejected",
          payload: "There was an error loading cities...",
        });
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    try {
      dispatch({ type: "loading" });

      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();

      dispatch({ type: "city/loaded", payload: data.data });
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: "There was an error loading the city...",
      });
    }
  }

  async function createCity(newCity) {
    try {
      dispatch({ type: "loading" });

      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      //keep the ui state in sync with remote state
      dispatch({ type: "city/created", payload: data.data });
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: "There was an error creating the city...",
      });
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: "loading" });

      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });

      //keep the ui state in sync with remote state
      dispatch({ type: "city/deleted", payload: id });
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: "There was an error creating the city...",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
        error,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const content = useContext(CitiesContext);
  if (content === undefined) {
    throw new Error("useCities must be used within a CitiesProvider");
  }
  return content;
}

export { CitiesProvider, useCities };
