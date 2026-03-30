import express from "express"
import threadModel from '../models/Thread.js'
import getAiResponse from "../utils/openAI.js"
const router=express.Router()

//test route
router.post('/test',async(req,res)=>{
    try{
        const thread=await threadModel.create({
            threadId:"abc",
            title:"THREAD 2"
        })
        res.send(thread)
    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"test route failed"
        })
    }
})
//get all threads/chats
router.get('/thread',async(req,res)=>{
    try{
        const threads=await threadModel.find({}).sort({updatedAt:-1})
        //want chats in desc order of updated chat/most recent data "on top"
        res.json(threads)
    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"Failed to fetch chats"
        })
    }
})
//get a particluar chat
router.get('/thread/:threadId',async(req,res)=>{
    const {threadId}=req.params
    try{
       const searchedChat=await threadModel.findOne({threadId})
       if(!searchedChat){
        return res.status(404).json({
            message:"chat not found"
        })
       }
       res.json(searchedChat.messages)
    }catch(err){
        res.status(500).json({
            message:"Failed to fetch info of this chat"
        })
    }
})
//delete a chat
router.delete('/thread/:threadId',async(req,res)=>{
    let {threadId}=req.params
    try{
        const chatToBeDeleted=await threadModel.findOneAndDelete({threadId})
        if(!chatToBeDeleted){
            res.status(404).json({
                message:"chat not founded"
            })
        }
        res.status(200).json({
            message:"chat deleted successfully"
        })
    }catch(err){
        res.status(500).json({
            message:"chat not deleted"
        })
    }
})

//most imp route
router.post("/chat",async(req,res)=>{
    const {threadId,message}=req.body
    if(!threadId || !message){
        res.status(404).json({
            message:"missing required fields"
        })
    }
    try {
        let chat=await threadModel.findOne({threadId});
        if(!chat){
            //we create a new chat 
            chat=new threadModel({
                threadId,
                title:message,
                messages:[{role:"user",content:message}]
            })
        }
        else{
            chat.messages.push({role:"user",content:message})
        }
        const assistantReply=await getAiResponse(message)
        chat.messages.push({role:"assistant",content:assistantReply})
        chat.updatedAt=new Date()
        await chat.save()
        res.json({
            reply:assistantReply
        })

    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"some error occured"
        })
    }
})


export default router