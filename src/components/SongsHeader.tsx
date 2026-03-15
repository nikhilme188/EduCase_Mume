import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HeaderDivider from './HeaderDivider';

interface SongsHeaderProps {
    songCount: number;
    totalSongs?: number;
    filterLabel: string;
    theme: any;
    onFilterPress: () => void;
    itemLabel?: string;
}

const SongsHeader: React.FC<SongsHeaderProps> = ({
    songCount,
    totalSongs,
    filterLabel,
    theme,
    onFilterPress,
    itemLabel = 'songs',
}) => {
    const displayText = totalSongs
        ? `${songCount} ${itemLabel}`
        : `${songCount} ${itemLabel}`;

    return (
        <View style={{ backgroundColor: theme.background }}>
            <View style={styles.headerSection}>
                <View>
                    <Text style={[styles.songCountText, { color: theme.text }]}>
                        {displayText}
                    </Text>
                </View>

                <TouchableOpacity
                    style={[styles.filterButton, { borderColor: '#FF8216' }]}
                    onPress={onFilterPress}
                >
                    <Text style={styles.filterButtonText}>{filterLabel}</Text>
                    <Ionicons name="swap-vertical" size={20} color="#ff7a00" />
                </TouchableOpacity>
            </View>

            <HeaderDivider />
        </View>
    );
};

const styles = StyleSheet.create({
    headerSection: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    songCountText: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    filterStatusText: {
        fontSize: 12,
        fontWeight: '400',
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',

        paddingVertical: 6,
        paddingHorizontal: 10,

        gap: 6,
    },
    filterButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#FF8216',
    },
});

export default SongsHeader;
