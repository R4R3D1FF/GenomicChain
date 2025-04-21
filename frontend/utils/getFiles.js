import { pinata } from "./pinata.js";

export const getFile= async (cid)=> {
    try {
      const data = await pinata.gateways.public.get(cid);
      console.log(data)
  
      const url = await pinata.gateways.convert(
        cid
      )
      console.log(url)
    } catch (error) {
      console.log(error);
    }
  }