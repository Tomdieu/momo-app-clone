import { StatusBar } from "expo-status-bar";

import { Provider as PaperProvider,MD3LightTheme, adaptNavigationTheme } from 'react-native-paper';
import AuthProvider from "./provider/AuthProvider";
import WalletProvider from "./provider/WalletProvider";

import Navigation from "./Navigation";

const { LightTheme } = adaptNavigationTheme({ reactNavigationLight: DefaultTheme });

const App = () => {
  return (
    <PaperProvider theme={MD3LightTheme}>
    <AuthProvider>
      <WalletProvider>
        <Navigation />
      </WalletProvider>
    </AuthProvider>
    </PaperProvider>
  )
}

export default App;


