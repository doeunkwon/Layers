import { StyleSheet, View } from 'react-native';
import React, {
	type Dispatch,
	type SetStateAction,
	createContext,
	useRef,
	useEffect,
	useState,
} from 'react';
import PagerView from 'react-native-pager-view';
import ProfilePage from '../Profile/ProfilePage';
import MatchPage from '../Match/MatchPage';
import FindPage from '../Find/FindPage';
import { type UserOutfit } from '../../types/Outfit';
import { type UserClothing } from '../../types/Clothing';
import { getAllClothingItems, getAllOutfits } from '../../endpoints/wardrobe';
import { type UserAllItems } from '../../types/AllItems';
import { allUserItems } from '../../functions/Profile/Profile';

export const MainPageContext = createContext({
	navigationArray: [() => {}],
	allItems: [] as UserAllItems[],
	setShouldRefreshMainPage: (() => {}) as Dispatch<SetStateAction<boolean>>,
});

const MainPage: React.FC = () => {
	const [shouldRefreshMainPage, setShouldRefreshMainPage] = useState(true);
	const [allOutfits, setAllOutfits] = useState<UserOutfit[]>([]);
	const [allOuterwear, setAllOuterwear] = useState<UserClothing[]>([]);
	const [allTops, setAllTops] = useState<UserClothing[]>([]);
	const [allBottoms, setAllBottoms] = useState<UserClothing[]>([]);
	const [allShoes, setAllShoes] = useState<UserClothing[]>([]);

	// initializes an array of clothing categories and their data
	const allItems: UserAllItems[] = allUserItems(
		allOutfits,
		allOuterwear,
		allTops,
		allBottoms,
		allShoes
	);

	// fetched all the outfits and clothings
	useEffect(() => {
		if (shouldRefreshMainPage) {
			void getAllOutfits(setAllOutfits);
			void getAllClothingItems(
				setAllOuterwear,
				setAllTops,
				setAllBottoms,
				setAllShoes
			);
		}
		if (shouldRefreshMainPage) {
			setShouldRefreshMainPage(false);
		}
	}, [shouldRefreshMainPage]);

	const ref = useRef<PagerView>(null);
	const navigateToMatch = (): void => {
		ref.current?.setPage(0);
	};
	const navigateToProfile = (): void => {
		ref.current?.setPage(1);
	};
	const navigateToFind = (): void => {
		ref.current?.setPage(2);
	};

	return (
		<MainPageContext.Provider
			value={{
				navigationArray: [navigateToProfile, navigateToMatch, navigateToFind],
				allItems: allItems,
				setShouldRefreshMainPage: setShouldRefreshMainPage,
			}}
		>
			<PagerView style={styles.pager} ref={ref} initialPage={1}>
				<View collapsable={false}>
					<MatchPage />
				</View>
				<View collapsable={false}>
					<ProfilePage />
				</View>
				<View collapsable={false}>
					<FindPage />
				</View>
			</PagerView>
		</MainPageContext.Provider>
	);
};

export default MainPage;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	pager: {
		flex: 1,
		alignSelf: 'stretch',
	},
});
