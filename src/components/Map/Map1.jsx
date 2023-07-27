import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvent,
  LayerGroup,
  Circle,
  Tooltip,
} from "react-leaflet";
import { useEffect, useState, useRef } from "react";
import { useCities } from "../../contexts/CitiesContext";

import flagemojiToPNG from "../../../Helper/flagemojiToPNG";
import useGeoLocation from "../../hooks/useGeoLocation";
import Button from "../UI/Button";
import useUrlPosition from "../../hooks/useUrlPosition";

function Map() {
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([23.5, 120.5]);
  const [isMapClicked, setIsMapClicked] = useState(false);

  const {
    isLoading: isLoadingPosition,
    position: geoLocationPosition,
    getPosition,
  } = useGeoLocation();

  const { mapLat, mapLng } = useUrlPosition();

  //sync url params with mapPosition
  useEffect(() => {
    if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
  }, [mapLat, mapLng]);

  // sync user's position with mapPosition
  useEffect(() => {
    if (geoLocationPosition) {
      setMapPosition([geoLocationPosition.lat, geoLocationPosition.lng]);
    }
  }, [geoLocationPosition]);

  return (
    <div className={styles.mapContainer}>
      {!geoLocationPosition && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPosition ? "Loading" : "Go to your Position"}
        </Button>
      )}

      <MapContainer
        className={styles.map}
        center={mapPosition}
        scrollWheelZoom={true}
        zoom={2}
      >
        <TileLayer
          maxZoom={13}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji && flagemojiToPNG(city.emoji)}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}

        {isMapClicked && (
          <LayerGroup>
            <Circle
              center={mapPosition}
              pathOptions={{
                color: "red",
                weight: 1,
                fillColor: "blue",
                fillOpacity: 0.15,
              }}
              radius={50000}
            >
              <Marker position={mapPosition}></Marker>

              <Tooltip direction="bottom" offset={[0, 0]} opacity={1}>
                You Selected here<br></br>
                Lat: <span>{mapPosition[0].toFixed(2)}</span>
                <br></br>
                Lng: <span>{mapPosition[1].toFixed(2)}</span>
              </Tooltip>
            </Circle>
          </LayerGroup>
        )}

        <SetViewOnClick />
        <ChangeCenter geoLocationPosition={geoLocationPosition} />
        <DetectClick
          onSetMapPos={setMapPosition}
          onSetMapClicked={setIsMapClicked}
        />
        {/* <SetBounds cities={cities} /> */}
      </MapContainer>
    </div>
  );
}

// function SetBounds({ cities }) {
//   const map = useMap();

//   const citiesLngArr = useMemo(() => {
//     if (cities.length === 0) return;
//     return cities.map((city) => {
//       return city.position.lng;
//     });
//   }, [cities]);

//   if (!citiesLngArr) return;

//   const maxLng = Math.max(...citiesLngArr);
//   const minLng = Math.min(...citiesLngArr);

//   const maxLngCity = cities.find((city) => city.position.lng == maxLng);
//   const minLngCity = cities.find((city) => city.position.lng == minLng);

//   map.fitBounds([
//     [maxLngCity.position.lat, maxLngCity.position.lng],
//     [minLngCity.position.lat, minLngCity.position.lng],
//   ]);

//   return null;
// }

function ChangeCenter({ geoLocationPosition }) {
  const map = useMap();
  const isFirstRender = useRef(true);

  // if (isMapClicked) {
  //   map.setView(position, 13);
  //   return null;
  // }

  useEffect(() => {
    if (!geoLocationPosition) return;
    if (geoLocationPosition && isFirstRender.current) {
      map.setView([geoLocationPosition.lat, geoLocationPosition.lng], 13);
      isFirstRender.current = false;
    }
  }, [geoLocationPosition, map]);

  return null;
}

function DetectClick({ onSetMapPos, onSetMapClicked }) {
  const navigate = useNavigate();
  const map = useMap();

  useMapEvent({
    click: (e) => {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
      onSetMapPos([e.latlng.lat, e.latlng.lng]);
      map.setView([e.latlng.lat, e.latlng.lng], 11);
      onSetMapClicked(true);
    },
  });
}

// Animated panning
function SetViewOnClick() {
  const map = useMapEvent("click", (e) => {
    map.setView(e.latlng, map.getZoom(), {
      animate: true,
    });
  });

  return null;
}

export default Map;
