import CityItem from "./CityItem";
import styles from "./CityList.module.css";
import Spinner from "../../UI/Spinner";
import Message from "../../UI/Message";
import { useCities } from "../../../contexts/CitiesContext";

function CityList() {
  const { cities, isLoading, error } = useCities();

  if (error) throw new Error(error);

  if (isLoading) <Spinner></Spinner>;

  if (!cities.length)
    return (
      <Message message="Add your first city by clicking a city on the map"></Message>
    );

  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem city={city} key={city.id}></CityItem>
      ))}
    </ul>
  );
}

export default CityList;
