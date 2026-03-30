import React from 'react'
import './App.css'
import ChatWindow from './components/ChatWindow'
import Chat from './components/Chat'
import LeftSection from './components/LeftSection'
import {MyContext} from './MyContext'
import { useState } from 'react'
import {v1 as uuidv1} from 'uuid'
const App = () => {
  const [prompt,setPrompt]=useState("")
  const [reply,setReply]=useState(null)
  const [currThreadId,setcurrThreadId]=useState(uuidv1())
  const [prevChats,setPrevChats]=useState([])//stores all prev chats of curr thread
  const [newChat,setnewchat]=useState(true)
  const[allThreads,setAllThreads]=useState([])
  const providerValues={
    prompt,setPrompt,
    reply,setReply,
    currThreadId,setcurrThreadId,
    newChat,setnewchat,
    prevChats,setPrevChats,
    allThreads,setAllThreads
  };
  return (
    <div className='app'>
      <MyContext.Provider value={providerValues}>
      <LeftSection></LeftSection>
      <ChatWindow></ChatWindow>
      </MyContext.Provider>
    </div>
  )
}

export default App
