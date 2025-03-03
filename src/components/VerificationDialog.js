import { Button, TextField } from '@mui/material'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useUser } from '../context/UserContext';

function VerificationDialog({ handleClose, userData }) {

    const [otp, setOtp] = useState(0);
    const { apiHost } = useUser();

    useEffect(() => {
        console.log(userData);
    }, []);

    const register = async () => {
        try {
            let data = userData;
            data.otp = +otp;

            console.log(data);

            axios.post(`${apiHost}user/verifyOtp`, data).then((res) => {
                console.log(res);

                if (res.data.message === 'User created successfully') {
                    handleClose('logged out');
                }
            });
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <div className=' flex flex-col gap-y-4'>
                <p className=' text-center font-medium text-lg'>Enter the otp sent to {userData.email}</p>

                <TextField id="outlined-basic" onChange={(e) => { setOtp(e.target.value) }} label="enter the 6 digit otp" variant="outlined" />

                <Button variant="contained" onClick={register}>Verify</Button>
            </div>
        </>
    )
}

export default VerificationDialog
