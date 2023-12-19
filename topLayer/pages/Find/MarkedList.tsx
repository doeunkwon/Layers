import React, { memo, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';

import ProfileCell from '../../components/Cell/ProfileCell';

import GlobalStyles from '../../constants/GlobalStyles';

import { markedUser, User } from '../../pages/Main';
import FetchProfileCell from '../../components/Cell/LoadProfileCell';
import { find } from '../../constants/GlobalStrings';
import { previewLength } from '../../constants/Find';
import { useNavigation } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { type StackTypes } from '../../utils/StackNavigation';
import Header from '../../components/Header/Header';

interface MarkedListPropsType {
	foreignUserIDs: (User | string)[];
	updateFollowed: (followed: (string | User)[]) => void;
}

const MarkedList = ({
	foreignUserIDs,
	updateFollowed,
}: MarkedListPropsType) => {
	const navigation = useNavigation<NativeStackNavigationProp<StackTypes>>();
	console.log('New Load2');
	const [preLoad, setPreLoad] = useState(false);
	const unmarked = useRef<string[]>([]);
	const [count, setCount] = useState<number>(foreignUserIDs.length);
	const [isComponentVisible, setComponentVisible] = useState(true);
	const handleEmptyString = () => {
		setComponentVisible(true);
	};

	const handleNonEmptyString = () => {
		setComponentVisible(false);
	};

	useEffect(() => {
		if (
			!foreignUserIDs
				.slice(0, previewLength)
				.some((user) => typeof user === 'string')
		) {
			console.log('New Load');
			setPreLoad(true);
		}
	}, [foreignUserIDs]);

	useEffect(() => {
		const unsubscribe = navigation.addListener('beforeRemove', () => {
			for (const user of unmarked.current) {
				foreignUserIDs = foreignUserIDs.filter((value) => {
					if (typeof value === 'string') {
						return value !== user;
					} else {
						return value.uid !== user;
					}
				});
			}
			updateFollowed(foreignUserIDs);
		});
		return unsubscribe;
	}, [navigation]);

	const handleMarking = (
		uid: string,
		marked: boolean,
		index: number,
		user: markedUser
	) => {
		if (index !== -1) {
			unmarked.current.splice(index, 1);
			setCount(count + 1);
			return -1;
		} else {
			unmarked.current.push(uid);
			setCount(count - 1);
			return unmarked.current.length - 1;
		}
	};

	const renderProfile = ({ item }: { item: User | string; index: number }) => {
		console.log('Item', item);
		if (typeof item !== 'string') {
			return (
				<ProfileCell
					user={{
						...item,
						marked: true,
					}}
					handleRelationRender={handleMarking}
				/>
			);
		}
		return (
			<FetchProfileCell
				userID={item}
				marked={true}
				handleRelationRender={handleMarking}
			/>
		);
	};

	return (
		<View style={styles.container}>
			<Header text={`${count} ${find.marked}`} />
			{preLoad && isComponentVisible && (
				<FlatList
					data={foreignUserIDs}
					renderItem={renderProfile}
					keyExtractor={(item) => {
						if (typeof item === 'string') {
							return item;
						} else {
							return item.uid;
						}
					}}
				/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		top: GlobalStyles.layout.modalTopPadding,
		marginHorizontal: GlobalStyles.layout.xGap,
	},
});

export default MarkedList;
