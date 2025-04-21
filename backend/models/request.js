import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
    requestedTo: {
        type: String,
        required: true,
    },
    requestFrom:{
        type: String,
        required: true,
    },
    filehash:{
        type: String,
        required: true,
    },
    researchPurpose:{
        type: String,
        required: true,
    },
    fileName:{
        type: String,
        required: true,
    },
    requestCreatedAt:{
        type: Date,
        default: Date.now,
    },

});

const request = mongoose.model('request', requestSchema);
export default request;