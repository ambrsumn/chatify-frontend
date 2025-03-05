import React, { useEffect, useState } from 'react'
import searchIcon from '../assets/search.png'
import { useUser } from '../context/UserContext';
import axios from 'axios';

function SearchWindow({ userDetails, openChat, refresh }) {

    const [people, setPeople] = useState([]);
    const { token, saveToken, apiHost, saveUserDetails, saveLogin } = useUser();


    useEffect(() => {
        console.log("SEARCH WINDOW");
        // // // console.log(apiHost, token);
        let headers = {
            'Authorization': `Bearer ${token}`,
        }
        // // // console.log(headers);

        axios.get(`${apiHost}user/getUsers`, { headers: headers }).then((res) => {
            // // // console.log(res);
            let users = res.data.data;
            // // // console.log(users);
            openChat(users[0]);
            setPeople(users);
        });


    }, [refresh]);



    return (
        <div className=' w-full h-full  flex flex-col gap-y-6 py-4' >

            <div className='top-0 sticky w-[80%] mx-auto h-[5vh] rounded-lg shadow-lg bg-white flex flex-row gap-x-2 px-2'>
                <img className=' w-8 h-8 my-auto ' src={searchIcon} alt="" />
                <input className='w-full text-black font-medium' type="text" placeholder='Search names here' />
            </div>

            <div className='w-[80%] overflow-y-scroll mx-auto h-[95vh] pb-4 rounded-lg shadow-lg bg-white px-2'>
                <p className=' text-left text-lg font-medium mb-6'>People</p>

                <div className=' flex flex-col gap-y-4'>
                    {people.map((person, idx) => {
                        const randomColor = `hsl(${Math.random() * 360}, 70%, 85%)`
                        return (

                            <div onClick={() => {
                                // // console.log(people[idx]);
                                openChat(people[idx])
                            }} key={person.userId} className=' flex flex-col hover:cursor-pointer '>
                                <div className=' flex flex-row justify-between'>
                                    <div className=' flex flex-row gap-x-2'>
                                        <div className={` h-10 w-10 rounded-full border border-black`} style={{ backgroundColor: randomColor }}>
                                            <p className=' py-2 px-2 text-black'>{person.name.split(' ')[0].charAt(0)}{person.name.split(' ')[1].charAt(0)}</p>
                                        </div>
                                        <div>
                                            <p className=' pt-2 font-medium text-base'>{person.name}</p>
                                        </div>
                                    </div>
                                    {
                                        person.is_online === 1 &&
                                        <div className=' h-3 w-3 rounded-full mt-3 mr-4 bg-green-600'></div>

                                    }
                                </div>
                                <div className=' '>
                                    <p className=' text-sm text-gray-400 text-left ml-12'>{person.message}</p>
                                </div>
                            </div>

                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default SearchWindow
