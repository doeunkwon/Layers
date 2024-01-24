import React, { useState, useRef, type ReactElement } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import ProfileCell from '../../components/Cell/ProfileCell';
import {
	type markedPrivateUser,
	type markedUser,
	type User,
} from '../../types/User';
import SearchBar from './SearchBar';
import GlobalStyles from '../../constants/GlobalStyles';
import { screenHeight } from '../../utils/modalMaxShow';
import { Loading } from '../../components/Loading/Loading';
import { EndpointAllSearch } from 'endpoints/private/search';

interface SearchBarPropsType {
	placeholder: string;
	handleEmptyString?: (changes: Array<string | User>) => void;
	handleNonEmptyString?: () => void;
}

const SearchUsers = ({
	placeholder,
	handleEmptyString,
	handleNonEmptyString,
}: SearchBarPropsType): ReactElement => {
	const [isLoading, setIsLoading] = useState(0); // Add loading state
	const [searchQuery, setSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState<
		Array<markedUser | markedPrivateUser>
	>([]);
	const userRelations = useRef<Array<string | User>>([]);

	// Create an instance of AbortController
	const abortController = useRef(new AbortController());
	const allSearch = async (text: string): Promise<void> => {
		setIsLoading((n) => n + 1);
		const successFunc = (data: Array<markedUser | markedPrivateUser>): void => {
			setSearchResults(data);
			setIsLoading((n) => n + 1);
		};

		void EndpointAllSearch(text, successFunc, abortController.current.signal);
	};

	const handleMarking = (
		uid: string,
		marked: boolean,
		index: number,
		user: markedUser
	): number => {
		if (index !== -1) {
			userRelations.current.splice(index, 1);
			return -1;
		} else {
			// The below is only called to mark a new User, whom is 1 of 3 of the users marked
			if (marked) {
				userRelations.current.push(user as User);
			} else {
				userRelations.current.push(uid);
			}
		}
		return userRelations.current.length - 1;
	};

	const handleSearch = (text: string): void => {
		abortController.current.abort();

		setSearchQuery(text);
		if (text === '') {
			setSearchResults([]);
			setIsLoading(0);
			if (handleEmptyString != null) {
				handleEmptyString(userRelations.current);
			}
			userRelations.current = [];
		} else {
			abortController.current = new AbortController();
			void allSearch(text);
			if (handleNonEmptyString != null) {
				handleNonEmptyString();
			}
		}
	};

	const renderProfile = ({
		item,
	}: {
		item: markedUser | markedPrivateUser;
	}): ReactElement => {
		return <ProfileCell user={item} handleRelationRender={handleMarking} />;
	};

	const whiteSpaceBG = (): ReactElement => {
		return (
			<View
				style={{
					height: 10,
					width: '100%',
					backgroundColor: GlobalStyles.colorPalette.primary[100],
				}}
			/>
		);
	};

	return (
		<View style={{ gap: 0 }}>
			<View style={styles.searchBar}>
				<SearchBar
					placeholder={placeholder}
					searchQuery={searchQuery}
					handleSearch={handleSearch}
				/>
			</View>

			{whiteSpaceBG()}

			{isLoading === 1 ? (
				<View style={{ height: '100%' }}>
					<Loading />
				</View>
			) : (
				<FlatList
					data={searchResults}
					renderItem={renderProfile}
					keyExtractor={(item) => item.uid}
					showsVerticalScrollIndicator={false}
					ListHeaderComponent={<View style={{ height: 35 }} />}
					ListFooterComponent={() => {
						if (searchQuery === '') {
							return null;
						}
						return <View style={{ height: screenHeight * 0.13 }} />;
					}}
				/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	searchBar: {
		width: '100%',
		position: 'absolute',
		zIndex: 2,
		backgroundColor: 'rgba(0, 0, 0, 0)',
	},
});

export default SearchUsers;
