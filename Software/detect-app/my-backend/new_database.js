import mongoose from "mongoose";
  
const authSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,  
        trim: true,    
    },
    password: {
        type: String,
        required: true,
        minlength: 6,  
    },
});
const feedbackSchema = new mongoose.Schema({
    username: String,
    BicepCurlCnt: Number,
    SquatCnt: Number,
    PushUpCnt: Number,
    timestamp: Date,
  });
const feedbacksSchema = new mongoose.Schema({
    username: String,
    age: Number,
  });
  

 export const authData = mongoose.model("authData" , authSchema)
 export const feedbacks = mongoose.model("feedbacks" , feedbackSchema);