import { View, StyleSheet } from 'react-native';
import React, {
	useEffect,
	useState,
	useContext,
	type ReactElement,
} from 'react';
import StackedTextbox from '../../components/Textbox/StackedTextbox';
import { type UserClothing } from '../../types/Clothing';
import { match as matchHeading } from '../../constants/GlobalStrings';
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
import GlobalStyles from '../../constants/GlobalStyles';
import { EndpointCreateOutfit } from 'endpoints/private/outfit';
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

	const createOutfit = (): void => {
		const clothingItems: string[] = [];
		if (
			match.previewData.outerwear !== null &&
			match.previewData.outerwear !== undefined
		) {
			clothingItems.push(match.previewData.outerwear.ciid);
		}
		if (
			match.previewData.tops !== null &&
			match.previewData.tops !== undefined
		) {
			clothingItems.push(match.previewData.tops.ciid);
		}
		if (
			match.previewData.bottoms !== null &&
			match.previewData.bottoms !== undefined
		) {
			clothingItems.push(match.previewData.bottoms.ciid);
		}
		if (
			match.previewData.shoes !== null &&
			match.previewData.shoes !== undefined
		) {
			clothingItems.push(match.previewData.shoes.ciid);
		}

		const input = {
			title: match.matchName,
			clothing_items: clothingItems,
		};
		const successFunc = (): void => {
			navigation.goBack();
			setShouldRefreshMainPage(true);
		};

		setIsLoading(true); // Start loading
		void EndpointCreateOutfit(input, successFunc).finally(() => {
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
					createOutfit();
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
