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
    PlankTime:Number,
    JumpingJackCnt:Number,
    timestamp: Date,
  });
 const goalSchema = new mongoose.Schema({
    username:String,
    exerciseName:String,
    exerciseCnt:Number,
    caloriesToBurn:Number,
    completed:Boolean,
 });
 
 export const authData = mongoose.model("authData" , authSchema);
 export const feedbacks = mongoose.model("feedbacks" , feedbackSchema);
 export const goalData = mongoose.model("goalData",goalSchema);