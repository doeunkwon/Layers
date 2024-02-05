import React, { type ReactElement, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import ProfileCell from '../../components/Cell/ProfileCell';
import GlobalStyles from '../../constants/GlobalStyles';
import { type markedUser, type User } from '../../types/User';
import FetchProfileCell from '../../components/Cell/LoadProfileCell';
import { find } from '../../constants/GlobalStrings';
import { previewLength } from '../../constants/Find';
import { useNavigation } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { type StackTypes } from '../../utils/StackNavigation';
import Header from '../../components/Header/Header';
import { screenHeight } from '../../utils/modalMaxShow';
import Icon from 'react-native-remix-icon';

interface MarkedListPropsType {
	foreignUserIDs: Array<User | string>;
	updateFollowed: (followed: Array<string | User>) => void;
}

const MarkedList = ({
	foreignUserIDs,
	updateFollowed,
}: MarkedListPropsType): ReactElement => {
	const navigation = useNavigation<NativeStackNavigationProp<StackTypes>>();
	const [preLoad, setPreLoad] = useState(false);
	const unmarked = useRef<string[]>([]);
	const [count, setCount] = useState<number>(foreignUserIDs.length);

	useEffect(() => {
		if (
			!foreignUserIDs
				.slice(0, previewLength)
				.some((user) => typeof user === 'string')
		) {
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
		_marked: boolean,
		index: number,
		_user: markedUser
	): number => {
		if (index !== -1) {
			unmarked.current.splice(index, 1);
			setCount((count) => count + 1);
			return -1;
		} else {
			unmarked.current.push(uid);
			setCount((count) => count - 1);
			return unmarked.current.length - 1;
		}
	};

	const renderProfile = ({
		item,
	}: {
		item: User | string;
		index: number;
	}): ReactElement => {
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
		} else {
			return (
				<FetchProfileCell
					userID={item}
					marked={true}
					handleRelationRender={handleMarking}
				/>
			);
		}
	};

	return (
		<View style={styles.container}>
			<Header text={`${count} ${find.marked}`} />
			{foreignUserIDs.length !== 0 && preLoad ? (
				<FlatList
					data={foreignUserIDs}
					ListFooterComponent={<View style={{ height: screenHeight * 0.15 }} />}
					showsVerticalScrollIndicator={false}
					renderItem={renderProfile}
					keyExtractor={(item) => {
						if (typeof item === 'string') {
							return item;
						} else {
							return item.uid;
						}
					}}
				/>
			) : foreignUserIDs.length === 0 ? (
				<View
					style={{
						alignItems: 'center',
						justifyContent: 'center',
						height: screenHeight * 0.73,
						gap: 5,
					}}
				>
					<Icon
						name={GlobalStyles.icons.userOutline2}
						color={GlobalStyles.colorPalette.primary[300]}
						size={GlobalStyles.sizing.icon.large}
					/>
					<Text
						style={[
							GlobalStyles.typography.subtitle,
							{ color: GlobalStyles.colorPalette.primary[300] },
						]}
					>
						No users
					</Text>
				</View>
			) : null}
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
