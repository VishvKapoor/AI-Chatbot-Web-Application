import React, { useEffect } from 'react'
import './leftSection.css'
import { useContext } from 'react'
import { MyContext } from '../MyContext'
import {v1 as uuidv1} from 'uuid'
const LeftSection = () => {
  const {allThreads,setAllThreads,currThreadId,setnewchat,setPrompt,setReply,setcurrThreadId,setPrevChats}=useContext(MyContext)

  const getAllThreads=async()=>{
    try{
      const response=await fetch("http://localhost:8080/api/thread")
      const res=await response.json();
      const filteredData=res.map(thread=>({threadId:thread.threadId,title:thread.title}))
      setAllThreads(filteredData)

    }catch(err){
      console.log(err)
    }
  }
  useEffect(()=>{
    getAllThreads()
  },[currThreadId])

  const createNewChat=()=>{
    setnewchat(true)
    setPrompt("");
    setReply(null)
    setcurrThreadId(uuidv1())
    setPrevChats([])
  }
  const changeThread=async(newthreadId)=>{
    setcurrThreadId(newthreadId)
    try{
      const response=await fetch(`http://localhost:8080/api/thread/${newthreadId}`)
      const res=await response.json()
      console.log(res)
      setPrevChats(res)
      setnewchat(false)
      setReply(null)
    }catch(err){
      console.log(err)
    }
  }
  const deleteThread=async(threadId)=>{
    try{
      const response=await fetch(`http://localhost:8080/api/thread/${threadId}`,{method:"DELETE"})
      const res=await response.json()

      //re-render the updated threads
      setAllThreads(prev=>prev.filter(thread=>thread.threadId !==threadId))
      if(threadId===currThreadId){
        createNewChat()
      }
    }catch(err){
      console.log(err)
    }
  }
  return (
    <section className='sidebar'>
      {/* new chat button */}
      <button onClick={createNewChat}>
        <img src="src/assets/blacklogo.png" alt="gpt logo" className='logo' />
        <span><i className="fa-solid fa-pen-to-square"></i></span>
      </button>

      {/* history */}
      <ul className='history'>
      {
        allThreads ?.map((thread,idx)=>(
          <li 
          key={idx}
          onClick={(e)=>changeThread(thread.threadId)}
          >{thread.title}
          <i className="fa-solid fa-trash" 
          onClick={(e)=>{
            e.stopPropagation()//stop event bubbling
            deleteThread(thread.threadId)
          }}>
          </i>
          </li>
        ))
      }
      </ul>

      {/* sigin */}
      <div className='sign'>
        <p>By Vishv Kapoor</p>
      </div>
    </section>
  )
}

export default LeftSection
