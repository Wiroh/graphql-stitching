const { ApolloServer, gql } = require('apollo-server');

const posts = [
    {
        id: '123456789',
        title: 'kfzejfklj',
        content:
            'fzejklfj lzekjfkl zejflkjzek jfkzefjkl zel kf zejf jlze kjf kzefk jzel kj kzejflkjzekjflkzejfk lzel kze kj',
        authorId: '123456789'
    }
];

const typeDefs = gql`
    type Post {
        id: ID!
        title: String!
        content: String!
        authorId: ID!
    }

    type Query {
        posts: [Post]
    }
`;

const resolvers = {
    Query: {
        posts: () => posts
    }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen(3001).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
