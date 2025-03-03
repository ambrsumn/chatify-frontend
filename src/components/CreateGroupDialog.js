import { Autocomplete, Button, TextareaAutosize, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useUser } from '../context/UserContext';
// import MailOutlineIcon from '@mui/icons-material/MailOutline';
import MailRoundedIcon from '@mui/icons-material/MailRounded';

function CreateGroupDialog({ handleClose }) {

    const [groupName, setGroupName] = useState('');
    const [members, setMembers] = useState([]);
    const top100Films = ['The Godfather', 'Pulp Fiction'];
    const [people, setPeople] = useState([]);
    const { token, saveToken, apiHost, saveUserDetails, saveLogin } = useUser();


    useEffect(() => {

        let headers = {
            'Authorization': `Bearer ${token}`,
        }

        axios.get(`${apiHost}user/getUsers`, { headers: headers }).then((res) => {
            // // // console.log(res);
            let users = res.data.data;
            console.log(users);
            setPeople(users);
        });
    }, []);

    return (
        <>
            <div className=' flex flex-row justify-between ml-4 mb-4'>
                <p className=' text-xl font-medium text-green-600'>Create Group</p>
                <button onClick={handleClose}><CloseIcon className=' hover:text-red-500' /></button>
            </div>

            <div className=' flex flex-col gap-y-6 px-4 py-2'>
                <TextField id="outlined-basic" label="Group Name" variant="outlined" />
                <TextField id="outlined-basic" label="Group Description" variant="outlined" />

                <Autocomplete
                    className=' mb-4'
                    disablePortal
                    options={people}
                    multiple
                    getOptionLabel={(option) => option.name}
                    onChange={(event, value) => console.log(value)}

                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Add members" />}
                />

                <div className=' flex flex-row justify-end'>
                    <Button variant="outlined">Send Invite <MailRoundedIcon className=' ml-2' /> </Button>
                </div>
            </div>
        </>
    );
}

export default CreateGroupDialog
