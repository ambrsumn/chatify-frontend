import React, { useEffect, useState } from 'react'
import CallIcon from '@mui/icons-material/Call';
import DuoIcon from '@mui/icons-material/Duo';
import { Button, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useUser } from '../context/UserContext';
import axios from 'axios';

function ChatBox({ receipent, sendMessage, socket }) {

    const [onlineToday, setOnlineToday] = useState(false);
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const { userDetails, token, apiHost } = useUser();
    const [lastMessageIndex, setLastMessageIndex] = useState(0);
    const [showTyping, setShowTyping] = useState(false);
    // const [messageDate, setMessageDate] = useState('');
    // const [date, setDate] = 

    useEffect(() => {
        // setMessageDate('01/03/2025');
        setShowTyping(false);
        let currentDateTime = new Date().toLocaleString("en-US", {
            timeZone: "Asia/Kolkata",
            hour12: false // Ensures 24-hour format
        }).replace(',', '').replace(/\//g, '-');
        if (receipent.lastSeen && receipent.lastSeen.split(' ')[0] === currentDateTime.split(' ')[0]) {
            setOnlineToday(true);
        }
        else {
            setOnlineToday(false);
        }

        socket.on('receivedMessage', (data) => {
            setShowTyping(false);
            console.log(data);
            console.log(data.message);

            let messageData = {
                id: data.id,
                message: data.message,
                from: data.sender,
                time: data.messageTime,
            };
            setLastMessageIndex(data.id);
            setChat((prev) => [...prev, messageData]);
        });

        socket.on('typing', (data) => {
            console.log(data);
            setShowTyping(true);
            setTimeout(() => {
                setShowTyping(false);
            }, 5000);
        });
        let headers = {
            'Authorization': `Bearer ${token}`
        }

        let getUserId = userDetails.userId;
        if (!getUserId) {
            getUserId = 0
        }

        let channelKey = "";
        if (receipent.userId < userDetails.userId) {
            channelKey = `${receipent.userId}-${userDetails.userId}`
        }
        else {
            channelKey = `${userDetails.userId}-${receipent.userId}`
        }

        axios.get(`${apiHost}user/getroomId?userId=${receipent.userId}`, { headers: headers }).then(res => {
            receipent.roomId = res.data.data;
        }).catch(err => {
        })

        axios.get(`${apiHost}messages/getUserMessages?channelKey=${channelKey}`, { headers: headers }).then(res => {
            // receipent.roomId = res.data.data;
            console.log(res.data);
            console.log(res.data.data);

            let previousMessages = [];

            for (let i = 0; i < res.data.data.length; i++) {
                let messageData = {
                    id: res.data.data[i].id,
                    message: res.data.data[i].message,
                    from: res.data.data[i].sentBy,
                    time: res.data.data[i].messageTime
                };

                previousMessages.push(messageData);
                setLastMessageIndex(messageData.id);
            }


            setChat(previousMessages);
        }).catch(err => {
        })

        return () => {
            socket.off('receivedMessage');
        }

    }, [receipent, socket]);

    const handleMessage = () => {

        let options = {
            timeZone: "Asia/Kolkata",
            hour12: false,
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        };

        let currentDateTime = new Intl.DateTimeFormat("en-GB", options).format(new Date());
        currentDateTime = currentDateTime.replace(',', '');

        console.log(currentDateTime);
        let newMessageId = lastMessageIndex + 1;
        setLastMessageIndex(newMessageId);

        let data = {
            id: newMessageId,
            message: message,
            receipent: receipent.userId,
            receipentRoom: receipent.roomId,
            sender: userDetails.userId,
            time: currentDateTime,
        };

        socket.emit('message', data);

        let messageData = {
            id: newMessageId,
            message: message,
            from: userDetails.userId,
            time: currentDateTime,
        };

        // ✅ Correct way to update chat state
        setChat((prev) => [...prev, messageData]);

        setMessage('');
    };

    const sendUserIsTyping = () => {
        let data = {
            message: 'typing',
            receipent: receipent.userId,
            receipentRoom: receipent.roomId,
            sender: userDetails.userId,
        }

        socket.emit('typing', data);
    }



    return (
        <div className=' w-full h-[96%] flex flex-col my-4 rounded-md shadow-md px-4 py-4 bg-[#B3D8A8]'>
            {/* <p>{receipent.name}</p> */}
            <div id='header' className=' border-b border-white  h-[8%] px-6'>
                <div className=' flex flex-row justify-between'>
                    <div className=' flex flex-col gap-y-2'>
                        <p className=' font-semibold text-xl text-black'>{receipent.name}</p>
                        {
                            !showTyping && receipent.is_online === 1 && <p className=' text-base text-green-700 pl-1 font-semibold'>online</p>
                        }

                        {
                            !showTyping && receipent.is_online === 0 && <p className=' text-white text-sm font-medium'>Last seen {onlineToday && <span>today</span>} at {receipent.lastSeen && receipent.lastSeen.split(' ')[1]} {!onlineToday && <span> on {receipent.lastSeen && receipent.lastSeen.split(' ')[0]}</span>}</p>
                        }
                        {
                            showTyping && <div className=' flex flex-row gap-x-3 text-base text-green-700 pl-1 font-semibold'>
                                <p>Typing</p>
                                <div className="typing mt-3">
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                </div></div>
                        }
                    </div>

                    <div className=' flex flex-row gap-x-6 '>
                        <button> <CallIcon className=' text-[#6E00FF]' /></button>
                        <button> <DuoIcon className=' text-[#6E00FF]' /></button>
                    </div>
                </div>
            </div>


            <div id='chat-screen' className='h-[85%]'>
                <div className=' h-[90%] px-4 py-4 overflow-y-scroll'>
                    {
                        chat.length > 0 && chat.map((msg, idx) => {

                            const currentMessageDate = msg.time.split(' ')[0];
                            let showDateHeader = true;
                            {/* console.log(showDateHeader, currentMessageDate); */ }

                            if (idx > 0 && currentMessageDate === chat[idx - 1].time.split(' ')[0]) {
                                showDateHeader = false;
                            }

                            console.log(showDateHeader, currentMessageDate);

                            {/* if (showDateHeader) {
                                console.log(currentMessageDate);
                                setMessageDate(currentMessageDate);
                            } */}
                            return (
                                <>
                                    {
                                        showDateHeader &&
                                        <div className=' flex flex-row justify-center'>
                                            <p className=' text-center bg-gray-300 w-fit px-3 py1 rounded-lg shadow-md'>{currentMessageDate}</p>
                                        </div>

                                    }
                                    <div key={idx} className={`flex flex-row mb-2 ${msg.from === userDetails.userId ? 'justify-end' : 'justify-start'}`}>
                                        <p className=' text-black font-semibold'> {msg.message}</p>
                                    </div>
                                </>
                            )
                        })
                    }
                </div>
                <div className=' h-[10%] absolute bottom-8 ml-4'>
                    {
                        showTyping &&
                        <div class="chat-bubble">
                            <div className="typing">
                                {/* <p>typing</p> */}
                                <div className="dot"></div>
                                <div className="dot"></div>
                                <div className="dot"></div>
                            </div>
                        </div>
                    }
                </div>
            </div>


            <div id='send-message' className=' h-[5%] px-4'>
                <div className=' flex flex-row gap-x-4 w-full'>
                    <TextField className=' w-[90%]' id="standard-basic" label="Type your message" variant="standard" value={message} onChange={(e) => { setMessage(e.target.value); sendUserIsTyping(); }} />
                    <div className=' mt-6'>
                        <Button onClick={handleMessage} className=' h-1/2' variant="text"> <SendIcon /> </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatBox
