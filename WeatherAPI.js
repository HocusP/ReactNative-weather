import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native-web';

const Weather = ({ weather }) => {
  

  if (!weather) {
    return <Text style={{ fontSize: 100}} >Loading...</Text>;
  }

  const airTemperature = weather.properties.timeseries[0].data.instant.details.air_temperature;
  const windSpeed = weather.properties.timeseries[0].data.instant.details.wind_speed;
  const Time = weather.properties.timeseries.time;

  return (
    <View>
      <Text style={{ fontSize: 100 }}>
        { airTemperature + '°C' }
      </Text>
      <Text style={{ fontSize: 100 }}>
        { windSpeed + 'm/s' }
      </Text>
      <Text style={{ fontSize: 100 }}>
        { Time }
      </Text>
    </View>
  );
  
}

export default Weather;
