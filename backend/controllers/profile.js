import Profile from '../models/profile.js'; // Ensure the correct model is imported

export const createProfile = async (req, res) => {
    try {
        if (!req.body.WalletAddress || !req.body.name) {
            return res.status(400).json({ message: 'WalletAddress and name are required' });
        }
        const { WalletAddress, name } = req.body;
        const userExist=await Profile.findOne({WalletAddress:WalletAddress});
        if(userExist){
            return res.status(400).json({ message: 'Profile with this WalletAddress already exists' });
        }
        const newProfile = new Profile({ WalletAddress, name }); // Use the correct model
        await newProfile.save(); // Save the instance to the database
        res.status(201).json(newProfile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProfile = async (req, res) => {
    try {
        const { WalletAddress } = req.body;
        const profileData = await Profile.findOne({ WalletAddress: WalletAddress }); // Use the correct model
        if (!profileData) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.status(200).json(profileData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};