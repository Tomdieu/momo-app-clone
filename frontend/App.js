import {
  Provider as PaperProvider,
  MD3LightTheme
} from "react-native-paper";

import Navigation from "./src/navigations";

import { LangProvider } from './src/provider/LangContext'
import { AuthProvider } from "./src/provider/AuthProvider";


const App = () => {
  return (
    <PaperProvider theme={MD3LightTheme}>
      <LangProvider>
        <AuthProvider>
          <Navigation />
        </AuthProvider>
      </LangProvider>
    </PaperProvider>
  );
};

export default App;
