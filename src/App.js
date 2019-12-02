import React, { useEffect, useState } from 'react'
import Users from './Components/Users'
import Main from './Components/Main'
import { BrowserRouter as Router, Route } from "react-router-dom";

import socketIOClient from 'socket.io-client'
const socket = socketIOClient('localhost:5000');

function App(){
  const [user_list, setUsers_list] = useState([])
  const [user, setUser] = useState({})

  useEffect(() => {
     fetch('http://localhost:5000/user')
        .then(res => res.json())
        .then(res => {
          setUsers_list(res.result)
        })
        .catch(e => {
           console.log('Error: ', e)
        })
  }, [])

  const handleJoin = (e) => {
    socket.emit('join', e)
    setUser({name: e.name, image: e.image})
  }

  return (
    <Router>
      <Route exact path='/' render={(routeProps) => <Users  user_list={user_list} handleJoin={handleJoin} {...routeProps}/>}/>
      <Route path='/chat' render={routeProps => <Main user_list={user_list} userData={user}  {...routeProps} />}  />
    </Router>
  )
}
export default App