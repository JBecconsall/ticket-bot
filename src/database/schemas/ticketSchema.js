const { Schema, mongoose} = require('mongoose');

const ticket = new Schema({ 
    id: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: String,
        required: true
    }

})

module.exports = mongoose.model('tickets', ticket);