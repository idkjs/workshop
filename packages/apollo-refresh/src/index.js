import cors from 'cors';
import express from 'express';
import uuidv4 from 'uuid/v4';
import schema from "./schema"
import {
  ApolloServer,
  gql
} from 'apollo-server-express';

const app = express();
app.use(cors());

let users = {
  1: {
    id: '1',
    username: 'Alain Armand',
    messageIds: [1],
  },
  2: {
    id: '2',
    username: 'Dave Davids',
    messageIds: [2],
  },
};
let messages = {
  1: {
    id: '1',
    text: 'Hello World',
    userId: '1',
  },
  2: {
    id: '2',
    text: 'By World',
    userId: '2',
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
    me: (parent, args, {
      me
    }) => {
      return me;
    },
    messages: () => {
      return Object.values(messages);
    },
    message: (parent, {
      id
    }) => {
      return messages[id];
    },
  },
  Message: {
    user: message => {
      return users[message.userId];
    },
  },
  User: {
    messages: user => {
      return Object.values(messages).filter(
        message => message.userId === user.id,
      );
    },
  },
  Mutation: {
    createMessage: (parent, {text}, {me}) => {
      const id = uuidv4();
      const message = {
        id,
        text,
        userId: me.id,
      };
      messages[id] = message;
      users[me.id].messageIds.push(id);
      return message;
    },
    deleteMessage: (parent, { id }) => {
      const { [id]: message, ...otherMessages } = messages;

      if (!message) {
        return false;
      }
      messages = otherMessages;
      return true;
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