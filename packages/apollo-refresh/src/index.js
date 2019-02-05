import cors from 'cors';
import express from 'express';
import {
  ApolloServer,
  gql
} from 'apollo-server-express';

const app = express();
app.use(cors());
const schema = gql`
  type Query {
    users: [User!]
    me: User
    user(id: ID!): User
    messages: [Message!]!
    message(id: ID!): Message!
  }

  type User {
    id: ID!
    username: String!
  }
  type Message {
    id: ID!
    text: String!
  }
`;

let users = {
  1: {
    id: '1',
    username: 'Alain Armand',
  },
  2: {
    id: '2',
    username: 'Dave Davids',
  },
};
let messages = {
  1: {
    id: '1',
    text: 'Hello World',
  },
  2: {
    id: '2',
    text: 'By World',
  },
};
// const me = users[1];
const resolvers = {
  Query: {
    users: () => {
      return Object.values(users);
    },
    user: (parent, {
      id
    }) => {
      return users[id];
    },
    me: (parent, args, { me }) => {
      return me;
    },
    messages: () => {
      return Object.values(messages);
    },
    message: (parent, { id }) => {
      return messages[id];
    },
  },
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    me: users[1],
  },
});

server.applyMiddleware({
  app,
  path: '/graphql'
});

app.listen({
  port: 8000
}, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
});