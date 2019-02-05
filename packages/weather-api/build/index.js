'use strict';

var _graphqlTools = require('graphql-tools');

var _nodeGeocoder = require('node-geocoder');

var _nodeGeocoder2 = _interopRequireDefault(_nodeGeocoder);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('now-env');
// Makes use of Google Maps geocoding API and Dark Sky weather API
// Get API keys at https://console.developers.google.com & https://darksky.net/dev/
// and add them to the server secrets
// Feel free to reach out to me on Twitter @mattdionis or @motleydev with any questions!

var _require = require('apollo-server'),
    ApolloServer = _require.ApolloServer;

// Set the baseUrl and urlParams for Dark Sky API call
var baseUrl = 'https://api.darksky.net/forecast/';
var urlParams = '?units=us&exclude=minutely,hourly,flags';
var mapLinkBase = 'https://www.google.com/maps/?q=';

// Geocode a place through node-geocoder and the Google Maps API
// https://github.com/nchaulet/node-geocoder
function getLocation(apiKey, place) {
  var options = {
    provider: 'google',
    apiKey: apiKey
  };

  var geocoder = (0, _nodeGeocoder2.default)(options);

  return new Promise(function (resolve, reject) {
    geocoder.geocode(place, function (err, res) {
      if (err) {
        reject(err);
      }
      var city = res[0].city;
      var country = res[0].country;
      var lat = res[0].latitude;
      var lng = res[0].longitude;
      resolve({
        city: city,
        country: country,
        coords: [lat, lng],
        mapLink: '' + mapLinkBase + lat + ',' + lng
      });
    });
  });
}

// Pass the geographic coordinates of the location to the Dark Sky API to get current conditions
function getWeather(apiKey, coords) {
  return new Promise(function (resolve, reject) {
    (0, _request2.default)('' + baseUrl + apiKey + '/' + coords[0] + ',' + coords[1] + urlParams, function (error, response, body) {
      if (error) {
        reject(error);
      }
      var data = JSON.parse(body);
      var summary = data.currently.summary;
      var temperature = data.currently.temperature;
      var apttemperature = data.currently.apparentTemperature;
      var timezone = data.timezone;
      var time = data.currently.time;
      var icon = data.currently.icon;
      var sunrise = data.daily.data[0].sunriseTime;
      var sunset = data.daily.data[0].sunsetTime;
      var moonphase = data.daily.data[0].moonPhase;
      resolve({
        summary: summary,
        temperature: temperature,
        coords: coords,
        apttemperature: apttemperature,
        timezone: timezone,
        time: time,
        icon: icon,
        sunrise: sunrise,
        sunset: sunset,
        moonphase: moonphase
      });
    });
  });
}

var typeDefs = '\n  type Query {\n    location(place: String!): Location\n  }\n\n  type Location {\n    city: String\n    country: String\n    coords: [Float]\n    mapLink: String\n    weather: Weather\n  }\n\n  type Weather {\n    summary: String\n    temperature: Float\n    coords: [Float]\n    apttemperature: Float\n    timezone: String\n    time: Int\n    icon: String\n    sunrise: Int\n    sunset: Int\n    moonphase: Float\n  }\n';

// Pass in the Google and Dark Sky API keys
var resolvers = {
  Query: {
    location: function location(root, args, context) {
      return getLocation(process.env.GOOGLE, args.place);
    }
  },
  Location: {
    weather: function weather(root, args, context) {
      return getWeather(process.env.DARKSKY, root.coords);
    }
  }
};

var schema = (0, _graphqlTools.makeExecutableSchema)({
  typeDefs: typeDefs,
  resolvers: resolvers
});

var server = new ApolloServer({ schema: schema });

server.listen().then(function (_ref) {
  var url = _ref.url;

  console.log('\uD83D\uDE80  Server ready at ' + url);
});
//# sourceMappingURL=index.js.map