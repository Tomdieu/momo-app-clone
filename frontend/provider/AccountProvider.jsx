import { useEffect,useState } from "react";
import {AccountContext} from "../context/AccountContext";

export const AccountProvider = ({children}) => {
    const [account,setAccount] = useState({});
    const [transfer,setTransfer] = useState([]);
    const [withdraw,setWithdraw] = useState([]);

    const [isLoading,setIsLoading] = useState(null);

    return (
        <AccountContext.Provider value={account,transfer,withdraw,isLoading}></AccountContext.Provider>
    );


}