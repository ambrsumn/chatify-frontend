import React, { useEffect, useMemo, useState } from 'react'
import Sidebar from './Sidebar';
import SearchWindow from './SearchWindow';
import { DialogContent, DialogTitle, Snackbar, DialogActions, Dialog } from '@mui/material';
import LoginPage from './LoginPage';
import { useUser } from '../context/UserContext';
import ChatBox from './ChatBox';
import { io } from 'socket.io-client';
import CreateGroupDialog from './CreateGroupDialog';
import RegisterPage from './RegisterPage';
import VerificationDialog from './VerificationDialog';


function HomePage() {

    const { token, saveToken, apiHost, saveUserDetails, saveLogin, loggedIn, userDetails } = useUser();
    const [userData, setUserData] = useState(userDetails);
    const [openLogin, setOpenLogin] = useState(null);
    const [openSignup, setOpenSignup] = useState(false);
    const [person, setPerson] = useState({});
    const [openCreateGroupModal, setOpenCreateGroupModal] = useState(false);
    const [openVerificationModal, setOpenVerificationModal] = useState(false);
    const [userSignUpData, setUserSignUpData] = useState({});
    const [refreshSidebarr, setRefreshSidebar] = useState(false);

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
            console.log('not logged in');
            if (!openVerificationModal && !openSignup) {

                setOpenLogin(true);
            }
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

    const handleCloseLogin = (message, data) => {
        console.log(message);
        setOpenLogin(false);
        setOpenSignup(false);
        setOpenVerificationModal(false);
        // // console.log(data);

        if (message === 'signUp') {
            // console.log('sign up');
            setOpenSignup(true);
        }

        if (message === 'logged out') {
            setOpenLogin(true);
        }

        if (message === 'otp sent') {
            console.log(data);
            setUserSignUpData(data);
            setOpenVerificationModal(true);
        }
    }

    const handleCloseCreateGroup = () => {
        setOpenCreateGroupModal(false);
        setRefreshSidebar(!refreshSidebarr);
    }

    const handleOpenCreateGroup = () => {
        console.log('create group');
        setOpenCreateGroupModal(true);
    }

    return (
        <>
            <div className=' w-full h-[100vh] bg-[#EFF6FC] p-4'>
                {
                    loggedIn &&
                    <>
                        <div className='flex flex-row gap-x-6 h-full w-full'>
                            <div className=' w-[5%] h-full'><Sidebar createGroup={handleOpenCreateGroup} closeLogin={handleCloseLogin} ></Sidebar></div>
                            <div className=' w-[30%] h-full'><SearchWindow refresh={refreshSidebarr} openChat={openChat} userDetails={userData} ></SearchWindow></div>
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

            <>
                <Dialog open={openSignup} onClose={handleCloseLogin}>
                    <DialogContent>
                        <RegisterPage handleClose={handleCloseLogin} />
                    </DialogContent>
                </Dialog>
            </>

            <>
                <Dialog open={openVerificationModal} onClose={handleCloseLogin}>
                    <DialogContent>
                        <VerificationDialog userData={userSignUpData} handleClose={handleCloseLogin} />
                    </DialogContent>
                </Dialog>
            </>


            <>
                <Dialog open={openCreateGroupModal} onClose={handleCloseLogin}>
                    <DialogContent>
                        <CreateGroupDialog handleClose={handleCloseCreateGroup} />
                    </DialogContent>
                </Dialog>
            </>
        </>
    )
}

export default HomePage
