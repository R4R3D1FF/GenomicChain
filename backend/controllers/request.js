import request from '../models/request.js';
import profile from '../models/profile.js';
import { createProfile } from './profile.js';

export const createRequest = async (req, res) => {
    try {
        console.log(req.body)
        if(!req.body.requestedTo || !req.body.requestFrom || !req.body.filehash || !req.body.fileName) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        const { requestedTo, requestFrom, filehash, researchPurpose, fileName } = req.body;
        const newRequest = new request({ requestedTo, requestFrom, filehash, researchPurpose, fileName });
        await newRequest.save();
        const newProfile=await profile.findOneAndUpdate({ WalletAddress: requestedTo }, { $push: { allRequests: newRequest._id } }, { new: true });
        
        res.status(201).json(newRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getRequest = async (req, res) => {
    try {
        console.log("lol");
        const WalletAddress = req.params.walletAddress;
        const user = await profile.findOne({ WalletAddress: WalletAddress });
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }

        const allRequests=user.allRequests;
        const requests = await request.find({ _id: { $in: allRequests } });

        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



export const approveRequest= async (req, res) => {
    try {
        const { requestId, WalletAddress } = req.body;
        console.log(requestId, WalletAddress)
        const requestToApprove = await request.findById(requestId);
        if (!requestToApprove) {
            return res.status(404).json({ message: 'Request not found' });
        }
        
        console.log("hello from approve request")
        await profile.findOneAndUpdate(
            { WalletAddress: WalletAddress },
            { $pull: { allRequests: requestId } },
            { new: true }
        );

        await request.findByIdAndDelete(requestId);

        res.status(200).json(requestToApprove);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const rejectRequest= async (req, res) => {
    try {
        const { requestId, WalletAddress } = req.body;
        const requestToApprove = await request.findById(requestId);
        if (!requestToApprove) {
            return res.status(404).json({ message: 'Request not found' });
        }

        await profile.findOneAndUpdate(
            { WalletAddress: WalletAddress },
            { $pull: { allRequests: requestId } },
            { new: true }
        );

        await request.findByIdAndDelete(requestId);
        
        res.status(200).json(requestToApprove);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}