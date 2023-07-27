import Spinner from "../../UI/Spinner.jsx";
import Message from "../../UI/Message";
import CountryItem from "./CountryItem";
import styles from "./CountriesList.module.css";
import { v4 as uuidv4 } from "uuid";
import { useCities } from "../../../contexts/CitiesContext";

function CountriesList() {
  const { cities, isLoading } = useCities();
  console.log("cities=", cities);

  if (isLoading) <Spinner></Spinner>;

  if (!cities.length)
    return (
      <Message message="Add your first city by clicking a city on the map"></Message>
    );

  //從data(cities)拿出所有的country(不重複)，且裡面要的屬性是country, emoji
  const countries = cities.reduce((acc, city) => {
    const { country, emoji } = city;
    if (!acc.some((accItem) => accItem.country === country)) {
      acc.push({ country, emoji });
    }
    return acc;
  }, []);

  console.log(countries);

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={uuidv4()}></CountryItem>
      ))}
    </ul>
  );
}

export default CountriesList;
