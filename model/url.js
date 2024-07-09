const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    name:{
        type: String,
        required: 'Required',
    },
    channel_url:{
        type: String,
        required: 'Required',
    },

    image:{
        type: String,
        required: 'Required',
    },
    created_date: {
        type: String,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});
// mongoose.set('debug', true)
module.exports = mongoose.model('url', urlSchema);






