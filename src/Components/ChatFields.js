import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid'
import moment from 'moment'
import socketIOClient from "socket.io-client";
import { read } from 'fs';
const socket = socketIOClient('localhost:5000')

const useStyles = makeStyles(theme => ({
   container: {
     display: 'flex',
     flexWrap: 'wrap',
   },
   textField: {
     marginLeft: theme.spacing(1),
     marginRight: theme.spacing(1),
     width: '100%',
   }
 }));

function ChatFields(props){
   const classes = useStyles()
   const [text, setText] = useState('')
   const {
      onSend,
      onUpload,
      userData = {}, 
      typingData: {isTyping, name, socket_id}
   } = props

   const [images, setImages] = useState([])

   const handleChange = (evt) => {
      const { value, id } = evt.target ? evt.target : {}
      setText(value)
      socket.emit('typing', {name: props.userData.name, isTyping: true, socket_id: userData.socket_id })
      if(evt.key === 'Enter'){
         handleSubmit()
       }
   }

   const handleSubmit = () => {
      onSend({ message: text, date: moment().toISOString()})   
      if(images.length) {
         onUpload(images)
      }
      setImages([])
      setText('')
   }
   const handleImageInput = (e) => {
      setImages(e.target.files)
   }
   return (
    <div>
      {
         !!images.length && Array.from(images).map(e => {
            const reader = new FileReader();
            return <div style={{ padding: '2px' }}>
               <img src={URL.createObjectURL(e)} alt={e.name} height={80} width={80}/>
            </div>
         })  
      }
      <Grid container spacing={2} >
         <Grid item xs={12} sm={8}>
            <div className='chat-message'>
               <TextField
                  id="Chat"
                  value={text}
                  type="search"
                  margin="normal"
                  helperText={socket_id !== userData.socket_id && isTyping ? `${name} is typing...` : ''}
                  onChange={handleChange}
                  onKeyPress={handleChange}
                  placeholder="Send Message..."
                  className={classes.textField}
               />
            </div>
         </Grid>
         <Grid item xs={12} sm={2} >
            <div className='chat-message' style={{
               marginBottom: 'auto',
               marginTop: 'auto'
            }}>
               <Button
                  id='send'
                  color="default"
                  onClick={handleSubmit}
                  variant="outlined"
                  endIcon={<Icon>send</Icon>}
               >
                  Send
               </Button>
            </div>
         </Grid>
         <Grid item xs={12} sm={12} >
            <input
               accept="image/*"
               className={classes.input}
               id="contained-button-file"
               multiple
               type="file"
               onChange={handleImageInput}
            />
         </Grid>
      </Grid>
    </div>
   )
}

export default ChatFields