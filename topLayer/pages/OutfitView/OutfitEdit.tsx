import { View, StyleSheet, Pressable, Alert } from 'react-native';
import React, { useState, useContext, type ReactElement } from 'react';
import GlobalStyles from '../../constants/GlobalStyles';
import StackedTextbox from '../../components/Textbox/StackedTextbox';
import { outfitEdit, toast } from '../../constants/GlobalStrings';
import Icon from 'react-native-remix-icon';
import { type UserClothing } from '../../types/Clothing';
import { MainPageContext } from '../../pages/Main/MainPage';
import Header from '../../components/Header/Header';
import { StepOverTypes } from '../../constants/Enums';
import { Loading } from '../../components/Loading/Loading';
import {
	showErrorToast,
	showSuccessToast,
} from '../../components/Toasts/Toasts';
import OutfitBlockLayout from '../../components/Outfit/OutfitBlockLayout';
import { endpoint } from '../../endpoints/General/endpoint';

interface OutfitEditPropsType {
	id: string;
	title: string;
	clothingItems: UserClothing[];
	navigateToProfile: () => void;
}

const OutfitEdit = ({
	id,
	title,
	clothingItems,
	navigateToProfile,
}: OutfitEditPropsType): ReactElement => {
	const { setShouldRefreshMainPage } = useContext(MainPageContext);

	const [text, setText] = useState(title);
	const [isLoading, setIsLoading] = useState(false); // Add loading state

	const confirmDeletion = (): void => {
		Alert.alert(outfitEdit.deleteOutfit, outfitEdit.youCannotUndoThisAction, [
			{
				text: outfitEdit.cancel,
				onPress: () => {},
				style: 'cancel',
			},
			{
				text: outfitEdit.delete,
				onPress: () => {
					void handleDelete();
				},
				style: 'destructive',
			},
		]);
	};

	// Only updates title
	const handleUpdate = async (): Promise<void> => {
		const endpointConfig = {
			method: 'put',
			url: `/api/private/outfits/${id}`,
			data: {
				title: text,
			},
		};
		const successFunc = (): void => {
			setShouldRefreshMainPage(true);
			navigateToProfile();
			showSuccessToast(toast.yourOutfitHasBeenUpdated);
		};
		const failureFunc = (): void => {
			showErrorToast(toast.anErrorHasOccurredWhileUpdatingOutfit);
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
			url: `/api/private/outfits/${id}`,
		};
		const successFunc = (): void => {
			setShouldRefreshMainPage(true);
			navigateToProfile();
			showSuccessToast(toast.yourOutfitHasBeenDeleted);
		};
		const failureFunc = (): void => {
			showErrorToast(toast.anErrorHasOccurredWhileDeletingOutfit);
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
				rightButtonAction={handleUpdate}
			/>
			<View style={styles.editContainer}>
				<StackedTextbox
					label={outfitEdit.outfitName}
					onFieldChange={(text: string) => {
						setText(text);
					}}
					value={text}
				/>
				<OutfitBlockLayout data={clothingItems} />
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
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		gap: 15,
		paddingTop: 20,
	},
	editContainer: {
		marginHorizontal: GlobalStyles.layout.xGap, // Gives extra room for the item cell delete button to render
		gap: GlobalStyles.layout.gap,
		flex: 1,
	},
	deleteButtonContainer: {
		position: 'absolute',
		bottom: GlobalStyles.layout.gap * 2.5,
		alignSelf: 'center',
	},
});

export default OutfitEdit;
