import React, { useState } from 'react'
import { useUser } from '../context/UserContext';
import { Dialog } from '@mui/material';

function RegisterPage({ handleClose }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const { apiHost, saveToken } = useUser();
    const [open, setOpen] = useState(false);



    const login = () => {
        // // console.log(apiHost);
        // // console.log(email);
        // // console.log(password);

        let data = {
            name: name,
            email: email,
            password: password,
        }

        axios.post(`${apiHost}user/register`, data).then((res) => {
            // // console.log(res);
            if (res.data.message === 'OTP sent successfully') {
                // // console.log(res.data.message);
                return;
            }


        }).catch((err) => {
            // // console.log(err);
        });

    }

    const handleCloseVerify = (data) => {
        setOpen(false);
        handleClose();
        // // console.log(data);
    }

    return (
        <>
            <div className=' w-full px-6'>
                <p className=' text-center text-lg font-medium'>Welcome back..</p>
                <div className=' flex flex-row justify-end'><button onClick={handleClose}><CloseOutlinedIcon className=' text-red-600' /> </button></div>
                <form>

                    <div className=' flex flex-col gap-y-6 mb-4'>
                        <TextField id="outlined-basic" onChange={(e) => { setName(e.target.value) }} label="Full Name" variant="outlined" />
                        <TextField id="outlined-basic" onChange={(e) => { setEmail(e.target.value) }} label="Email Id" variant="outlined" />
                        <TextField id="outlined-basic" label="Password" onChange={(e) => { setPassword(e.target.value) }} variant="outlined" type="password" />
                    </div>

                    <Button className='' variant="contained" onClick={login}>Login</Button>
                </form>

                <p>Don't have an account yet? <button className=' text-blue-700 mt-4 underline' onClick={() => { handleClose('signUp') }}>SIGN UP</button></p>
            </div>

            <>
                <Dialog open={openVerifyDialog}></Dialog>
            </>
        </>
    )
}


export default RegisterPage
