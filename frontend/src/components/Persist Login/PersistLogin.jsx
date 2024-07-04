import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefresh from "../../hooks/useRefresh";
import useAuth from "../../hooks/useAuth";


const PersistLogin = () =>{
    const [loading, setLoading] = useState(true);
    const refresh = useRefresh();
    const {user} = useAuth();



    useEffect(()=>{

        const verifyRefresh = async() =>{
            try{
                await refresh();

            }catch(error){
                console.log("Error verifying refresh token:", error);
            }
            finally{
                setLoading(false);
            }
        }
        !user?.token ? verifyRefresh() : setLoading(false);
    },[refresh])

    useEffect(()=>{
        console.log(`isLoading: ${loading}`);
        console.log(`aT: ${user?.token}`);
    },[loading])



    return(
        <>
        {loading ? <div>Loading...</div> : <Outlet />}
        </>
    )



}

export default PersistLogin;