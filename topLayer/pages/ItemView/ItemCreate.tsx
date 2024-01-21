import { View, StyleSheet, Alert } from 'react-native';
import React, {
	useState,
	useEffect,
	useContext,
	type ReactElement,
} from 'react';
import { StepOverTypes } from '../../constants/Enums';
import {
	type creationClothingTypes,
	type UserClothing,
} from '../../types/Clothing';
import { useForm } from 'react-hook-form';
import Header from '../../components/Header/Header';
import { MainPageContext } from '../../pages/Main/MainPage';
import { toast } from '../../constants/GlobalStrings';
import { Loading } from '../../components/Loading/Loading';
import {
	showErrorToast,
	showSuccessToast,
} from '../../components/Toasts/Toasts';
import ItemFields from '../../components/Item/ItemFields';
import { endpoint } from '../../endpoints/General/endpoint';

interface ItemCreatePropsType {
	clothingItem: UserClothing;
	navigateToProfile: () => void;
}

const ItemCreate = ({
	clothingItem,
	navigateToProfile,
}: ItemCreatePropsType): ReactElement => {
	const { setShouldRefreshMainPage } = useContext(MainPageContext);

	const [isLoading, setIsLoading] = useState(false);

	const { control, handleSubmit, setValue } = useForm({
		defaultValues: {
			image: clothingItem.image_url,
			category: clothingItem.category,
			title: clothingItem.title,
			size: clothingItem.size,
			color: clothingItem.color,
		},
	});

	useEffect(() => {
		setValue('image', clothingItem.image_url);
	}, [clothingItem.image_url]);

	const handleCreate = async (values: creationClothingTypes): Promise<void> => {
		if (values.category === '') {
			Alert.alert('Category Value Not Filled Out.');
			return;
		}
		if (values.image === '') {
			Alert.alert('Image Value Not Filled Out.');
			return;
		}

		const endpointConfig = {
			method: 'post',
			url: '/api/private/clothing_items',
		};
		const successFunc = (): void => {
			setShouldRefreshMainPage(true);
			navigateToProfile();
			showSuccessToast(toast.yourItemHasBeenCreated);
		};
		const failureFunc = (): void => {
			showErrorToast(toast.anErrorHasOccurredWhileCreatingItem);
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
				text={'Create'}
				leftBack={true}
				leftButton={true}
				rightButton={true}
				rightStepOverType={StepOverTypes.done}
				rightButtonAction={handleSubmit(handleCreate)}
			/>
			<ItemFields
				control={control}
				setValue={setValue}
				clothingItem={clothingItem}
			/>
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
