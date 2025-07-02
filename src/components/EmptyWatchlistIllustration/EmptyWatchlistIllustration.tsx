import React from 'react';
import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Theme } from '../../constants/theme';

interface EmptyWatchlistIllustrationProps {
    theme: Theme;
    width?: number;
    height?: number;
}

export const EmptyWatchlistIllustration: React.FC<EmptyWatchlistIllustrationProps> = ({
    theme,
    width = 240,
    height = 240,
}) => {
    // Create theme-aware SVG with modern design
    const createThemeAwareSvg = () => {
        const isDark = theme.background === '#0D1117';

        // Theme-aware colors
        const cardColor = theme.card || theme.surface;
        const borderColor = theme.border;
        const textColor = theme.text.tertiary;
        const accentColor = theme.accent;
        const shadowColor = isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)';

        return `
        <svg width="${width}" height="${height}" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Background circle with gradient -->
            <defs>
                <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:${accentColor};stop-opacity:0.1" />
                    <stop offset="100%" style="stop-color:${accentColor};stop-opacity:0.05" />
                </linearGradient>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="${shadowColor}"/>
                </filter>
            </defs>
            
            <!-- Background circle -->
            <circle cx="120" cy="120" r="100" fill="url(#bgGradient)" opacity="0.6"/>
            
            <!-- Main watchlist card -->
            <rect x="60" y="80" width="120" height="90" rx="12" fill="${cardColor}" stroke="${borderColor}" stroke-width="1.5" filter="url(#shadow)"/>
            
            <!-- Header bar -->
            <rect x="70" y="90" width="100" height="6" rx="3" fill="${textColor}" opacity="0.3"/>
            
            <!-- Stock item placeholders -->
            <rect x="70" y="105" width="80" height="4" rx="2" fill="${textColor}" opacity="0.2"/>
            <rect x="70" y="115" width="60" height="4" rx="2" fill="${textColor}" opacity="0.2"/>
            <rect x="70" y="125" width="70" height="4" rx="2" fill="${textColor}" opacity="0.2"/>
            
            <!-- Price placeholders (right aligned) -->
            <rect x="140" y="105" width="20" height="4" rx="2" fill="${textColor}" opacity="0.15"/>
            <rect x="135" y="115" width="25" height="4" rx="2" fill="${textColor}" opacity="0.15"/>
            <rect x="145" y="125" width="15" height="4" rx="2" fill="${textColor}" opacity="0.15"/>
            
            <!-- Divider lines -->
            <line x1="70" y1="112" x2="160" y2="112" stroke="${borderColor}" stroke-width="0.5" opacity="0.5"/>
            <line x1="70" y1="122" x2="160" y2="122" stroke="${borderColor}" stroke-width="0.5" opacity="0.5"/>
            
            <!-- Bookmark/Star icon in top right -->
            <circle cx="150" cy="100" r="8" fill="${accentColor}" opacity="0.2"/>
            <path d="M146 96L150 100L154 96M150 100L150 104" stroke="${accentColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            
            <!-- Plus icon for adding -->
            <circle cx="120" cy="200" r="24" fill="${accentColor}" opacity="0.9"/>
            <path d="M108 200L132 200M120 188L120 212" stroke="${theme.background}" stroke-width="3" stroke-linecap="round"/>
            
            <!-- Floating elements -->
            <circle cx="80" cy="60" r="3" fill="${accentColor}" opacity="0.4"/>
            <circle cx="170" cy="70" r="2" fill="${accentColor}" opacity="0.3"/>
            <circle cx="190" cy="140" r="4" fill="${accentColor}" opacity="0.2"/>
            <circle cx="50" cy="160" r="2.5" fill="${accentColor}" opacity="0.3"/>
            
            <!-- Trend line decoration -->
            <path d="M40 180 Q60 170 80 175 T120 165" stroke="${accentColor}" stroke-width="2" stroke-linecap="round" opacity="0.3" fill="none"/>
            <circle cx="120" cy="165" r="2" fill="${accentColor}" opacity="0.5"/>
        </svg>
        `;
    };

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <SvgXml xml={createThemeAwareSvg()} width={width} height={height} />
        </View>
    );
}; 