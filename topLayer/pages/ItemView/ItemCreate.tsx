import { View, StyleSheet, Alert } from 'react-native';
import React, {
	useState,
	useEffect,
	useContext,
	type ReactElement,
} from 'react';
import { StepOverTypes, StackNavigation } from '../../constants/Enums';
import { type creationClothingTypes } from '../../types/Clothing';
import { useForm } from 'react-hook-form';
import Header from '../../components/Header/Header';
import { MainPageContext } from '../../pages/Main/MainPage';
import { Loading } from '../../components/Loading/Loading';
import ItemFields from '../../components/Item/ItemFields';
import {
	type RouteProp,
	useNavigation,
	useRoute,
} from '@react-navigation/native';
import { type StackNavigationProp } from '@react-navigation/stack';
import { type StackTypes } from '../../utils/StackNavigation';
import { type RouteTypes } from '../../types/Routes';
import GlobalStyles from '../../constants/GlobalStyles';
import { EndpointCreateItem } from 'endpoints/private/clothingItem';
import { SafeAreaView } from 'react-native-safe-area-context';

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

	const CreateItem = async (values: creationClothingTypes): Promise<void> => {
		if (values.category === '') {
			Alert.alert('Category Value Not Filled Out.');
			return;
		}
		if (values.image === '') {
			Alert.alert('Image Value Not Filled Out.');
			return;
		}

		const successFunc = (): void => {
			setShouldRefreshMainPage(true);
			navigation.navigate(StackNavigation.Profile, {});
		};

		setIsLoading(true); // Start loading
		void EndpointCreateItem(values, successFunc).finally(() => {
			setIsLoading(false);
		});
	};

	return (
		<SafeAreaView style={styles.container}>
			<Header
				text={'Create'}
				leftBack={true}
				leftButton={true}
				rightButton={true}
				rightStepOverType={StepOverTypes.done}
				rightButtonAction={handleSubmit(CreateItem)}
			/>
			<ItemFields control={control} setValue={setValue} clothingItem={item} />
			{isLoading ? <Loading /> : null}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: GlobalStyles.colorPalette.background,
		flex: 1,
		gap: 15,
		paddingTop: 20,
	},
});

export default ItemCreate;
