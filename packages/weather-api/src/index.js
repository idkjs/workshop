require('now-env');
// Makes use of Google Maps geocoding API and Dark Sky weather API
// Get API keys at https://console.developers.google.com & https://darksky.net/dev/
// and add them to the server secrets
// Feel free to reach out to me on Twitter @mattdionis or @motleydev with any questions!
import { makeExecutableSchema } from 'graphql-tools';
import NodeGeocoder from 'node-geocoder';
const { ApolloServer} = require('apollo-server');
import request from 'request';

// Set the baseUrl and urlParams for Dark Sky API call
const baseUrl = 'https://api.darksky.net/forecast/';
const urlParams = '?units=us&exclude=minutely,hourly,flags';
const mapLinkBase = 'https://www.google.com/maps/?q=';

// Geocode a place through node-geocoder and the Google Maps API
// https://github.com/nchaulet/node-geocoder
function getLocation(apiKey, place) {
  const options = {
    provider: 'google',
    apiKey
  };

  const geocoder = NodeGeocoder(options);

  return new Promise((resolve, reject) => {
    geocoder.geocode(place, (err, res) => {
      if (err) {
        reject(err);
      }
      const city = res[0].city;
      const country = res[0].country;
      const lat = res[0].latitude;
      const lng = res[0].longitude;
      resolve({
        city,
        country,
        coords: [lat, lng],
        mapLink: `${mapLinkBase}${lat},${lng}`
      });
    });
  });
}

// Pass the geographic coordinates of the location to the Dark Sky API to get current conditions
function getWeather(apiKey, coords) {
  return new Promise((resolve, reject) => {
    request(`${baseUrl}${apiKey}/${coords[0]},${coords[1]}${urlParams}`, (error, response, body) => {
      if (error) {
        reject(error);
      }
      const data = JSON.parse(body);
      const summary = data.currently.summary;
      const temperature = data.currently.temperature;
      const apttemperature = data.currently.apparentTemperature;
      const timezone = data.timezone
      const time = data.currently.time
      const icon = data.currently.icon
      const sunrise = data.daily.data[0].sunriseTime
      const sunset = data.daily.data[0].sunsetTime
      const moonphase = data.daily.data[0].moonPhase
      resolve({
        summary,
        temperature,
        coords,
        apttemperature,
        timezone,
        time,
        icon,
        sunrise,
        sunset,
        moonphase,
      });
    });
  });
}

const typeDefs = `
  type Query {
    location(place: String!): Location
  }

  type Location {
    city: String
    country: String
    coords: [Float]
    mapLink: String
    weather: Weather
  }

  type Weather {
    summary: String
    temperature: Float
    coords: [Float]
    apttemperature: Float
    timezone: String
    time: Int
    icon: String
    sunrise: Int
    sunset: Int
    moonphase: Float
  }
`;

// Pass in the Google and Dark Sky API keys
const resolvers = {
  Query: {
    location(root, args, context) {
      return getLocation(process.env.GOOGLE, args.place);
    }
  },
  Location: {
    weather(root, args, context) {
      return getWeather(process.env.DARKSKY, root.coords);
    }
  }
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const server = new ApolloServer({ schema });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});