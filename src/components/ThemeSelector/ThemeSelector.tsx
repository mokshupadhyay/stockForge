import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useThemeSelectorController } from './ThemeSelector.controller';
import { styles } from './ThemeSelector.styles';

interface ThemeSelectorProps {
    visible: boolean;
    onClose: () => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ visible, onClose }) => {
    const {
        theme,
        themeMode,
        themeOptions,
        handleThemeSelect,
    } = useThemeSelectorController({ onClose });

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
            presentationStyle="overFullScreen"
            statusBarTranslucent={true}
        >
            <View style={styles.overlay}>
                <View style={[styles.container, { backgroundColor: theme.background }]}>
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: theme.text.primary }]}>
                            Choose Theme
                        </Text>
                        <TouchableOpacity
                            onPress={onClose}
                            style={[styles.closeButton, { backgroundColor: theme.surface }]}
                        >
                            <MaterialIcons name="close" size={24} color={theme.text.primary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.optionsContainer}>
                        {themeOptions.map((option) => (
                            <TouchableOpacity
                                key={option.key}
                                style={[
                                    styles.option,
                                    {
                                        backgroundColor: themeMode === option.key ? theme.accent + '15' : theme.surface,
                                        borderColor: themeMode === option.key ? theme.accent : theme.border,
                                    }
                                ]}
                                onPress={() => handleThemeSelect(option.key)}
                                activeOpacity={0.7}
                            >
                                <View style={[
                                    styles.iconContainer,
                                    {
                                        backgroundColor: themeMode === option.key ? theme.accent : theme.border + '30'
                                    }
                                ]}>
                                    <MaterialIcons
                                        name={option.icon}
                                        size={24}
                                        color={themeMode === option.key ? theme.background : theme.text.secondary}
                                    />
                                </View>

                                <View style={styles.optionContent}>
                                    <Text style={[
                                        styles.optionLabel,
                                        {
                                            color: themeMode === option.key ? theme.accent : theme.text.primary,
                                            fontWeight: themeMode === option.key ? '600' : '500'
                                        }
                                    ]}>
                                        {option.label}
                                    </Text>
                                    <Text style={[styles.optionDescription, { color: theme.text.secondary }]}>
                                        {option.description}
                                    </Text>
                                </View>

                                {themeMode === option.key && (
                                    <MaterialIcons
                                        name="check-circle"
                                        size={24}
                                        color={theme.accent}
                                    />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>
        </Modal>
    );
}; 