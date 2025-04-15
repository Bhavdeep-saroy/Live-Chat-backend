import mongoose from "mongoose"
const { Schema } = mongoose


const messageSchema = new Schema({
    SenderId:{
        type: Schema.Types.ObjectId,
        required: true
    },
    ReceiverId:{
        type: Schema.Types.ObjectId,
        required: true
    },
    content:{
        type: String,
        required:true
    },
    

},{
    timestamps:true
});

const MSGschema = mongoose.model("messages", messageSchema);
export {MSGschema}