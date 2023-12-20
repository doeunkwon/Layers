import { View, StyleSheet, Pressable, Alert, ActivityIndicator } from 'react-native';
import React, {
	useEffect,
	useState,
	useContext,
	MutableRefObject,
} from 'react';
import { FlatList } from 'react-native-gesture-handler';

import ItemCell from '../../components/Cell/ItemCell';
import GlobalStyles from '../../constants/GlobalStyles';
import StackedTextbox from '../../components/Textbox/StackedTextbox';

import { ITEM_SIZE } from '../../utils/GapCalc';
import { screenHeight } from '../../utils/modalMaxShow';
import { type UserOutfit } from '.';
import { outfitEdit } from '../../constants/GlobalStrings';

import Icon from 'react-native-remix-icon';
import { UserClothing } from '../../pages/Match';

import { baseUrl } from '../../utils/apiUtils';
import axios from 'axios';
import { axiosEndpointErrorHandler } from '../../utils/ErrorHandlers';
import { MainPageContext } from '../../pages/Main/MainPage';

import Toast from 'react-native-toast-message';
import { toast } from '../../constants/GlobalStrings'

// type OutfitPreviewPropsType = {
//     outerwear: UserOutfit,
//     tops: UserOutfit,
//     bottoms: UserOutfit,
//     shoes: UserOutfit,
//     matchName: (text: string) => void;
// }

interface OutfitViewPropsType {
	id: string;
	title: string;
	clothingItems: UserClothing[];
	titleRef: MutableRefObject<string>;
	navigateToProfile: () => void;
}

const OutfitEdit = ({
	id,
	title,
	clothingItems,
	titleRef,
	navigateToProfile,
}: OutfitViewPropsType) => {
	const { setShouldRefreshOutfitEdit } = useContext(MainPageContext);

	const [text, setText] = useState(title);
	const [rawData, setRawData] = useState<UserOutfit[]>([]);
	const [outfitData, setOutfitData] = useState<UserOutfit[]>([]);
	const [isLoading, setIsLoading] = useState(false); // Add loading state

	const onInputChange = (text: string) => {
		setText(text);
		titleRef.current = text;
		// setTitle(text)
		// matchName(text);
	};

	// useEffect(() => {
	// 	setRawData([outerwear, tops, bottoms, shoes])
	// }, [outerwear, tops, bottoms, shoes])

	useEffect(() => {
		setOutfitData(rawData.filter(Boolean));
	}, [rawData]);

	const handleDelete = async () => {
		setIsLoading(true); // Start loading
		try {
			const response = await axios.delete(
				`${baseUrl}/api/private/outfits/${id}`
			);

			if (response.status === 200) {
				//alert(`You have deleted: ${JSON.stringify(response.data)}`);
				setShouldRefreshOutfitEdit(true);
				navigateToProfile();
				showSuccessDeleteToast()
			} else {
				showErrorDeleteToast()
				// throw new Error('An error has occurred while deleting outfit');
			}
			setIsLoading(false); // Stop loading on success
		} catch (error) {
			setIsLoading(false); // Stop loading on error
			void axiosEndpointErrorHandler(error);
			alert(error);
		}
	};

	const showSuccessDeleteToast = () => {
		Toast.show({
			type: 'success',
			text1: toast.success,
			text2: toast.yourOutfitHasBeenDeleted,
			topOffset: GlobalStyles.layout.toastTopOffset
		});
	}

	const showErrorDeleteToast = () => {
		Toast.show({
			type: 'error',
			text1: toast.error,
			text2: toast.anErrorHasOccurredWhilDeletingOutfit,
			topOffset: GlobalStyles.layout.toastTopOffset
		});
	}

	const confirmDeletion = () => {
		Alert.alert(
			outfitEdit.deleteOutfit,
			outfitEdit.youCannotUndoThisAction,
			[
				{
					text: outfitEdit.cancel,
					onPress: () => { }
				},
				{
					text: outfitEdit.delete,
					onPress: handleDelete,
					style: 'destructive'
				}
			]
		)
	}

	return (
		<View style={styles.container}>
			<StackedTextbox
				label={outfitEdit.outfitName}
				onFieldChange={onInputChange}
				value={title ? title : text}
			/>
			<FlatList
				data={clothingItems}
				renderItem={({ item }) => {
					return (
						<View style={{ width: ITEM_SIZE(2) }}>
							<ItemCell
								imageUrl={item.image_url}
								disablePress={false}
								key={item.ciid}
							/>
						</View>
					);
				}}
				numColumns={2}
				contentContainerStyle={{ gap: GlobalStyles.layout.gap }}
				columnWrapperStyle={{ gap: GlobalStyles.layout.gap }}
				style={{ height: screenHeight - 350, padding: 6 }}
			/>
			<View style={styles.deleteButtonContainer}>
				<Pressable onPress={confirmDeletion}>
					<View style={styles.deleteButton}>
						<Icon
							name={GlobalStyles.icons.closeOutline}
							color={GlobalStyles.colorPalette.primary[300]}
							size={GlobalStyles.sizing.icon.regular}
						/>
					</View>
				</Pressable>
			</View>

			{isLoading && (
				<View style={styles.overlay}>
					<ActivityIndicator size='large' color={GlobalStyles.colorPalette.activityIndicator} />
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginHorizontal: GlobalStyles.layout.xGap - 6, // Gives extra room for the item cell delete button to render
		gap: GlobalStyles.layout.gap,
		flex: 1,
	},
	deleteButtonContainer: {
		position: 'absolute',
		bottom: GlobalStyles.layout.gap * 2.5,
		alignSelf: 'center',
	},
	deleteButton: {
		width: 40,
		height: 40,
		...GlobalStyles.utils.fullRadius,
		backgroundColor: GlobalStyles.colorPalette.primary[200],
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: GlobalStyles.colorPalette.primary[300],
		...GlobalStyles.utils.deleteShadow,
	},
	overlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: 'transparent', // Set to transparent
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export default OutfitEdit;
