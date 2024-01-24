import { View, StyleSheet, Pressable, Alert } from 'react-native';
import React, { useState, useContext, type ReactElement } from 'react';
import GlobalStyles from '../../constants/GlobalStyles';
import StackedTextbox from '../../components/Textbox/StackedTextbox';
import { outfitEdit } from '../../constants/GlobalStrings';
import Icon from 'react-native-remix-icon';
import { type UserClothing } from '../../types/Clothing';
import { MainPageContext } from '../../pages/Main/MainPage';
import Header from '../../components/Header/Header';
import { StepOverTypes } from '../../constants/Enums';
import { Loading } from '../../components/Loading/Loading';
import OutfitBlockLayout from '../../components/Outfit/OutfitBlockLayout';
import {
	EndpointDeleteOutfit,
	EndpointUpdateOutfit,
} from 'endpoints/private/outfit';

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
					void deleteOutfit();
				},
				style: 'destructive',
			},
		]);
	};

	// Only updates title
	const updateOutfit = async (): Promise<void> => {
		const input = {
			title: text,
		};
		const successFunc = (): void => {
			setShouldRefreshMainPage(true);
			navigateToProfile();
		};

		setIsLoading(true); // Start loading
		void EndpointUpdateOutfit(input, id, successFunc).finally(() => {
			setIsLoading(false);
		});
	};

	const deleteOutfit = async (): Promise<void> => {
		const successFunc = (): void => {
			setShouldRefreshMainPage(true);
			navigateToProfile();
		};

		setIsLoading(true); // Start loading
		void EndpointDeleteOutfit(id, successFunc).finally(() => {
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
				rightButtonAction={updateOutfit}
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
