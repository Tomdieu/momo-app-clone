import { createContext,useContext } from "react";

export const LangContext = createContext()

export const useLanguageContext = () =>{return useContext(LangContext)}