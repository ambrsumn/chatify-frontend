import React, { useEffect, useMemo, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { TextField, Button, Grid, Box, Typography } from '@mui/material'
import SendIcon from '@mui/icons-material/Send';
import './App.css'
// import Sidebar from './components/Sidebar.tsx';
import HomePage from './components/HomePage';
import { UserProvider } from './context/UserContext';

export default function App() {

  // const socket = useMemo(() => {
  //   return io('http://localhost:8080', {
  //     auth:
  //     {
  //       token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFtYmVyc3VtYW4xM0BnbWFpbC5jb20iLCJuYW1lIjoiQW1iZXIgUyIsImlhdCI6MTc0MDU4MzUzNSwiZXhwIjoxNzQwNjA1MTM1fQ.RpFg'
  //     }
  //   })
  // }, []);

  const [loggedIn, setLoggedIn] = useState(true);
  const [userData, setUserData] = useState({});
  const [id, setId] = useState(null);
  const [message, setMessage] = useState('');

  // const sendMessage = () => {
  //   let sendMessage = {
  //     name: id,
  //     message: message
  //   }
  //   socket.emit('message', sendMessage);
  // }

  // useEffect(() => {
  //   socket.on('connect', () => {
  //     // // console.log('Connected');
  //     // // console.log('my id - ', socket.id);
  //     setId(socket.id);

  //     // let messageData = {
  //     //   name: socket.id,
  //     //   message: 'Hello from client'
  //     // }
  //     // // // console.log(messageData);

  //     socket.on('joining', (data) => {
  //       // // console.log(data);
  //     })

  //     // socket.emit('message', messageData);

  //     socket.on('receivedMessage', (message) => {
  //       // // // console.log(message);
  //       // // console.log(message.message, ' - ', message.name);
  //     })
  //   })



  //   return () => {
  //     // // console.log('Disconnected');
  //     socket.disconnect();
  //   }
  // }, [])


  return (
    <UserProvider>
      <>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<HomePage />} />
          </Routes>
        </BrowserRouter>
      </>
    </UserProvider>
  )
}
