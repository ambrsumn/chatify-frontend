import React, { useState } from 'react'
import { useUser } from '../context/UserContext';
import { Button, Dialog, TextField } from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import axios from 'axios';
import RingLoader from "react-spinners/RingLoader";

function RegisterPage({ handleClose }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const { apiHost, saveToken } = useUser();
    const [openLoader, setOpenLoader] = useState(false);



    const signUp = () => {

        setOpenLoader(true);

        let data = {
            name: name,
            email: email,
            password: password,
        }

        axios.post(`${apiHost}user/register`, data).then((res) => {
            // // console.log(res);
            if (res.data.message === 'OTP sent successfully') {
                setOpenLoader(false);
                handleClose('otp sent', data);
            }

        }).catch((err) => {
            setOpenLoader(false);
            console.log(err);
        });

    }

    return (
        <>
            {
                !openLoader &&
                <div className=' w-full px-6'>
                    <p className=' text-center text-lg font-medium text-green-500'>Create a free account</p>
                    <div className=' flex flex-row justify-end'><button onClick={handleClose}><CloseOutlinedIcon className=' text-red-600' /> </button></div>
                    <form>

                        <div className=' flex flex-col gap-y-6 mb-4'>
                            <TextField id="outlined-basic" onChange={(e) => { setName(e.target.value) }} label="Full Name" variant="outlined" />
                            <TextField id="outlined-basic" onChange={(e) => { setEmail(e.target.value) }} label="Email Id" variant="outlined" />
                            <TextField id="outlined-basic" label="Password" onChange={(e) => { setPassword(e.target.value) }} variant="outlined" type="password" />
                        </div>

                        <Button className='' variant="contained" onClick={signUp}>Register</Button>
                    </form>

                    <p>Already have an account? <button className=' text-blue-700 mt-4 underline' onClick={() => { handleClose('logged out') }}>Login</button></p>
                </div>
            }

            <RingLoader
                color="#6E00FF"
                loading={openLoader}
                size={50}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </>
    )
}


export default RegisterPage
