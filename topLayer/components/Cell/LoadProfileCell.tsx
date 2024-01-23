import React, { useState, useEffect, type ReactElement, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { type markedUser, type User } from '../../types/User';
import ProfileCell from './ProfileCell';
import { nullUser } from '../../constants/baseUsers';
import { endpoint } from '../../endpoints/General/endpoint';

interface FetchProfileCellPropsType {
	userID: string;
	marked: boolean;
	handleRelationRender: (
		uid: string,
		marked: boolean,
		index: number,
		user: markedUser
	) => number;
}

const FetchProfileCell = ({
	userID,
	marked,
	handleRelationRender,
}: FetchProfileCellPropsType): ReactElement => {
	const [userProcessed, setUser] = useState<markedUser>({
		...nullUser,
		marked: marked,
	});
	const rendered = useRef('not rendered');

	const endpointConfig = {
		method: 'get',
		url: `/api/users/${userID}`,
	};
	const setUserFunc = (data: User): void => {
		rendered.current = 'rendered';
		setUser({
			...data,
			marked: marked,
		});
	};

	useEffect(() => {
		void endpoint({ config: endpointConfig, successFunc: setUserFunc });
	}, []);

	return (
		<ProfileCell
			key={rendered.current}
			user={userProcessed}
			handleRelationRender={handleRelationRender}
		/>
	);
};

const styles = StyleSheet.create({});

export default FetchProfileCell;
