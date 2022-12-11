import { useEffect, useState } from "react";
import { AccountContext } from "../context/WalletContext";

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState({});
  const [transfer, setTransfer] = useState([]);
  const [withdraw, setWithdraw] = useState([]);

  const [isLoading, setIsLoading] = useState(null);

  return (
    <AccountContext.Provider
      value={{
        account,
        setAccount,
        transfer,
        setTransfer,
        withdraw,
        setWithdraw,
        isLoading,
        setIsLoading,
      }}
    ></AccountContext.Provider>
  );
};
