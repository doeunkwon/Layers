import { View, StyleSheet } from 'react-native';
import React, {
	useEffect,
	useState,
	useContext,
	type ReactElement,
} from 'react';
import StackedTextbox from '../../components/Textbox/StackedTextbox';
import { type UserClothing } from '../../types/Clothing';
import { toast, match as matchHeading } from '../../constants/GlobalStrings';
import {
	showErrorToast,
	showSuccessToast,
} from '../../components/Toasts/Toasts';
import {
	type RouteProp,
	useNavigation,
	useRoute,
} from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { type StackTypes } from '../../utils/StackNavigation';
import { Loading } from '../../components/Loading/Loading';
import { StackNavigation, StepOverTypes } from '../../constants/Enums';
import Header from '../../components/Header/Header';
import { emptyClothing } from '../../constants/Clothing';
import { MainPageContext } from '../../pages/Main/MainPage';
import { type RouteTypes } from '../../types/Routes';
import OutfitBlockLayout from '../../components/Outfit/OutfitBlockLayout';
import { endpoint } from '../../endpoints/General/endpoint';
import GlobalStyles from '../../constants/GlobalStyles';

const OutfitPreview = (): ReactElement => {
	const { setShouldRefreshMainPage } = useContext(MainPageContext);

	const route = useRoute<RouteProp<RouteTypes, 'OutfitPreview'>>();
	const navigation = useNavigation<NativeStackNavigationProp<StackTypes>>();

	const { matchItems } = route.params;

	const [text, setText] = useState('');
	const [isLoading, setIsLoading] = useState(false); // Add loading state
	const [rawData, setRawData] = useState<UserClothing[]>([]);
	const [data, setData] = useState<UserClothing[]>([]);
	const onInputChange = (text: string): void => {
		setText(text);
	};
	const [match, setMatch] = useState({
		previewData: {
			outerwear: { ...emptyClothing },
			tops: { ...emptyClothing },
			bottoms: { ...emptyClothing },
			shoes: { ...emptyClothing },
		},
		matchName: '',
	});

	useEffect(() => {
		setRawData([
			matchItems.outerwear,
			matchItems.tops,
			matchItems.bottoms,
			matchItems.shoes,
		]);
		setMatch({
			previewData: matchItems,
			matchName: text,
		});
	}, [
		matchItems.outerwear,
		matchItems.tops,
		matchItems.bottoms,
		matchItems.shoes,
		text,
	]);

	useEffect(() => {
		setData(rawData.filter(Boolean));
	}, [rawData]);

	const onSubmit = (): void => {
		const clothingItems = [
			match.previewData.outerwear !== null &&
			match.previewData.outerwear !== undefined
				? match.previewData.outerwear.ciid
				: null,
			match.previewData.tops !== null && match.previewData.tops !== undefined
				? match.previewData.tops.ciid
				: null,
			match.previewData.bottoms !== null &&
			match.previewData.bottoms !== undefined
				? match.previewData.bottoms.ciid
				: null,
			match.previewData.shoes !== null && match.previewData.shoes !== undefined
				? match.previewData.shoes.ciid
				: null,
		].filter((item) => item !== null);

		const endpointConfig = {
			method: 'post',
			url: '/api/private/outfits',
			data: {
				title: match.matchName,
				clothing_items: clothingItems,
			},
		};
		const successFunc = (): void => {
			navigation.goBack();
			setShouldRefreshMainPage(true);
			showSuccessToast(toast.yourOutfitHasBeenCreated);
		};
		const failureFunc = (): void => {
			showErrorToast(toast.anErrorHasOccurredWhileCreatingOutfit);
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
				text={StackNavigation.OutfitPreview}
				rightButton={true}
				rightStepOverType={StepOverTypes.done}
				rightButtonAction={() => {
					onSubmit();
				}}
			/>
			<View style={styles.containerInner}>
				<StackedTextbox
					label={matchHeading.matchName}
					onFieldChange={onInputChange}
					value={text}
				/>
				<OutfitBlockLayout data={data} />

				{isLoading ? <Loading /> : null}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	containerInner: {
		marginHorizontal: GlobalStyles.layout.xGap,
		gap: GlobalStyles.layout.gap,
	},
	container: {
		gap: GlobalStyles.layout.gap,
		paddingTop: 20,
	},
});

export default OutfitPreview;
