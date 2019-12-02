import React from 'react'
import { EEXIST } from 'constants';
import './chatbox.css';
function ChatBox(props){
   const { data, userData } = props
   return (
      <div className='chat-box-container'>
         {
            data.map((e, i) => {
               const isMine = userData.socket_id === e.socket_id
               console.log('asdasd', {userData, e})
               return (
                  <div className='chat-message' key={`${e.socket_id} + ${i}`}>
                     {
                        !e.joined && <div> {e.name}: </div>
                     }
                     {
                        e.joined ? <div className={`${e.joined ? 'message-joined' : 'bubble-left'}`}>
                           {e.message}
                        </div> : <div className={`${isMine ? 'bubble-right' : ''}`}>
                           {e.message}
                     </div>
                     }
                  </div>
               )
            })
         }
      </div>
   )
}

export default ChatBox