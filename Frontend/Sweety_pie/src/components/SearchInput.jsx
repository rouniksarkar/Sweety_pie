import React from 'react'
import { useSearch } from '../context/Search'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const SearchInput = () => {

    const navigate = useNavigate()

    const [value, setValue] = useSearch()
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        try {
            const { data } = await axios.get(`/api/v1/product/search/${value.keyword}`)
            setValue({ ...value, result: data });
            navigate("/search");
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div>
            <form
                onSubmit={handleSubmit}
                className="flex items-center max-w-lg mx-auto p-1 rounded-2xl bg-white shadow-md"
            >
                <input
                    type="search"
                    placeholder="Search products..."
                    className="flex-1 px-4 py-2 text-gray-700 placeholder-gray-400 bg-transparent border-none outline-none"
                    onChange={(e) =>
                        setValue({ ...value, keyword: e.target.value })
                    }
                />
                <button
                    type="submit"
                    className="px-5 py-2 text-white rounded-full bg-gradient-to-r from-green-400 to-green-600 hover:from-blue-600 hover:to-blue-400 transition-transform duration-300 hover:scale-105"
                >
                    Search
                </button>
            </form>
        </div >
    )
}

export default SearchInput
//(e)=>{setValue({...value,keyword:e.target.value})}