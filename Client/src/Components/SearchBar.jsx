import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { get, post } from '../APIs/api';

function SearchBar() {
    const [searchData, setSearchData] = useState("")
    const [message, setMessage] = useState("")

    const handleOnChange = (e) => {
        e.preventDefault();
        setSearchData(e.target.value)
    }

    const handOnSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await get(`/users/search?searchData=${searchData}`)
            console.log("res:", res.data)
            setMessage(res.data.message); // show backend message
        } catch (error) {
            const err = error?.response?.data?.message || "Something went wrong!!"
            setMessage(err);
            console.log("Search Error:", err);
        }

    }

    return (
        <form className='space-x-8 md:flex hidden' onSubmit={handOnSubmit}>
            <input
                id='searchBar'
                type="text"
                value={searchData}
                onChange={handleOnChange}
                className='border-2 outline-0 border-black dark:border-white px-5 rounded-2xl'
                placeholder='Search'
            />
            <Button
                type='submit'
                variant="contained"
                startIcon={<SearchIcon
                    type="submit"
                />}>
                Search
            </Button>
        </form>
    )
}

export default SearchBar
