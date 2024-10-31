import "./App.css";
import PropTypes from "prop-types";
import "@fortawesome/fontawesome-free/css/all.min.css";
import clearIcon from "./assets/clear.png";
import cloudIcon from "./assets/cloud.png";
import drizzleIcon from "./assets/drizzle.png";
import rainIcon from "./assets/rainIcon.png";
import snowIcon from "./assets/snowIcon.png";
import windIcon from "./assets/windIcon.png";
import humidityI from "./assets/humidity1.png";
import { useEffect, useState } from "react";

// pass the props to the Weatherdetails component
const Weatherdetails = ({ icon, temp, city, country, lat, log, humidity, wind }) => {
  return (
    <>
      <div className="image">
        <img src={icon} alt="Image" />
      </div>
      <div className="temp">{temp}°C</div>
      <div className="city">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div>
          <span className="lat">Latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className="log">Longitude</span>
          <span>{log}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidityI} alt="humidity" className="icon" />
          <div className="data">
            <div className="humidity-percent">{humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={windIcon} alt="wind" className="icon" />
          <div className="data">
            <div className="wind-percent">{wind}Km/h</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  );
};

Weatherdetails.propTypes = {
  icon: PropTypes.string.isRequired,
  temp: PropTypes.number.isRequired,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  lat: PropTypes.number.isRequired,
  log: PropTypes.number.isRequired,
  humidity: PropTypes.number.isRequired,
  wind: PropTypes.number.isRequired,
};

const App = () => {
  const api_key = "f36210f3029df6070dc6f3fcef54f4e2";
  const [text, setText] = useState("Colombo");
  const [icon, setIcon] = useState(clearIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState(0);
  const [log, setLog] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);
  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const weatherIcon = {
    "01d": clearIcon,
    "01n": clearIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "11d": rainIcon,
    "11n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon,
  };

  const search = async () => {
    setLoading(true);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.cod === "404") {
        console.error("City not found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }
      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLog(data.coord.lon);
      setTemp(Math.floor(data.main.temp));

      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIcon[weatherIconCode] || clearIcon);
      setCityNotFound(false);
    } catch (error) {
      console.error("An error occurred", error.message);
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCity = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  useEffect(() => {
    search();
  }, []);

  return (
    <>
      <div className="container">
        <div className="input-container">
          <input
            type="text"
            className="cityInput"
            placeholder="Search City"
            onChange={handleCity}
            value={text}
            onKeyDown={handleKeyDown}
          />
          <div className="search-icon" onClick={search}>
            <i className="fas fa-search"></i>
          </div>
        </div>
        {!loading && !cityNotFound && (
          <Weatherdetails
            icon={icon}
            temp={temp}
            city={city}
            country={country}
            lat={lat}
            log={log}
            humidity={humidity}
            wind={wind}
          />
        )}
        {loading && <div className="loading-message">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        {cityNotFound && <div className="city-not-found">City not found</div>}
        <p className="copyright">
          Designed by <span>Nasik Don</span>
        </p>
      </div>
    </>
  );
};

export default App;