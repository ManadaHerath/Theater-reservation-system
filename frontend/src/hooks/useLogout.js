import axios from "../api/axios";
import useAuth from "./useAuth";



const useLogout = () => {

        const {setUser} = useAuth();

        const logout = async () =>{
            setUser({})
            try{
                const response = await axios.get("/logout",{
                    withCredentials: true
                });

            }catch(error){
                console.log("Error logging out");
            }
        }
        return logout;

}

export default useLogout;