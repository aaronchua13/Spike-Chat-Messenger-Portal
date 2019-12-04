import React, { useState, useEffect } from 'react'
import socketClient from 'socket.io-client'
import socketStream from 'socket.io-stream'

const socket = socketClient('localhost:5000');
function Views(props){
   const [ images, setImages ] = useState([])
   useEffect(() => {
      const url = props
      const stream = socketStream.createStream()
      socketStream(socket).emit('all_images', stream)
   }, [])

   function parseChunks(data) {
      const blob = new Blob(data, { type: 'image/png' })
      return URL.createObjectURL(blob)
   }
   useEffect(() => {
      socketStream(socket).on('all_images', (stream, images) => {
         let chunks = []
         stream.on('data', (chunk) => {
            chunks = [...chunks, chunk]
         });
         stream.on('end', () => {
            const results = parseChunks(chunks)
            setImages(prevState => [...prevState, { name: images.file_name, image: results }])
         })
      })
   }, [socket])
   return (
      <div className='chat-box-container'>
         {
            Boolean(images.length) && images.map(e => <img key={e.name} src={e.image} alt={e.name} height={300} width={300}/>)
         }
      </div>
   )
}

export default Views