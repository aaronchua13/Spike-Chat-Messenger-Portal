import React, { useEffect, useState } from 'react'
import fetch from 'isomorphic-fetch'
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Avatar, ListItemAvatar } from '@material-ui/core';
import { NavLink } from "react-router-dom";

const useStyles = makeStyles(theme => ({
   root: {
     width: '100%',
     height: '100%',
     maxWidth: 360,
     margin: 'auto',
     backgroundColor: '#f4f4f4',
   },
   list: {
      padding: '1px'
   }
 }));

 function renderRow({data, style, handleJoin}) {
   return (
     <NavLink
        to="/chat"
        key={data.id}
      >
         <ListItem button >
            <ListItemAvatar>
               <Avatar src={data.image}/>
            </ListItemAvatar>
            <ListItemText  primary={`${data.name}`} onClick={() => handleJoin(data)} />
         </ListItem>
     </NavLink>
   );
 }

function Users({user_list, handleJoin}){
   const classes = useStyles()
  return (
     <div className={classes.root}>
       {
         user_list.map(e => renderRow({data: e, style: classes, handleJoin}))
       }
     </div>
  )
}

 
 
export default Users
