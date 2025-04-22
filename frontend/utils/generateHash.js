import { keccak256 } from "js-sha3";
import { Buffer } from "buffer";

export const hashCID =async (cid) => {
    const hash= await keccak256(Buffer.from(cid));
    console.log("from inside ghasg func",hash);
    return hash;
};

