import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefresh from "./useRefresh";
import useAuth from "./useAuth";


const useAxiosPrivate = () => {
    const refresh = useRefresh();
    const {user}  = useAuth();
    useEffect(() => {

        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers["Authorization"]){
                    config.headers["Authorization"] = `Bearer ${user?.token}`;

                }
                return config;

            }, (error) => Promise.reject("Request Error")
        )



        const responseIntercept = axiosPrivate.interceptors.response.use(
            response =>response,
            async(error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 403 && !prevRequest.sent) {
                    prevRequest.sent = true;
                    const token = await refresh();
                    prevRequest.headers["Authorization"] = `Bearer ${token}`;
                    return axiosPrivate(prevRequest);
            }
            return Promise.reject(error);
        }
        );
        return () =>{ 
            axiosPrivate.interceptors.response.eject(responseIntercept);
            axiosPrivate.interceptors.request.eject(requestIntercept);
        };

    },[user,refresh])

    return axiosPrivate;
}



export default useAxiosPrivate;