import { StatusBar } from "expo-status-bar";

import {
  Provider as PaperProvider,
  MD3LightTheme,
  adaptNavigationTheme,
} from "react-native-paper";

import Navigation from "./src/navigations";

import { AuthProvider } from "./src/provider/AuthProvider";


const App = () => {
  return (
    <PaperProvider theme={MD3LightTheme}>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </PaperProvider>
  );
};

export default App;
