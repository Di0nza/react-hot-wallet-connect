import React, { useCallback, useContext, useEffect, useState } from "react";
import { HereWallet } from "@here-wallet/core";

export const HotContext = React.createContext({
  login: () => {},
  logout: () => {},
  here: null,
  user: null,
});

export const useHotWallet = () => {
  return useContext(HotContext);
};

export const HotWalletProvider = ({ children }) => {
  const [here, setHere] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const init = async () => {
      const here = await HereWallet.connect({
        walletId: "herewalletbot/app",
        botId: "HotWalletConnectTestBot/app",
      });

      setHere(here);

      const isSigned = await here.isSignedIn();
      if (isSigned) {
        const near = await here.getAccountId();
        setUser({ accounts: { near, solana: "", evm: "", ton: "" } });
        const account = await here.account(near);
        console.log(account)
        const data = await here.authStorage.getAccounts;
        console.log(data)
      }
    };

    init();
  }, []);

  const login = useCallback(() => {
    here?.authenticate();
  }, [here]);

  const logout = useCallback(() => {
    here?.signOut();
    setUser(null);
  }, [here]);

  return (
    <HotContext.Provider value={{ login, logout, here, user }}>
      {children}
    </HotContext.Provider>
  );
};
