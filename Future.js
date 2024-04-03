import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import dayjs from 'dayjs';

const getWeatherIcon = (symbolCode) => {
  try {
    const iconPath = require(`./assets/weathericons-main/weather/png/${symbolCode}.png`);
    return iconPath;
  } catch (error) {
    // Handle the case when the icon is not found
    console.error('Error loading weather icon:', error);
    return null;
  }
};

const Future = ({ weather }) => {
  const timelimit = dayjs().add(3, 'hours');
  const timeseries = weather?.properties?.timeseries || [];
  const [first, ...filtered] = timeseries.filter((a) => dayjs(a?.time) < timelimit);

  return (
    <View style={styles.schedule}>
      {filtered.map((timeslot) => (
        <View key={timeslot.time} style={styles.timeslot}>
          <Text>{dayjs(timeslot.time).format('HH:mm')}</Text>
          <Image 
            source={getWeatherIcon(timeslot?.data?.next_1_hours?.summary?.symbol_code)}
            style={styles.weatherIcon}
          />
          <Text>{parseInt(timeslot.data.instant.details.air_temperature)}</Text>
        </View>
      ))}
    </View>
  );
};


const styles = StyleSheet.create({
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
  },
});

export default Future;
