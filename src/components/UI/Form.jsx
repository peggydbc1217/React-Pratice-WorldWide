// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../../contexts/CitiesContext";
import useUrlPosition from "../../hooks/useUrlPosition";
import flagemojiToPNG from "../../../Helper/flagemojiToPNG";

import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import Message from "./Message";
import Spinner from "./Spinner";
import { v4 as uuidv4 } from "uuid";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState("");
  const [geoCodingError, setGeoCodingError] = useState(null);

  const { createCity, isLoading } = useCities();

  const navigate = useNavigate();
  // fetch city data from API
  const { lat, lng } = useUrlPosition();
  const [isLoadingGeoCoding, setIsLoadingGeoCoding] = useState(false);

  // useSearch params, fetch city data from API
  useEffect(() => {
    if (!lat && !lng) return;

    async function fetchCityData() {
      try {
        setIsLoadingGeoCoding(true);
        setGeoCodingError(null);
        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
        const data = await res.json();
        if (!data.countryCode)
          throw new Error(
            "That doesn't seem to be a city. CLick somewhere else."
          );
        setCityName(data.city || data.locality || "");
        setCountry(data.countryName);
        setEmoji(convertToEmoji(data.countryCode));
      } catch (err) {
        setGeoCodingError(err.message);
      } finally {
        setIsLoadingGeoCoding(false);
      }
    }
    fetchCityData();
  }, [lat, lng]);

  // form submission, create a new city by context API
  async function handleSubmit(e) {
    e.preventDefault();

    const id = uuidv4();

    if (!cityName || !date) return;
    const newCity = {
      cityName,
      country,
      date,
      notes,
      emoji,
      position: { lat, lng },
      id,
    };
    //this is an async function, should await a new city data arrived
    await createCity(newCity);
    //then redirect to cities page
    navigate("/app/cities");
  }

  if (isLoadingGeoCoding) return <Spinner></Spinner>;
  if (!lat && !lng)
    return <Message message="Please select a location on the map"></Message>;

  if (geoCodingError)
    return <Message message={geoCodingError}>{geoCodingError}</Message>;

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""} `}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{flagemojiToPNG(emoji)}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}
        <DatePicker
          id="date"
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat={"dd/MM/yyyy"}
        ></DatePicker>
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton></BackButton>
      </div>
    </form>
  );
}

export default Form;
