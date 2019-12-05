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
                     {
                        !!e.file && <img src={e.file} alt={e.file_name} height={200} width={200}/>
                     }
                  </div>
               )
            })
         }
      </div>
   )
}

export default ChatBox