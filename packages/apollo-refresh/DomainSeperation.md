# Domain Separation

In the next step, modularize the GraphQL schema by domains (user and message). First, separate the user-related entity in its own schema definition file called src/schema/user.js:

```js
import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    users: [User!]
    user(id: ID!): User
    me: User
  }

  type User {
    id: ID!
    username: String!
    messages: [Message!]
  }
`;
```

The same applies for the message schema definition in src/schema/message.js:

```js
import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    messages: [Message!]!
    message(id: ID!): Message!
  }

  extend type Mutation {
    createMessage(text: String!): Message!
    deleteMessage(id: ID!): Boolean!
  }

  type Message {
    id: ID!
    text: String!
    user: User!
  }
`;
```

Each file only describes its own entity, with a type and its relations. A relation can be a type from a different file, such as a Message type that still has the relation to a User type even though the User type is defined somewhere else. Note the extend statement on the Query and Mutation types. Since you have more than one of those types now, you need to extend the types. Next, define shared base types for them in the src/schema/index.js:

```js
import { gql } from 'apollo-server-express';

import userSchema from './user';
import messageSchema from './message';

const linkSchema = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

export default [linkSchema, userSchema, messageSchema];
```

In this file, both schemas are merged with the help of a utility called linkSchema. The linkSchema defines all types shared within the schemas. It already defines a Subscription type for GraphQL subscriptions, which may be implemented later. As a workaround, there is an empty underscore field with a Boolean type in the merging utility schema, because there is no official way of completing this action yet. The utility schema defines the shared base types, extended with the extend statement in the other domain-specific schemas.

This time, the application runs with a stitched schema instead of one global schema. What’s missing are the domain separated resolver maps. Let’s start with the user domain again in file in the src/resolvers/user.js file, whereas I leave out the implementation details for saving space here:

```js
export default {
  Query: {
    users: (parent, args, { models }) => {
      ...
    },
    user: (parent, { id }, { models }) => {
      ...
    },
    me: (parent, args, { me }) => {
      ...
    },
  },

  User: {
    messages: (user, args, { models }) => {
      ...
    },
  },
};
```

Next, add the message resolvers in the src/resolvers/message.js file:

```js
import uuidv4 from 'uuid/v4';

export default {
  Query: {
    messages: (parent, args, { models }) => {
      ...
    },
    message: (parent, { id }, { models }) => {
      ...
    },
  },

  Mutation: {
    createMessage: (parent, { text }, { me, models }) => {
      ...
    },

    deleteMessage: (parent, { id }, { models }) => {
      ...
    },
  },

  Message: {
    user: (message, args, { models }) => {
      ...
    },
  },
};
```

Since the Apollo Server accepts a list of resolver maps too, you can import all of your resolver maps in your src/resolvers/index.js file, and export them as a list of resolver maps again:

```js
import userResolvers from './user';
import messageResolvers from './message';

export default [userResolvers, messageResolvers];
```

Then, the Apollo Server can take the resolver list to be instantiated. Start your application again and verify that everything is working for you.

In the last section, you extracted schema and resolvers from your main file and separated both by domains. The sample data is placed in a src/models folder, where it can be migrated to a database-driven approach later. The folder structure should look similar to this:

```sh
* src/
  * models/
    * index.js
  * resolvers/
    * index.js
    * user.js
    * message.js
  * schema/
    * index.js
    * user.js
    * message.js
  * index.js
```

You now have a good starting point for a GraphQL server application with Node.js. The last implementations gave you a universally usable GraphQL boilerplate project to serve as a foundation for your own software development projects. As we continue, the focus becomes connecting GraphQL server to databases, authentication and authorization, and using powerful features like pagination.