import { asyncHandler } from "../utils/asyncHandler.js";
import { createServer } from "http"; 
import { Server } from "socket.io";


const server = createServer();


const io = new Server(server);



 const handleWebSocket = asyncHandler(async (req, res) => {
   

   console.log("sdasdas");
});
 

export { handleWebSocket}
