import React, { useEffect, useState } from 'react';
import Find from './Find';
import MarkedList from './MarkedList';
import ForeignProfile from '../../pages/Profile/ForeignProfile';
import { Stack } from '../../utils/StackNavigation';
import { NavigationContainer } from '@react-navigation/native';
import { StackNavigation } from '../../constants/Enums';
import ItemViewPage from '../../pages/ItemView/ItemViewPage';
import { axiosEndpointErrorHandler } from '../../utils/ErrorHandlers';
import { type User } from '../../types/User';
import { previewLength } from '../../constants/Find';
import { MarkUserFuncProvider } from '../../Contexts/ForeignUserContext';
import { useUser } from '../../Contexts/UserContext';
import OutfitViewPage from '../../pages/OutfitView/OutfitViewPage';
import { EndpointGetUserPublicMarkedBar } from 'endpoints/public/user';

const FindPage: React.FC = () => {
	const data = useUser();
	// this only gets the foreignUsersData from UserContext on initial load
	const foreignUsersIDs: string[] = data?.following ?? [];
	const [followedUsersData, setFollowed] =
		useState<Array<string | User>>(foreignUsersIDs);

	const updateFollowed = (followed: Array<string | User>): void => {
		setFollowed(followed);
	};

	useEffect(() => {
		const get3Users = async (): Promise<void> => {
			try {
				const top3Users: Array<User | string> = await Promise.all(
					followedUsersData
						.slice(0, previewLength)
						.map(async (user: string | User) => {
							if (typeof user === 'string') {
								return await EndpointGetUserPublicMarkedBar(user);
							} else {
								return user;
							}
						})
				);
				setFollowed(top3Users.concat(followedUsersData.slice(previewLength)));
			} catch (error) {
				axiosEndpointErrorHandler(error);
			}
		};

		if (
			followedUsersData
				.slice(0, previewLength)
				.some((user) => typeof user === 'string')
		) {
			void get3Users();
		}
	}, [followedUsersData]);

	const FindHomePage: React.FC = () => {
		return (
			<Find
				foreignUserIDs={followedUsersData}
				updateFollowed={updateFollowed}
			/>
		);
	};
	const MarkedListComponent: React.FC = () => (
		<MarkedList
			foreignUserIDs={followedUsersData}
			updateFollowed={updateFollowed}
		/>
	);

	return (
		<MarkUserFuncProvider>
			<NavigationContainer independent={true}>
				<Stack.Navigator screenOptions={{ headerShown: false }}>
					<Stack.Screen name={StackNavigation.Find} component={FindHomePage} />
					<Stack.Group
						screenOptions={{
							presentation: 'modal',
						}}
					>
						<Stack.Screen
							name={StackNavigation.MarkedList}
							component={MarkedListComponent}
						/>
						<Stack.Screen
							name={StackNavigation.ForeignProfile}
							component={ForeignProfile}
						/>
						<Stack.Screen
							name={StackNavigation.ItemViewPage}
							component={ItemViewPage}
						/>
						<Stack.Screen
							name={StackNavigation.OutfitViewPage}
							component={OutfitViewPage}
						/>
					</Stack.Group>
				</Stack.Navigator>
			</NavigationContainer>
		</MarkUserFuncProvider>
	);
};

export default FindPage;
