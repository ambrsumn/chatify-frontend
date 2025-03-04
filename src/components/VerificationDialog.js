import { Button, TextField } from '@mui/material'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useUser } from '../context/UserContext';
import RingLoader from "react-spinners/RingLoader";

function VerificationDialog({ handleClose, userData }) {

    const [otp, setOtp] = useState(0);
    const { apiHost } = useUser();
    const [openLoader, setOpenLoader] = useState(false);

    useEffect(() => {
        console.log(userData);
    }, []);

    const register = async () => {

        setOpenLoader(true);
        try {
            let data = userData;
            data.otp = +otp;

            console.log(data);

            axios.post(`${apiHost}user/verifyOtp`, data).then((res) => {
                console.log(res);

                if (res.data.message === 'User created successfully') {
                    setOpenLoader(false);
                    handleClose('logged out');
                }
            });
        }
        catch (err) {
            setOpenLoader(false);
            console.log(err);
        }
    }

    return (
        <>
            {
                !openLoader &&
                <div className=' flex flex-col gap-y-4'>
                    <p className=' text-center font-medium text-lg'>Enter the otp sent to {userData.email}</p>

                    <TextField id="outlined-basic" onChange={(e) => { setOtp(e.target.value) }} label="enter the 6 digit otp" variant="outlined" />

                    <Button variant="contained" onClick={register}>Verify</Button>
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

export default VerificationDialog
