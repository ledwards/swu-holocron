import React from 'react';
import { Theme } from '../types/interfaces';

const ThemeContext = React.createContext<Theme | null>(null);

export default ThemeContext;