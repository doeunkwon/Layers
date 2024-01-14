import { StyleSheet, Text, View } from 'react-native';
import React, { type ReactElement } from 'react';
import ItemCell from '../../components/Cell/ItemCell';
import GlobalStyles from '../../constants/GlobalStyles';
import { FlatList } from 'react-native-gesture-handler';
import ColorTagsList from '../../components/ColorManager/ColorTagsList';
import { StepOverTypes, TagAction } from '../../constants/Enums';
import { screenHeight } from '../../utils/modalMaxShow';
import { type UserClothing } from '../../types/Clothing';
import Header from '../../components/Header/Header';

interface OutfitViewPropsType {
	title: string;
	clothingItems: UserClothing[];
	directToOutfitEdit?: () => void;
}

const OutfitView = ({
	title,
	clothingItems,
	directToOutfitEdit,
}: OutfitViewPropsType): ReactElement => {
	const allColors = clothingItems.flatMap((item) => item.color);
	const uniqueColors = Array.from(new Set(allColors));

	return (
		<View style={styles.container}>
			<Header
				text={title}
				rightButton={
					directToOutfitEdit !== null && directToOutfitEdit !== undefined
				}
				rightStepOverType={StepOverTypes.edit}
				rightButtonAction={directToOutfitEdit}
			/>
			<FlatList
				data={clothingItems.slice(1)}
				numColumns={2}
				renderItem={({ item }) => {
					return (
						<View style={{ flex: 1 / 2 }}>
							<ItemCell imageUrl={item.image_url} />
						</View>
					);
				}}
				keyExtractor={(item) => {
					return item.ciid;
				}}
				style={styles.content}
				showsVerticalScrollIndicator={false}
				ListHeaderComponent={
					clothingItems.length > 0 ? (
						<ItemCell imageUrl={clothingItems[0].image_url} />
					) : null
				}
				contentContainerStyle={{ gap: GlobalStyles.layout.gap }}
				columnWrapperStyle={{ gap: GlobalStyles.layout.gap }}
				ListFooterComponent={
					<View style={{ gap: 20 }}>
						<View style={[styles.categoryContainer, { top: 4 }]}>
							{uniqueColors.length > 0 ? (
								<Text style={styles.subheader}>Colors</Text>
							) : null}
							<ColorTagsList data={uniqueColors} tagAction={TagAction.static} />
						</View>
						{/* !!! Very hacky solution, try to fix this */}
						<View style={{ padding: screenHeight * 0.05 }} />
					</View>
				}
			/>
		</View>
	);
};

export default OutfitView;

const styles = StyleSheet.create({
	container: {
		paddingTop: 20,
		gap: GlobalStyles.layout.gap,
		flex: 1,
	},
	content: {
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
