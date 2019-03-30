import {
  makeRemoteExecutableSchema,
  introspectSchema,
  mergeSchemas
} from 'graphql-tools';
import { HttpLink } from 'apollo-link-http';
import fetch from 'node-fetch';
import { ApolloServer } from 'apollo-server';
import keys from './keys';
console.log(keys.userHost);
console.log(keys.postHost);

const graphqlApis = [
  {
    uri: keys.userHost
  },
  {
    uri: keys.postHost
  }
];

const createRemoteExecutableSchemas = async () => {
  let schemas = [];

  for (let i = 0; i < graphqlApis.length; i++) {
    const link = new HttpLink({
      uri: graphqlApis[i].uri,
      fetch
    });

    const remoteSchema = await introspectSchema(link);

    const remoteExecutableSchema = makeRemoteExecutableSchema({
      schema: remoteSchema,
      link
    });

    schemas.push(remoteExecutableSchema);
  }
  return schemas;
};

const linkTypeDefs = `
  extend type Post {
    author: User
  }
`;

const createNewSchema = async () => {
  const schemas = await createRemoteExecutableSchemas();
  return mergeSchemas({
    schemas: [...schemas, linkTypeDefs],
    resolvers: {
      Post: {
        author: {
          fragment: `... on Post { authorId }`,
          resolve(post, args, context, info) {
            return info.mergeInfo.delegateToSchema({
              schema: schemas[0],
              operation: 'query',
              fieldName: 'user',
              args: {
                userId: post.authorId
              },
              context,
              info
            });
          }
        }
      }
    }
  });
};

const runServer = async () => {
  const schema = await createNewSchema();

  const server = new ApolloServer({ schema });

  server.listen(3002).then(({ url }) => {
    console.log(`Running at ${url}`);
  });
};

try {
  runServer();
} catch (err) {
  console.error(err);
}
