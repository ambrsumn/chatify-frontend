import { Autocomplete, Button, TextareaAutosize, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useUser } from '../context/UserContext';
// import MailOutlineIcon from '@mui/icons-material/MailOutline';
import MailRoundedIcon from '@mui/icons-material/MailRounded';
import RingLoader from "react-spinners/RingLoader";


function CreateGroupDialog({ handleClose }) {

    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const [members, setMembers] = useState([]);
    const top100Films = ['The Godfather', 'Pulp Fiction'];
    const [people, setPeople] = useState([]);
    const { token, saveToken, apiHost, saveUserDetails, saveLogin, userDetails } = useUser();
    const [openLoader, setOpenLoader] = useState(false);


    useEffect(() => {

        let headers = {
            'Authorization': `Bearer ${token}`,
        }

        axios.get(`${apiHost}user/getUsers`, { headers: headers }).then((res) => {

            let users = res.data.data;
            console.log(users);
            console.log(userDetails);

            let idx = users.findIndex((user) => user.userId === userDetails.userId);
            console.log(idx);
            users.splice(idx, 1);

            console.log(users);

            setPeople(users);


        });
    }, []);

    const createGroup = async () => {

        setOpenLoader(true);
        try {
            let data = {
                groupName: groupName,
                createdBy: userDetails.userId,
                adminName: userDetails.name,
                groupMembers: members,
            }

            let header = {
                'Authorization': `Bearer ${token}`,
            }

            axios.post(`${apiHost}group/creategroup`, data, { headers: header }).then((res) => {
                console.log(res);
                handleClose();
            })

            // console.log(data);
        }
        catch (err) {
            console.log(err);
        }
        finally {
            setOpenLoader(false);
            handleClose();
        }
    }

    return (
        <>
            {
                !openLoader &&
                <div>
                    <div className=' flex flex-row justify-between ml-4 mb-4'>
                        <p className=' text-xl font-medium text-green-600'>Create Group</p>
                        <button onClick={handleClose}><CloseIcon className=' hover:text-red-500' /></button>
                    </div>

                    <div className=' flex flex-col gap-y-6 px-4 py-2'>
                        <TextField onChange={(e) => { setGroupName(e.target.value) }} id="outlined-basic" label="Group Name" variant="outlined" />
                        {/* <TextField onChange={(e) => { setGroupName(e.target.value) }} id="outlined-basic" label="Group Description" variant="outlined" /> */}

                        <Autocomplete
                            className=' mb-4'
                            disablePortal
                            options={people}
                            multiple
                            getOptionLabel={(option) => option.name}
                            onChange={(event, value) => {
                                console.log(value);
                                setMembers(value.map(person => person.userId));
                            }}

                            sx={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Add members" />}
                        />

                        <div className=' flex flex-row justify-end'>
                            <Button onClick={createGroup} variant="outlined">Send Invite <MailRoundedIcon className=' ml-2' /> </Button>
                        </div>
                    </div>
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
    );
}

export default CreateGroupDialog
