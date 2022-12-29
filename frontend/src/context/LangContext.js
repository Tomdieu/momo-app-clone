import { createContext } from "react";
import { useCode } from "react-native-reanimated";

export const LangContext = createContext()

export const useLanguageContext = () =>{
    return useCode(LangContext)
}