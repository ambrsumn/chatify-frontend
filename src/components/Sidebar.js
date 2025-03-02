import React, { useEffect, useState } from 'react'
import HomeIcon from '@mui/icons-material/Home';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios'
import { useUser } from '../context/UserContext'



function Sidebar({ closeLogin }) {

    const [icon, setIcon] = useState("");
    const { apiHost, saveToken, token, userDetails, saveUserDetails, saveLogin } = useUser();
    const [email, setEmail] = useState('');

    useEffect(() => {
        // // console.log(userDetails);

        if (userDetails) {
            if (userDetails.name) {
                // // // console.log(userDetails.name);
                let name = userDetails?.name?.toString();
                // // console.log(name);
                let firstName = name.split(" ")[0];
                // // console.log(firstName);
                let firstLetter = firstName[0];
                let lastName = name.split(" ")[1];
                let lastLetter = lastName[0];
                setIcon(firstLetter + lastLetter);
            }
            else {
                setIcon("AS");
            }

            if (userDetails.email) {
                setEmail(userDetails.email);
            }
        }
    }, [userDetails]);

    const logOut = () => {
        // // console.log(userDetails);

        let headers = {
            'Authorization': `Bearer ${token}`
        }
        // // console.log(headers);
        // // console.log(email);
        let data = {
            email: email
        }

        axios.post(`${apiHost}user/logout`, data, { headers: headers }).then((res) => {
            // // console.log(res);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            saveToken(null);
            saveUserDetails(null);
            closeLogin('logged out');
            saveLogin(false);

        }).catch((err) => {
            // // console.log(err);
        });





        // axios.post(`${apiHost}user/logout`,).then((res) => {
        //     // // console.log(res);
        // }).catch((err) => {
        //     // // console.log(err);
        // });
        // // // console.log(headers);

        // // axios.get(`${apiHost}user/getUsers`, { headers: headers })


        // localStorage.removeItem('token');
        // localStorage.removeItem('userDetails');
        // saveToken(null);
    }

    return (
        <div className="sidebar w-full h-full rounded-md bg-[#6E00FF] py-4 px-4" >

            <div className="flex flex-col justify-between tw-w-full h-[40%]" >

                <div className=' h-12 w-12 mx-auto rounded-full border border-gray-50 bg-[#31D3B3]' >
                    <p className=' py-2 px-3 font-medium text-black ' > {icon} </p>
                </div>

                < div className=' flex flex-col gap-y-12 mx-auto w-[60%]' >

                    <button><HomeIcon className=' text-white hover:text-black' /></button>
                    <button> <NotificationsIcon className=' text-white hover:text-black' /></button>
                    <button> <SettingsIcon className=' text-white hover:text-black' /></button>
                </div>

            </div>

            < div className=' absolute bottom-32 mx-auto px-3 w-[60%]' >
                <button onClick={logOut}> <LogoutIcon className=' text-white hover:text-black' /></button>

            </div>
        </div>
    )
}

export default Sidebar
