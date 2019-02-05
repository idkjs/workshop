# Refreshing Graphql in JS with Apollo Server

guide: <https://www.robinwieruch.de/graphql-apollo-server-tutorial/>

## First Query

Start server and run:

```graphql
{
  me {
    username
  }
}
```

## CORS

 CORS is a useful tool to experiment and explore your own API. Optionally, you can also add CORS to your Express middleware. First, install CORS on the command line the add it to `index.js`:

 ```bash
 npm install cors --save
 ```

 CORS is needed to perform HTTP requests from another domain than your server domain to your server. Otherwise you may run into cross-origin resource sharing errors for your GraphQL server.

## User Data

Refactor resolver to return data based on user's id.

```js
const resolvers = {
  Query: {
    user: (parent, { id }) => {
      return users[id];
    },
    me: () => {
      return me;
    },
  },
};
```

Test Query:

```graphql
{
  user(id: "2") {
    username
  }
  me {
    username
  }
}
```

## All users

test query:

```graphql
users {
    username
  }
```

## Overiding Fields with Top Level resolver

```js
  User: {
    username: () => 'Hans',
  },
```

Running this query return user ids but all names are Hans because when we call User which resolves to list of User type, then our resolver call the User resolver what that we defined.

```graphql
# query
{
  users {
    username
    id
  }
}

# query result
{
  "data": {
    "users": [
      {
        "username": "Hans",
        "id": "1"
      },
      {
        "username": "Hans",
        "id": "2"
      }
    ]
  }
}
```

## Context Arg

Look at the other arguments in the function signature of a GraphQL resolver:

```js
(parent, args, context, info) => { ... }
```

The context argument is the third argument in the resolver function used to inject dependencies from the outside to the resolver function. Assume the signed-in user is known to the outside world of your GraphQL layer because a request to your GraphQL server is made and the authenticated user is retrieved from elsewhere. You might decide to inject this signed in user to your resolvers for application functionality, which is done with with the me user for the me field. Remove the declaration of the me user (let me = ...) and pass it in the context object when Apollo Server gets initialized instead:

```js
const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    me: users[1],
  },
});
```

Next, access it in the resolver’s function signature as a third argument, which gets destructured into the me property from the context object.

```js
const resolvers = {
  Query: {
    users: () => {
      return Object.values(users);
    },
    user: (parent, { id }) => {
      return users[id];
    },
    me: (parent, args, { me }) => {
      return me;
    },
  },
};
```

The context should be the same for all resolvers now. Every resolver that needs to access the context, or in this case the me user, can do so using the third argument of the resolver function.

The fourth argument in a resolver function, the info argument, isn’t used very often, because it only gives you internal information about the GraphQL request. It can be used for debugging, error handling, advanced monitoring, and tracking. You don’t need to worry about it for now.

## Mutations

test:

```graphql
mutation {
  createMessage (text: "Hello GraphQL!") {
    id
    text
  }
}
```

## Technical Separation

Move data to `src/models` and schema to `src/schema.js`, resolvers to own file. Then in server, define typeDefs as our imported schema, pass in resolvers, and create define context key as object containing our data and me definition.

```js
import cors from 'cors';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';

import schema from './schema';
import resolvers from './resolvers';
import models from './models';

const app = express();

app.use(cors());

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    models,
    me: models.users[1],
  },
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
});

```