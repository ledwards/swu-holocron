import React from 'react';
import Card from '../models/Card';

const AllCardsContext = React.createContext<Card[]>([]);

export default AllCardsContext;