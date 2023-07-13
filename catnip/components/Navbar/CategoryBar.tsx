import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import GlobalStyles from '../../constants/GlobalStyles';

export default function CategoryBar({ handleTitlePress }: any) {
    const [selectedTitle, setSelectedTitle] = useState('Outfits');

    const handleTitlePressAndSetSelectedTitle = (title: string) => {
        handleTitlePress(title)
        setSelectedTitle(title)
    }

    return (
        <View style={styles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.container}>
                    <TouchableOpacity onPress={() => handleTitlePressAndSetSelectedTitle('Outfits')}>
                        <View style={[styles.titleContainer, selectedTitle === 'Outfits' && styles.currentTitle]}>
                            <Text style={[styles.title, selectedTitle === 'Outfits' && styles.currentTitleText]}>Outfits</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleTitlePressAndSetSelectedTitle('Outerwear')}>
                        <View style={[styles.titleContainer, selectedTitle === 'Outerwear' && styles.currentTitle]}>
                            <Text style={[styles.title, selectedTitle === 'Outerwear' && styles.currentTitleText]}>Outerwear</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleTitlePressAndSetSelectedTitle('Tops')}>
                        <View style={[styles.titleContainer, selectedTitle === 'Tops' && styles.currentTitle]}>
                            <Text style={[styles.title, selectedTitle === 'Tops' && styles.currentTitleText]}>Tops</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleTitlePressAndSetSelectedTitle('Bottoms')}>
                        <View style={[styles.titleContainer, selectedTitle === 'Bottoms' && styles.currentTitle]}>
                            <Text style={[styles.title, selectedTitle === 'Bottoms' && styles.currentTitleText]}>Bottoms</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleTitlePressAndSetSelectedTitle('Footwear')}>
                        <View style={[styles.titleContainer, selectedTitle === 'Footwear' && styles.currentTitle]}>
                            <Text style={[styles.title, selectedTitle === 'Footwear' && styles.currentTitleText]}>Footwear</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: GlobalStyles.colorPalette.background,
        width: '100%',
    },
    titleContainer: {
        paddingHorizontal: 15,
    },
    title: {
        ...GlobalStyles.typography.body,
        color: GlobalStyles.colorPalette.primary[300],
    },
    currentTitle: {
        backgroundColor: 'black',
        borderRadius: 100,
        paddingHorizontal: 10,
        marginHorizontal: 5,
        paddingVertical: 4,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    currentTitleText: {
        color: 'white',
    },
});
