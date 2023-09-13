import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import ItemCell from '../../components/Cell/ItemCell';

import GlobalStyles from '../../constants/GlobalStyles';
import { ScrollView } from 'react-native-gesture-handler';
import { TagAction } from '../../constants/Enums';

import ColorTagsList from '../../components/ColorManager/ColorTagsList';
import { UserClothing } from '../../pages/Match';

interface ItemViewPropsType {
    clothingItem: UserClothing;
}

const ItemView = ({ clothingItem }: ItemViewPropsType) => {
    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={{ flex: 1 }}>

                    <ItemCell image={clothingItem.image} disablePress />
                </View>
                <View style={styles.categoryContainer}>
                    <Text style={styles.subheader}>Colors</Text>
                    <ColorTagsList data={clothingItem.colors} tagAction={TagAction.static} />
                </View>
            </ View>
            {/* <View style={styles.categoryContainer}>
                    <Text style={styles.subheader}>Brands</Text>
                    <View style={styles.tagsContainer}>
                        <BrandTag
                            action={TagAction.static}
                            label="Gap"
                        />
                        <BrandTag
                            action={TagAction.static}
                            label="Nike"
                        />
                    </View>
                </View> */}
        </ScrollView>
    );
};

export default ItemView;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: GlobalStyles.layout.xGap,
        gap: GlobalStyles.layout.gap,
        flex: 1,
    },
    items: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: GlobalStyles.layout.gap,
        flex: 1,
    },
    subheader: {
        ...GlobalStyles.typography.body,
    },
    categoryContainer: {
        gap: 10,
    },
    tagsContainer: {
        flexDirection: 'row',
        gap: 10,
    },
});
