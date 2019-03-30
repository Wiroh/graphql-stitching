const { ApolloServer, gql } = require('apollo-server');

const users = [
    {
        id: '123456789',
        username: 'Wiroh',
        email: 'wrh1805@hotmail.fr'
    }
];

const typeDefs = gql`
    type User {
        id: ID!
        username: String!
        email: String!
    }

    type Query {
        users: [User]
        user(userId: ID!): User
    }
`;

const resolvers = {
    Query: {
        users: () => users,
        user: (_, { userId }) => users.find(user => user.id === userId)
    }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen(3000).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
