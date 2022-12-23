import { StatusBar } from "expo-status-bar";

import { Provider as PaperProvider,MD3LightTheme, adaptNavigationTheme } from 'react-native-paper';

import Navigation from './src/navigations'

const { LightTheme } = adaptNavigationTheme({ reactNavigationLight: DefaultTheme });

const App = () => {
  return (
    <PaperProvider theme={MD3LightTheme}>
      <Navigation/>
    </PaperProvider>
  )
}

export default App;


