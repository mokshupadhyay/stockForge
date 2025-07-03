import React from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    TextInput,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';
import { Theme } from '../../constants/theme';

interface WatchlistCreateModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    value: string;
    onChangeText: (text: string) => void;
    error?: string;
    inputRef?: React.RefObject<TextInput | null>;
    theme: Theme;
}

export const WatchlistCreateModal: React.FC<WatchlistCreateModalProps> = ({
    visible,
    onClose,
    onConfirm,
    value,
    onChangeText,
    error,
    inputRef,
    theme,
}) => {
    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={{
                    flex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 20,
                }}
                activeOpacity={1}
                onPress={onClose}
            >
                <KeyboardAvoidingView
                    style={{ width: '100%', alignItems: 'center' }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={(e) => e.stopPropagation()}
                        style={{ width: '100%', maxWidth: 320 }}
                    >
                        <View style={{
                            backgroundColor: theme.background,
                            borderRadius: 16,
                            padding: 24,
                            width: '100%',
                            shadowColor: theme.shadow,
                            shadowOffset: {
                                width: 0,
                                height: 8,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 24,
                            elevation: 16,
                        }}>
                            <Text style={{
                                fontSize: 18,
                                fontWeight: '700',
                                textAlign: 'center',
                                marginBottom: 8,
                                color: theme.text.primary,
                            }}>
                                Create Watchlist
                            </Text>

                            <Text style={{
                                fontSize: 14,
                                textAlign: 'center',
                                marginBottom: 20,
                                lineHeight: 20,
                                color: theme.text.secondary,
                            }}>
                                Enter a name for your new watchlist
                            </Text>

                            <TextInput
                                key="watchlist-name-input"
                                ref={inputRef}
                                style={[
                                    {
                                        borderWidth: 1,
                                        borderRadius: 8,
                                        paddingHorizontal: 16,
                                        paddingVertical: 12,
                                        fontSize: 16,
                                        marginBottom: 8,
                                        backgroundColor: theme.surface,
                                        borderColor: theme.border,
                                        color: theme.text.primary,
                                    },
                                    error && {
                                        borderColor: theme.error,
                                        borderWidth: 2,
                                    }
                                ]}
                                value={value}
                                onChangeText={onChangeText}
                                placeholder="Watchlist name"
                                placeholderTextColor={theme.text.tertiary}
                                autoFocus={false}
                                selectTextOnFocus={true}
                                returnKeyType="done"
                                onSubmitEditing={onConfirm}
                            />

                            {error ? (
                                <Text style={{
                                    fontSize: 12,
                                    marginBottom: 16,
                                    textAlign: 'left',
                                    color: theme.error,
                                }}>
                                    {error}
                                </Text>
                            ) : null}

                            <View style={{
                                flexDirection: 'row',
                                gap: 12,
                            }}>
                                <TouchableOpacity
                                    style={{
                                        flex: 1,
                                        paddingVertical: 12,
                                        borderRadius: 8,
                                        alignItems: 'center',
                                        backgroundColor: theme.surface,
                                    }}
                                    onPress={onClose}
                                >
                                    <Text style={{
                                        fontWeight: '600',
                                        color: theme.text.secondary,
                                    }}>
                                        Cancel
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={{
                                        flex: 1,
                                        paddingVertical: 12,
                                        borderRadius: 8,
                                        alignItems: 'center',
                                        backgroundColor: theme.accent,
                                        opacity: !value.trim() ? 0.5 : 1,
                                    }}
                                    onPress={onConfirm}
                                    disabled={!value.trim()}
                                >
                                    <Text style={{
                                        fontWeight: '600',
                                        color: theme.background,
                                    }}>
                                        Create
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </TouchableOpacity>
        </Modal>
    );
}; 