import { LangContext } from "../context/LangContext";

import PropTypes from 'prop-types'

// import * as Localization from 'expo-localization'

import { I18n } from "i18n-js";

import en from '../I18n/en'
import fr from '../I18n/fr'

import { useState } from "react";

export const LangProvider = ({ children }) => {

    const [locale, setLocale] = useState('en')

    const i18n = new I18n({en:en,fr:fr})

    i18n.fallbacks = true;
    i18n.defaultLocale = 'en'
    i18n.locale = locale



    return (
        <LangContext.Provider value={{ i18n, setLocale }}>
            {children}
        </LangContext.Provider>
    )
}

LangProvider.propTypes = {
    children: PropTypes.node.isRequired
}