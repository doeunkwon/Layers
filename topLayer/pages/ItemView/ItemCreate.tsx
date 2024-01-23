import axios from 'axios';
import { baseUrl } from '../../utils/apiUtils';
import { View, StyleSheet, Alert } from 'react-native';
import React, {
	useState,
	useEffect,
	useContext,
	type ReactElement,
} from 'react';
import { StepOverTypes, StackNavigation } from '../../constants/Enums';
import {
	type creationClothingTypes,
	type UserClothing,
} from '../../types/Clothing';
import { useForm } from 'react-hook-form';
import Header from '../../components/Header/Header';
import { MainPageContext } from '../../pages/Main/MainPage';
import { toast } from '../../constants/GlobalStrings';
import { Loading } from '../../components/Loading/Loading';
import { axiosEndpointErrorHandler } from '../../utils/ErrorHandlers';
import {
	showErrorToast,
	showSuccessToast,
} from '../../components/Toasts/Toasts';
import ItemFields from '../../components/Item/ItemFields';
import {
	type RouteProp,
	useNavigation,
	useRoute,
} from '@react-navigation/native';
import { type StackNavigationProp } from '@react-navigation/stack';
import { type StackTypes } from '../../utils/StackNavigation';
import { type RouteTypes } from 'types/Routes';

const ItemCreate = (): ReactElement => {
	const { setShouldRefreshMainPage } = useContext(MainPageContext);

	const route = useRoute<RouteProp<RouteTypes, 'ItemCreate'>>();
	const { item } = route.params;

	const navigation = useNavigation<StackNavigationProp<StackTypes>>();
	const [isLoading, setIsLoading] = useState(false);

	const { control, handleSubmit, setValue } = useForm({
		defaultValues: {
			image: item.image_url,
			category: item.category,
			title: item.title,
			size: item.size,
			color: item.color,
		},
	});

	useEffect(() => {
		setValue('image', item.image_url);
	}, [item.image_url]);

	const handleCreate = async (values: creationClothingTypes): Promise<void> => {
		if (values.category === '') {
			Alert.alert('Category Value Not Filled Out.');
			return;
		}
		if (values.image === '') {
			Alert.alert('Image Value Not Filled Out.');
			return;
		}
		setIsLoading(true); // Start loading
		try {
			const { status } = await axios.post(
				`${baseUrl}/api/private/clothing_items`,
				values
			);

			if (status === 200) {
				setShouldRefreshMainPage(true);
				navigation.navigate(StackNavigation.Profile, {});
				showSuccessToast(toast.yourItemHasBeenCreated);
			} else {
				showErrorToast(toast.anErrorHasOccurredWhileCreatingItem);
			}
			setIsLoading(false); // Stop loading on success
		} catch (error) {
			setIsLoading(false); // Stop loading on error
			axiosEndpointErrorHandler(error);
		}
	};

	return (
		<View style={styles.container}>
			<Header
				text={'Create'}
				leftBack={true}
				leftButton={true}
				rightButton={true}
				rightStepOverType={StepOverTypes.done}
				rightButtonAction={handleSubmit(handleCreate)}
			/>
			<ItemFields control={control} setValue={setValue} clothingItem={item} />
			{isLoading ? <Loading /> : null}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
		flex: 1,
		gap: 15,
		paddingTop: 20,
	},
});

export default ItemCreate;
