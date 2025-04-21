import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
    WalletAddress: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    allRequests: {
        type: [mongoose.Schema.Types.ObjectId], 
        ref: 'Request',
        default: [],
    },
});

const Profile = mongoose.model('Profile', ProfileSchema);
export default Profile;