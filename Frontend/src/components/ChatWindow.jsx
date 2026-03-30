import React from 'react'
import Chat from './Chat'
import './ChatWindow.css'
import {SyncLoader} from 'react-spinners'

import { MyContext } from '../MyContext'
import { useContext,useState,useEffect} from 'react'
const ChatWindow = () => {

  const {prompt,setPrompt,reply,setReply,currThreadId,setcurrThreadId,prevChats,setPrevChats,setnewchat}=useContext(MyContext)
  const [loading,setLoading]=useState(false)

const getReply = async () => {
  setLoading(true)
  setnewchat(false)
  console.log("message",prompt,"threadId",currThreadId)
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: prompt,
      threadId: currThreadId
    })
  };

  try {
    const response = await fetch("http://localhost:8080/api/chat", options);
    const data = await response.json();
    console.log(data);
    setReply(data.reply)
  } catch (err) {
    console.log(err);
  }
  setLoading(false)
};
//purpose of this useEffect hook is to Add both the user message and AI reply into chat history (prevChats) once the reply is received
useEffect(()=>{
  if(prompt && reply){
    setPrevChats(prevChats=>(
      [...prevChats,{
        role:"user",
        content:prompt
      },{
        role:"assistant",
        content:reply
      }]
    ))
  }
  setPrompt("")
},[reply])
  return (
    <div className='chatWindow'>
      <div className="navbar">
          <span>SigmaGpt<i className="fa-solid fa-chevron-down"></i></span>
          <div className="userIconDiv">
            <span className='userIcon'><i className="fa-solid fa-user"></i></span>
          </div>
      </div>
      <Chat></Chat>
      <SyncLoader color='#fff' loading={loading}></SyncLoader>
      <div className="chatInput">
        <div className="inputBox">
          <input type="text" name="" value={prompt} onChange={(e)=>setPrompt(e.target.value)}
           onKeyDown={(e)=>e.key=== 'Enter'? getReply() :''} id="" placeholder='Ask anything'/>
        </div>
        <div id='submitt' onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
        <p className='info'>
        </p>
      </div>
    </div>
  )
}

export default ChatWindow
