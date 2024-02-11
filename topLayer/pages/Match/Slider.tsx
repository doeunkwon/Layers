import React, { type ReactElement, useCallback, useRef } from 'react';
import { Animated, StyleSheet, View, type ViewToken } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { type UserClothing } from '../../types/Clothing';
import ItemCell from '../../components/Cell/ItemCell';
import { screenWidth } from '../../utils/modalMaxShow';
import { ITEM_SIZE } from '../../utils/GapCalc';
import GlobalStyles from '../../constants/GlobalStyles';
import Icon from 'react-native-remix-icon';
import { emptyClothing } from '../../constants/Clothing';

const SNAP_ITEM_SIZE = ITEM_SIZE() * 1.15;
const HORIZONTAL_SPACING = ITEM_SIZE() * 0.15; // Cell gap
const VERTICAL_SPACING = SNAP_ITEM_SIZE + HORIZONTAL_SPACING;
const EMPTY_ITEM_SIZE = (screenWidth - ITEM_SIZE()) / 2;

interface SliderPropsType {
	data: Array<UserClothing | Record<string, number>> | null;
	selectedIndex: (category: string, index: number) => void;
	category: string;
}

const Slider = ({
	data,
	selectedIndex,
	category,
}: SliderPropsType): ReactElement => {
	const emptyItem: UserClothing = { ...emptyClothing };

	const scrollX = useRef(new Animated.Value(0)).current;

	const currentIndex = useRef<number>(0);
	const flatListRef =
		useRef<FlatList<UserClothing | Record<string, number>>>(null);

	const handleOnViewableItemsChanged = useCallback(
		({ viewableItems }: { viewableItems: ViewToken[] }) => {
			const itemsInView = viewableItems.filter(
				({ item }: { item: UserClothing }) =>
					(item.image_url !== null &&
						item.image_url !== undefined &&
						item.image_url !== '' &&
						item.category !== null &&
						item.category !== undefined &&
						item.category !== '') ||
					item.ciid === ''
			);

			if (itemsInView.length === 0) {
				return;
			}

			if (itemsInView[0].index !== null) {
				currentIndex.current = itemsInView[0].index;
			}

			const rawItemIndex = currentIndex.current - 1;

			selectedIndex(category, rawItemIndex);
		},
		[]
	);

	const getItemLayout = (
		_unused:
			| ArrayLike<UserClothing | Record<string, number>>
			| null
			| undefined,
		index: number
	): { length: number; offset: number; index: number } => ({
		length: SNAP_ITEM_SIZE,
		offset: SNAP_ITEM_SIZE * (index - 1),
		index,
	});

	return (
		<View>
			<FlatList
				ref={flatListRef}
				data={
					data !== null && data !== undefined
						? [
								...data.slice(0, data.length - 1),
								emptyItem,
								...data.slice(data.length - 1, data.length),
							]
						: null
				}
				renderItem={({ item, index }) => {
					if (
						(item.image_url === null ||
							item.image_url === undefined ||
							item.image_url === '' ||
							item.category === null ||
							item.category === undefined ||
							item.category === '') &&
						item.ciid !== ''
					) {
						return <View style={{ width: EMPTY_ITEM_SIZE }} />;
					}

					const inputRange = [
						(index - 2) * SNAP_ITEM_SIZE,
						(index - 1) * SNAP_ITEM_SIZE,
						index * SNAP_ITEM_SIZE,
					];

					const scale = scrollX.interpolate({
						inputRange,
						outputRange: [0.85, 1.15, 0.85], // Scaling of slider
						extrapolate: 'clamp',
					});

					return (
						<View
							style={[
								{
									width: ITEM_SIZE(),
								},
								data !== null &&
									data !== undefined &&
									index !== data?.length - 1 && {
										marginRight: HORIZONTAL_SPACING,
									}, // adds a horizontal spacing to the right of every component EXCEPT for the last oen
							]}
						>
							<Animated.View
								style={[
									{
										transform: [{ scale }],
										backgroundColor:
											item.ciid === ''
												? GlobalStyles.colorPalette.background
												: GlobalStyles.colorPalette.card[200],
									},
									styles.itemContent,
								]}
							>
								{item.ciid !== '' ? (
									<ItemCell imageUrl={`${item.image_url}`} />
								) : (
									<Icon
										name={GlobalStyles.icons.forbidOutline}
										color={GlobalStyles.colorPalette.primary[300]}
										size={GlobalStyles.sizing.icon.xLarge}
									/>
								)}
							</Animated.View>
						</View>
					);
				}}
				getItemLayout={getItemLayout}
				horizontal
				showsHorizontalScrollIndicator={false}
				keyExtractor={(data, index) => {
					if (data?.ciid !== undefined && data?.ciid !== null) {
						return `${data.ciid}`;
					} else {
						return `${index}`;
					}
				}}
				bounces={false}
				decelerationRate={0}
				renderToHardwareTextureAndroid
				contentContainerStyle={styles.flatListContent}
				snapToInterval={SNAP_ITEM_SIZE}
				snapToAlignment="start"
				onScroll={Animated.event(
					[{ nativeEvent: { contentOffset: { x: scrollX } } }],
					{ useNativeDriver: false }
				)}
				scrollEventThrottle={16}
				onViewableItemsChanged={handleOnViewableItemsChanged}
				viewabilityConfig={{
					itemVisiblePercentThreshold: 100,
				}}
			/>
		</View>
	);
};

export default Slider;

const styles = StyleSheet.create({
	flatListContent: {
		height: VERTICAL_SPACING,
		alignItems: 'center',
	},
	itemContent: {
		alignItems: 'center',
		justifyContent: 'center',
		alignContent: 'center',
		width: '100%',
		height: ITEM_SIZE(),
		aspectRatio: 1 / 1,
		borderRadius: GlobalStyles.utils.mediumRadius.borderRadius,
	},
});
