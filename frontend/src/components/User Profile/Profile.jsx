import React,{useState,useEffect} from 'react'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
export default function Profile() {
    const[profile,setProfile]=useState([])
    const axiosPrivate=useAxiosPrivate()

    useEffect(()=>{
        const fetchProfile=async()=>{
            try{
                const response=await axiosPrivate.get("/users/getUser")
                console.log('API response:',response.data)
                setProfile(response.data)
            }catch(error){
                console.error('API error:',error)
            }
        }
        fetchProfile()
    },[])
  return (
    <div>Profile</div>
  )
}
