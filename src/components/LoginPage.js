import React, { useState } from 'react'
import { Button, TextField } from '@mui/material'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useUser } from '../context/UserContext';
import axios from 'axios';
import RingLoader from "react-spinners/RingLoader";

function LoginPage({ handleClose }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const { token, saveToken, apiHost, saveUserDetails, saveLogin, userDetails, loggedIn } = useUser();
    const [returnData, setReturnData] = useState();
    const [openLoader, setOpenLoader] = useState(false);


    const login = () => {
        setOpenLoader(true);

        let data = {
            email: email,
            password: password,
        }

        axios.post(`${apiHost}user/login`, data).then((res) => {
            // // console.log(res);
            if (res.data.message !== 'Login Successfully') {
                // // console.log(res.data.message);
                return;
            }
            localStorage.setItem("token", res.data.token);
            saveToken(res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.userDetails));
            saveUserDetails(res.data.userDetails);
            saveLogin(true);

            // // console.log(token);
            // // console.log(apiHost);
            // // console.log(userDetails);
            // // console.log(loggedIn);

            let returner = res.data.userDetails;
            returner.token = res.data.token;
            setReturnData(returner);
            setOpenLoader(false);
            handleClose(returner);
        }).catch((err) => {
            setOpenLoader(false);
            // // console.log(err);
        });

    }

    return (
        <div className=' w-full px-6'>

            {
                !openLoader &&
                <>
                    <p className=' text-center text-lg font-medium'>Welcome back..</p>
                    <div className=' flex flex-row justify-end'><button onClick={handleClose}><CloseOutlinedIcon className=' text-red-600' /> </button></div>
                    <form>

                        <div className=' flex flex-col gap-y-6 mb-4'>
                            {/* <TextField id="outlined-basic" label="Full Name" variant="outlined" /> */}
                            <TextField className="outlined-basic" onChange={(e) => { setEmail(e.target.value) }} label="Email Id" variant="outlined" />
                            <TextField className="outlined-basic" label="Password" onChange={(e) => { setPassword(e.target.value) }} variant="outlined" type="password" />
                        </div>

                        <Button className='' variant="contained" onClick={login}>Login</Button>
                    </form>

                    <p>Don't have an account yet? <button className=' text-blue-700 mt-4 underline' onClick={() => { handleClose('signUp') }}>SIGN UP</button></p>
                </>
            }

            <RingLoader
                color="#6E00FF"
                loading={openLoader}
                size={50}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </div>
    )
}

export default LoginPage
