const { AuthenticationError, UserInputError } = require('apollo-server');
const { argsToArgsConfig } = require('graphql/type/definition');

const Post = require('../../models/Post');
const User = require('../../models/User');
const checkAuth = require('../../util/check-auth');

module.exports = {
    Query: {
        async getPosts() {
            try {
                const posts = await Post.find().sort({ createdAt: -1 });
                return posts;
            } catch(err){
                throw new Error(err);
            }
        },
        async getPost(_, { postId }){
            try {
                const post = await Post.findById(postId);
                if(post) {
                    return post;
                } else {
                    throw new Error('Post not found.')
                }
            } catch (err) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
        async createPost(_, { body, image }, context){
            const user = checkAuth(context);
            
            if(body.trim() === '' && image.trim() === '') {
                throw new Error('Description must not be empty and you must upload an image');
            }

            if(body.trim() === '') {
                throw new Error('Description must not be empty');
            }

            if(image.trim() === '') {
                throw new Error('You must upload an image');
            }

            const newPost = new Post({
                body,
                image,
                user: user.id,
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname,
                picture: user.picture,
                createdAt: new Date().toISOString()
            });

            const post = await newPost.save();

            context.pubsub.publish('NEW_POST', {
                newPost: post
            });

            return post;
        },
        async deletePost(_, { postId }, context) {
            const user = checkAuth(context);
            try {
                const post = await Post.findById(postId);
                if(user.username === post.username) {
                    await post.delete();
                    return 'Post deleted successfully';
                } else {
                    throw new AuthenticationError('Action not allowed.');
                }
            } catch (err) {
                throw new Error(err);
            }
        },
        async likePost(_, { postId }, context) {
            const { username, firstname, lastname } = checkAuth(context);

            const post = await Post.findById(postId);
            if(post) {
                if(post.likes.find(like => like.username === username)) {
                    // Post already liked, unlike it
                    post.likes = post.likes.filter(like => like.username !== username);
                }
                else {
                    // Not liked, like post
                    post.likes.push({
                        username,
                        firstname,
                        lastname,
                        createdAt: new Date().toISOString()
                    })
                }
                await post.save()
                return post;
            } 
            else throw new UserInputError('Post not found.');
        }
    },

    Subscription: {
        newPost: {
            subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST')
        }
    }

};