const { gql } = require('apollo-server');


module.exports = gql`
    type Post {
        id: ID!
        body: String!
        createdAt: String!
        username: String!
        firstname: String!
        lastname: String!
        picture: String!
        comments: [Comment]!
        likes: [Like]!
        likeCount: Int!
        commentCount: Int!
        image: String!
    }
    type Comment {
        id: ID!
        createdAt: String!
        username: String!
        firstname: String!
        lastname: String!
        picture: String!
        body: String!
    }
    type Like {
        id: ID!
        createdAt: String!
        username: String!
        lastname: String!
        firstname: String!
    }
    type User {
        id: ID!
        email: String!
        token: String!
        firstname: String!
        picture: String!
        lastname: String!
        username: String!
        createdAt: String!
    }
    input RegisterInput {
        username: String!
        password: String!
        picture: String!
        firstname: String!
        lastname: String!
        confirmPassword: String!
        email: String!
    }
    type Query {
        getPosts: [Post]
        getPost(postId: ID!): Post
    }
    type Mutation {
        register(registerInput: RegisterInput): User!
        login(username: String!, password: String!): User!
        createPost(body: String!, image: String!): Post!
        deletePost(postId: ID!): String!
        createComment(postId: String!, body: String!): Post!
        deleteComment(postId: ID!, commentId: ID!): Post!
        likePost(postId: ID!): Post!
    }
    type Subscription {
        newPost: Post!
    }
`;