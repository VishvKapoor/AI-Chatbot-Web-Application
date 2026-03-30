import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js"

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

app.use("/api",chatRoutes)

app.listen(8080, () => {
  console.log("Server running on port 8080");
  connectDB()
});

const connectDB=async()=>{
  try{
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("connect to database")
  }catch(err){
    console.log(err)

  }
}



