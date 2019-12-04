import React, { useState, useEffect } from 'react'
import ChatBox from './ChatBox'
import ChatFields from './ChatFields';
import Container from '@material-ui/core/Container'
import socketIOClient from "socket.io-client";
const socket = socketIOClient('localhost:5000');
const socketStream = require('socket.io-stream')

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

  const handleUpload = (images) => {
      Array.from(images).map(file => {
         const stream = socketStream.createStream();
         socketStream(socket).emit('upload_image', stream, {
            id: stream.id,
            size: file.size,
            file_name: file.name,
            ...userData
         });
         const blob = socketStream.createBlobReadStream(file)
         blob.pipe(stream)
      });
  }

  function parseChunks(data) {
      const blob = new Blob(data, { type: 'image/png' })
      return URL.createObjectURL(blob)
  }

  useEffect(() => {
      socket.on('message change', (e) => {
         setData_list(prevData => [...prevData, e])
      })

      socket.on('typing', (e) => {
         setTypingData(e)
      })
      
      if(!props.userData.name) {
         window.location.replace('/')
      }

      socketStream(socket).on('receive_client', (stream, data) => {
         let chunks = []
         stream.on('data', (chunk) => {
            chunks=[...chunks, chunk]
         })
         stream.on('end', () => {
            const result = parseChunks(chunks)
            socket.emit('message change', {
               ...data,
               file: result
            })
         });
      })

  }, [socket, props.userData])

  useEffect(() => {
   setUser(props.userData || {})
  }, [props.userData])

   return (
      <div className='main-container'>
         <Container maxWidth="sm">
            <ChatBox data={prevData} userData={userData}/>
            <ChatFields onSend={send} userData={userData} typingData={typingData} onUpload={handleUpload}/>
         </Container>
      </div>
   )
}

export default Main