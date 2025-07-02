import React from 'react';
import { Stock } from '../../types/stock';
import { StockCard } from '../StockCard';
import { useTheme } from '../../contexts/ThemeContext';

interface StockGridItemProps {
    stock: Stock;
    onPress: (stock: Stock) => void;
    category: 'gainers' | 'losers' | 'active';
}

export const StockGridItem: React.FC<StockGridItemProps> = ({
    stock,
    onPress,
    category
}) => {
    const { theme } = useTheme();

    return (
        <StockCard
            stock={stock}
            onPress={onPress}
            theme={theme}
            category={category}
        />
    );
}; 