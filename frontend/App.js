import { StatusBar } from "expo-status-bar";

import AuthProvider from "./provider/AuthProvider";
import WalletProvider from "./provider/WalletProvider";

import Navigation from "./Navigation";

const App = () => {
  return (
    <AuthProvider>
      <WalletProvider>
        <Navigation />
      </WalletProvider>
    </AuthProvider>
  )
}

export default App;


