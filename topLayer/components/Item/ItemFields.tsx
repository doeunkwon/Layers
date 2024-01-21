import React, { useState, type ReactElement, useRef } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { View } from 'react-native';
import GlobalStyles from '../../constants/GlobalStyles';
import {
	Controller,
	type Control,
	type UseFormSetValue,
} from 'react-hook-form';
import { userFieldRules } from '../../constants/userConstraints';
import Dropdown from '../../components/Dropdown/Dropdown';
import { itemEdit } from '../../constants/GlobalStrings';
import StackedTextBox from '../../components/Textbox/StackedTextbox';
import ItemCell from '../../components/Cell/ItemCell';
import ColorTagsList from '../../components/ColorManager/ColorTagsList';
import { ITEM_SIZE } from '../../utils/GapCalc';
import ColorPicker from '../../components/ColorManager/ColorPicker';
import GeneralModal, {
	type refPropType,
} from '../../components/Modal/GeneralModal';
import {
	handleOnColorRemovePress,
	handleOnNewColorPress,
} from '../../functions/Item/Item';
import { setClothingTypeSize } from '../../functions/ClothingItem/Sizes';
import { clothingItemTypes } from '../../constants/Clothing';
import { modalLowTranslateY } from '../../utils/modalMaxShow';
import { TagAction } from '../../constants/Enums';
import {
	type creationClothingTypes,
	type UserClothing,
} from '../../types/Clothing';

interface ItemFieldProps {
	control: Control<creationClothingTypes>;
	setValue: UseFormSetValue<creationClothingTypes>;
	clothingItem: UserClothing;
}

const ItemFields = ({
	control,
	setValue,
	clothingItem,
}: ItemFieldProps): ReactElement => {
	const colorPickerRef = useRef<refPropType>(null);
	const [currentColorTags, setColorTags] = useState(clothingItem.color);
	const [sizeOpen, setSizeOpen] = useState(false);
	const [sizeValue, setSizeValue] = useState(clothingItem.size ?? '');
	const [sizeOptions, setSizeOptions] = useState(
		setClothingTypeSize(clothingItem.category)
	);
	const [itemTypeOpen, setItemTypeOpen] = useState(false);
	const [itemTypeValue, setItemTypeValue] = useState(
		clothingItem.category ?? ''
	);

	return (
		<>
			<ScrollView
				contentContainerStyle={GlobalStyles.sizing.bottomSpacingPadding}
			>
				<View
					style={{
						marginHorizontal: GlobalStyles.layout.xGap,
						gap: GlobalStyles.layout.gap,
					}}
				>
					<Controller
						control={control}
						rules={userFieldRules.title}
						render={({ field: { onChange, value } }) => (
							<StackedTextBox
								label={itemEdit.itemName}
								onFieldChange={onChange}
								value={value.trim()}
							/>
						)}
						name="title"
					/>
					<ItemCell
						imageUrl={clothingItem.image_url}
						base64={clothingItem.image_url.slice(0, 5) !== 'https'}
					/>
					<View
						style={{ flexDirection: 'row', justifyContent: 'space-between' }}
					>
						<View style={{ width: ITEM_SIZE(2) }}>
							<Dropdown
								label="Category"
								open={itemTypeOpen}
								setOpen={setItemTypeOpen}
								setValue={(value) => {
									setItemTypeValue(value);
								}}
								onChangeValue={(value: string | null) => {
									if (value !== null) {
										setSizeOptions(setClothingTypeSize(value));
										setValue('category', value);
									}
								}}
								items={clothingItemTypes}
								value={itemTypeValue}
							/>
						</View>
						<View style={{ width: ITEM_SIZE(2) }}>
							<Dropdown
								label="Size"
								open={sizeOpen}
								setOpen={setSizeOpen}
								setValue={(value) => {
									setSizeValue(value);
								}}
								onChangeValue={(value) => {
									if (value !== null) {
										setValue('size', value);
									}
								}}
								items={sizeOptions}
								value={sizeValue}
							/>
						</View>
					</View>
					<ColorTagsList
						data={currentColorTags}
						tagAction={TagAction.remove}
						onAddPress={() => {
							colorPickerRef.current?.scrollTo(modalLowTranslateY);
						}}
						onRemovePress={(colorToDelete: string) => {
							handleOnColorRemovePress(
								currentColorTags,
								colorToDelete,
								setColorTags,
								setValue
							);
						}}
					/>
				</View>
			</ScrollView>
			<GeneralModal
				ref={colorPickerRef}
				height={modalLowTranslateY}
				content={
					<ColorPicker
						onNewColorPress={(colorToAdd: string) => {
							handleOnNewColorPress(
								currentColorTags,
								colorToAdd,
								colorPickerRef,
								setColorTags,
								setValue
							);
						}}
					/>
				}
				dim={false}
			/>
		</>
	);
};

export default ItemFields;
