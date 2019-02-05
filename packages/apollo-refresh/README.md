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

