import React, { useEffect, useState } from 'react';
import { View, TextInput, Image, StyleSheet, Text } from 'react-native';
import SearchIcon1 from './assets/search.png';
import HomeIcon from './assets/Home.png';
import Weather, { longitude, latitude, altitude } from './WeatherAPI';
import geo from 'countries-cities-geo';
import Future from './Future';

var currentdate = new Date();
var hours = currentdate.getHours();
var minutes = currentdate.getMinutes();

  const getWeatherIcon = (symbolCode) => {
    const iconMapping = 
    {
        
    }; 

    return iconMapping[symbolCode] || null; // No fallback to default.png for now
  };

function debounce(func, timeout = 600) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

const App = () => {
  const [location, setLocation] = useState('');
  const [xy, setXy] = useState([0, 0]);

  const countries = geo.getCountries().map((x) => x.name.common);
  useEffect(() => {
    let [city, country] = location.split(',');
    if (!city) {
      return;
    }

    country &&= countries.find((x) => x.toLocaleLowerCase() === country.toLocaleLowerCase());

    country ||=
      countries.find((country) => {
        const cities = geo.getCities(country);
        const found = cities?.find((x) => x.toLocaleLowerCase() === city?.toLocaleLowerCase());
        city = found ? found : city;
        return found;
      });
    const xy = geo.getCityGeo(country?.trim(), city?.trim());

    setXy(xy);
  }, [location]);

  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const x = xy?.[0];
    const y = xy?.[1];
    if (!(x && y)) {
      return; // Do not make an API call if the location is not provided
    }

    const apiUrl = `https://api.met.no/weatherapi/locationforecast/2.0/?lat=${x}&lon=${y}`;

    fetch(apiUrl, {
      headers: {
        'User-Agent': 'WeatherApp',
      },  
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setWeather(data))
      .catch((error) => console.error('Error:', error));
  }, [xy]);

  return (
    <View style={[styles.container, { backgroundColor: '#274AFF' }]}>
      <View style={styles.searchBar}>
        <View style={styles.homeIconContainer}>
          <Image style={styles.HomeIcon} source={{ uri: HomeIcon }} />
        </View>

        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          onChangeText={debounce((str) => setLocation(str))}
          defaultValue={location}
        />

        <Image style={styles.searchIcon} source={{ uri: SearchIcon1 }} />

        <View>
          <Text>Area: {location}</Text>

          <Text>Latitude: {xy?.[0] && xy[0]}</Text>
          <Text>Longitude: {xy?.[1] && xy[1]}</Text>
        </View>
      </View>

      <View>
        <Text style={{ fontSize: 80, marginHorizontal: 50 }}>{`time: ${hours}:${minutes}`}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.temperature}>
          {weather && (
            <View style={{ alignItems: 'center', marginTop: 20 }}>
              <Image
                source={getWeatherIcon(weather?.properties.timeseries[0].data.next_1_hours?.summary?.symbol_code)}
                style={{ height: 100, width: 100 }}
              />
              <Text style={{ fontSize: 24, color: 'white' }}>
                {weather?.ext_1_hours?.summary?.symbol_code}
              </Text>
            </View>
          )}
          <Weather weather={weather} />
        </View>
      </View>

      <Future weather={weather} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  homeIconContainer: {
    marginRight: 16,
  },
  searchInput: {
    color: 'white',
    fontSize: 16,
    flexGrow: 1,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
  searchIcon: {
    height: 40,
    width: 40,
  },
  content: {
    flex: 1,
  },
  temperature: {
    marginStart: 50,
    marginVertical: 250
  },
  schedule: {
    flexDirection: 'row',
    padding: 10,
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
    backgroundColor: 'white',
    height: 150,
    alignItems: 'flex-end',
  },
  timeslot: {
    flex: 1,
    marginHorizontal: 10,
    height: 'min-content',
    padding: 16,
    alignItems: 'center',
  },
  weatherIcon: {
    height: 48,
    width: 48,
  },
  HomeIcon: {
    height: 58,
    width: 58,
  },

  DegreeNow: {
    fontSize: 68,
  }
  

});

export default App;
