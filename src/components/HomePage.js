import React, { useEffect, useMemo, useState } from 'react'
import Sidebar from './Sidebar';
import SearchWindow from './SearchWindow';
import { DialogContent, DialogTitle, Snackbar, DialogActions, Dialog } from '@mui/material';
import LoginPage from './LoginPage';
import { useUser } from '../context/UserContext';
import ChatBox from './ChatBox';
import { io } from 'socket.io-client';


function HomePage() {

    const { token, saveToken, apiHost, saveUserDetails, saveLogin, loggedIn, userDetails } = useUser();
    const [userData, setUserData] = useState(userDetails);
    const [openLogin, setOpenLogin] = useState(null);
    const [openSignup, setOpenSignup] = useState(false);
    const [person, setPerson] = useState({});

    const socket = useMemo(() => {
        // console.log(token, 'hhhh');
        return io('http://localhost:8080', {
            auth:
            {
                token: token
            }
        });
    }, [openLogin]);

    const handleMessages = (data) => {
        // console.log(data);
        // console.log('message');

        socket.emit('message', data);
    }

    useEffect(() => {
        let userDetail = localStorage.getItem('user');
        if (userDetail) {
            let userData = JSON.parse(userDetail);
            setUserData(userData);
            setOpenLogin(false);
        }
        else {
            setOpenLogin(true);
        }



        socket.on('connect', () => {
            // console.log('connected');
            // console.log(socket.id);
            // console.log(socket.user);
        })
    }, [openLogin]);

    const openChat = (person) => {
        // console.log(person);
        setPerson(person);
    }

    const handleCloseLogin = (data) => {
        // // console.log(data);
        setOpenLogin(false);
        // // console.log(data);

        if (data === 'Sign up') {
            setOpenSignup(true);
        }

        if (data === 'logged out') {
            setOpenLogin(true);
        }
    }



    return (
        <>
            <div className=' w-full h-[100vh] bg-[#EFF6FC] p-4'>
                {
                    loggedIn &&
                    <>
                        <div className='flex flex-row gap-x-6 h-full w-full'>
                            <div className=' w-[5%] h-full'><Sidebar closeLogin={handleCloseLogin} ></Sidebar></div>
                            <div className=' w-[30%] h-full'><SearchWindow openChat={openChat} userDetails={userData} ></SearchWindow></div>
                            <div className=' w-[70%] h-full'><ChatBox socket={socket} receipent={person} sendMessage={handleMessages}></ChatBox> </div>
                        </div>
                    </>
                }
            </div>

            <>
                <Dialog open={openLogin} onClose={handleCloseLogin}>
                    <DialogContent>
                        <LoginPage handleClose={handleCloseLogin} />
                    </DialogContent>
                </Dialog>
            </>
        </>
    )
}

export default HomePage
