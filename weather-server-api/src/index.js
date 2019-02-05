// require('now-env');
if (!process.env.now) require("dotenv").config();
import express from 'express';
// import {
//   graphqlExpress,
//   graphiqlExpress
// } from 'apollo-server-express';
import {typeDefs, resolvers } from './schema'
const { ApolloServer, gql } = require('apollo-server-express');
// import cors from 'cors';
import bodyParser from 'body-parser';

import * as Schema from './schema';
console.log(typeDefs)
const PORT = process.env.now ? 8080 : 3000;
// const server = express();
const server = new ApolloServer({ typeDefs, resolvers });
// darksky_secret=2e3ff4c01974a1fe5b7749236c1f2db8
// google_secret=AIzaSyD2GwjsUq1rvwdYGK76ixehWfk2vUbnPTI
if (typeof process.env.google_secret === 'undefined') {
  console.warn('WARNING: process.env.google is not defined. Check README.md for more information');
}
if (typeof process.env.darksky_secret === 'undefined') {
  console.warn('WARNING: process.env.darksky is not defined. Check README.md for more information');
}
// const schemaFunction =
//   Schema.schemaFunction ||
//   function() {
//     return Schema.schema;
//   };
// let schema;
// const rootFunction =
//   Schema.rootFunction ||
//   function() {
//     return schema.rootValue;
//   };
// const contextFunction =
//   Schema.context ||
//   function(headers, secrets) {
//     return Object.assign(
//       {
//         headers: headers,
//       },
//       secrets
//     );
//   };
const app = express();
// app.use('/graphql', bodyParser.json(), graphqlExpress(async (request) => {
//   if (!schema) {
//     schema = schemaFunction(process.env)
//   }
//   const context = await contextFunction(request.headers, process.env);
//   const rootValue = await rootFunction(request.headers, process.env);

//   return {
//     schema: await schema,
//     rootValue,
//     context,
//     tracing: true,
//   };
// }));

// app.use('/graphiql', graphiqlExpress({
//   endpointURL: '/graphql',
//   query: `query ($place1: String!, $place2: String!, $place3: String!) {
//   Fenway: location(place: $place1) {
//     ...locationFields
//   }
//   BigBen: location(place: $place2) {
//     ...locationFields
//   }
//   Pyramids: location(place: $place3) {
//     ...locationFields
//   }
// }

// fragment locationFields on Location {
//   country
//   mapLink
//   weather {
//     summary
//     temperature
//   }
// }
// `,
// }));

// server.listen(PORT, () => {
//   console.log(`GraphQL Server is now running on http://localhost:${PORT}/graphql`);
//   console.log(`View GraphiQL at http://localhost:${PORT}/graphiql`);
// });


server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);