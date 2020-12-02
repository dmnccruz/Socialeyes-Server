const { model, Schema } = require('mongoose');

const postSchema = new Schema({
    body: String,
    username: String,
    firstname: String,
    lastname: String,
    createdAt: String,
    picture: String,
    comments: [
        {
            body: String,
            username: String,
            firstname: String,
            lastname: String,
            createdAt: String,
            picture: String,
        }
    ],
    likes: [
        {
            username: String,
            firstname: String,
            lastname: String,
            createdAt: String
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    image: String,
});

module.exports = model('Post', postSchema);