import { View, StyleSheet, Pressable, Alert } from 'react-native';
import React, { useState, useContext, type ReactElement } from 'react';
import { StepOverTypes } from '../../constants/Enums';
import GlobalStyles from '../../constants/GlobalStyles';
import {
	type editableClothingTypes,
	type UserClothing,
} from '../../types/Clothing';
import { useForm } from 'react-hook-form';
import Icon from 'react-native-remix-icon';
import Header from '../../components/Header/Header';
import { MainPageContext } from '../../pages/Main/MainPage';
import { toast, itemEdit } from '../../constants/GlobalStrings';
import { Loading } from '../../components/Loading/Loading';
import {
	showErrorToast,
	showSuccessToast,
} from '../../components/Toasts/Toasts';
import { areArraysEqual } from '../../functions/General/array';
import ItemFields from '../../components/Item/ItemFields';
import { endpoint } from '../../endpoints/General/endpoint';

interface ItemEditPropsType {
	clothingItem: UserClothing;
	navigateToProfile: () => void;
}

const ItemEdit = ({
	clothingItem,
	navigateToProfile,
}: ItemEditPropsType): ReactElement => {
	const { setShouldRefreshMainPage } = useContext(MainPageContext);

	const [isLoading, setIsLoading] = useState(false);

	const { control, handleSubmit, setValue } = useForm({
		defaultValues: {
			image: '',
			category: clothingItem.category,
			title: clothingItem.title,
			size: clothingItem.size,
			color: clothingItem.color,
		},
	});

	const confirmDeletion = (): void => {
		Alert.alert(itemEdit.deleteItem, itemEdit.youCannotUndoThisAction, [
			{
				text: itemEdit.cancel,
				onPress: () => {},
				style: 'cancel',
			},
			{
				text: itemEdit.delete,
				onPress: () => {
					void handleDelete();
				},
				style: 'destructive',
			},
		]);
	};

	const handleUpdate = async (values: editableClothingTypes): Promise<void> => {
		const dataToUpdate: Partial<editableClothingTypes> = {};

		// Add fields to dataToUpdate only if they have been set
		if (values.category !== clothingItem.category) {
			dataToUpdate.category = values.category;
		}
		if (values.title !== clothingItem.title) {
			dataToUpdate.title = values.title;
		}
		if (values.size !== clothingItem.size) {
			dataToUpdate.size = values.size;
		}
		if (!areArraysEqual(values.color, clothingItem.color)) {
			dataToUpdate.color = values.color;
		}

		if (Object.keys(dataToUpdate).length === 0) {
			return;
		}

		const endpointConfig = {
			method: 'put',
			url: `/api/private/clothing_items/${clothingItem.ciid}`,
			data: dataToUpdate,
		};
		const successFunc = (): void => {
			setShouldRefreshMainPage(true);
			navigateToProfile();
			showSuccessToast(toast.yourItemHasBeenUpdated);
		};
		const failureFunc = (): void => {
			showErrorToast(toast.anErrorHasOccurredWhileUpdatingItem);
		};

		setIsLoading(true); // Start loading
		void endpoint({
			config: endpointConfig,
			successFunc: successFunc,
			failureFunc: failureFunc,
			alert: true,
		}).finally(() => {
			setIsLoading(false);
		});
	};

	const handleDelete = async (): Promise<void> => {
		const endpointConfig = {
			method: 'delete',
			url: `/api/private/clothing_items/${clothingItem.ciid}`,
		};
		const successFunc = (): void => {
			setShouldRefreshMainPage(true);
			navigateToProfile();
			showSuccessToast(toast.yourItemHasBeenUpdated);
		};
		const failureFunc = (): void => {
			showErrorToast(toast.anErrorHasOccurredWhileDeletingItem);
		};

		setIsLoading(true); // Start loading
		void endpoint({
			config: endpointConfig,
			successFunc: successFunc,
			failureFunc: failureFunc,
			alert: true,
		}).finally(() => {
			setIsLoading(false);
		});
	};

	return (
		<View style={styles.container}>
			<Header
				text={'Edit'}
				leftBack={true}
				leftButton={true}
				rightButton={true}
				rightStepOverType={StepOverTypes.done}
				rightButtonAction={handleSubmit(handleUpdate)}
			/>
			<ItemFields
				control={control}
				setValue={setValue}
				clothingItem={clothingItem}
			/>
			<View style={styles.deleteButtonContainer}>
				<Pressable onPress={confirmDeletion}>
					<View style={GlobalStyles.utils.deleteButton}>
						<Icon
							name={GlobalStyles.icons.closeOutline}
							color={GlobalStyles.colorPalette.background}
							size={GlobalStyles.sizing.icon.regular}
						/>
					</View>
				</Pressable>
			</View>

			{isLoading ? <Loading /> : null}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		gap: GlobalStyles.layout.gap,
		paddingTop: 20,
	},
	deleteButtonContainer: {
		position: 'absolute',
		bottom: GlobalStyles.layout.gap * 2.5,
		alignSelf: 'center',
	},
});

export default ItemEdit;
