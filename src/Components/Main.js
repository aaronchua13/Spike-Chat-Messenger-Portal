import React, { useState, useEffect } from 'react'
import ChatBox from './ChatBox'
import ChatFields from './ChatFields';
import Container from '@material-ui/core/Container'
import socketIOClient from "socket.io-client";
const socket = socketIOClient('localhost:5000');

function Main(props){

   const [prevData, setData_list] = useState([])
   const [userData, setUser] = useState({})
   const [typingData, setTypingData] = useState({ isTyping: false })

  const send = (sentData) => {
      const params = {
         ...sentData,
         ...userData
      }
      socket.emit('message change', params)
      socket.emit('typing', {typing: false}) 
  }
  
  useEffect(() => {
      socket.on('message change', (e) => {
         setData_list(prevData => [...prevData, e])
      })

      socket.on('typing', (e) => {
         setTypingData(e)
      })
      
      if(!props.userData.name) {
         console.log('@')
         window.location.replace('/')
      }
  }, [socket, props.userData])

  useEffect(() => {
   setUser(props.userData || {})
  }, [props.userData])

   return (
      <div className='main-container'>
         <Container maxWidth="sm">
            <ChatBox data={prevData} userData={userData}/>
            <ChatFields onSend={send} userData={userData} typingData={typingData}/>
         </Container>
      </div>
   )
}

export default Main