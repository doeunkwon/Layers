import { type User } from '../types/User';
import React, {
	createContext,
	type ReactNode,
	type ReactElement,
	type Dispatch,
	useEffect,
	useContext,
} from 'react';
import { useImmerReducer } from 'use-immer';
import { nullUser } from '../constants/baseUsers';
import { EndpointGetUserPrivate } from '../endpoints/private/user';
import { base64Prefix } from '../utils/Base64Prefix';
import { photos } from '../endpoints/General/pictureProcessor';

interface UserProviderProps {
	children: ReactNode;
}

export interface UserReducerProps {
	type: string;
	user?: User;
	uid?: string;
	first_name?: string;
	last_name?: string;
	email?: string;
	username?: string;
	private_option?: boolean;
	followers?: string[];
	following?: string[];
	profile_picture?: string;
}

const userReducer = (draft: User, action: UserReducerProps): User => {
	switch (action.type) {
		case 'logout': {
			return nullUser;
		}
		case 'change user': {
			if (action.user !== null && action.user !== undefined) {
				return action.user;
			}
			return draft;
		}
		case 'change fields': {
			return setUserProps(draft, action);
		}
		default: {
			throw Error('Unknown action user reducer: ' + String(action.type));
		}
	}
};

export const UserContext = createContext<User>(nullUser);
export const UpdateUserContext = createContext<Dispatch<UserReducerProps>>(
	() => {}
);

export const UserProvider = ({ children }: UserProviderProps): ReactElement => {
	const [tasks, dispatch] = useImmerReducer(userReducer, nullUser);

	useEffect(() => {
		void EndpointGetUserPrivate(dispatch);
	}, []);
	return (
		<UserContext.Provider value={tasks}>
			<UpdateUserContext.Provider value={dispatch}>
				{children}
			</UpdateUserContext.Provider>
		</UserContext.Provider>
	);
};

export const useUser = (): User => {
	return useContext(UserContext);
};

export const useUpdateUser = (): Dispatch<UserReducerProps> => {
	return useContext(UpdateUserContext);
};

const setUserProps = (draft: User, action: UserReducerProps): User => {
	if (action.uid !== null && action.uid !== undefined) {
		draft.uid = action.uid;
	}
	if (action.first_name !== null && action.first_name !== undefined) {
		draft.first_name = action.first_name;
	}
	if (action.last_name !== null && action.last_name !== undefined) {
		draft.last_name = action.last_name;
	}
	if (action.email !== null && action.email !== undefined) {
		draft.email = action.email;
	}
	if (action.username !== null && action.username !== undefined) {
		draft.username = action.username;
	}
	if (action.private_option !== null && action.private_option !== undefined) {
		draft.private_option = action.private_option;
	}
	if (action.followers !== null && action.followers !== undefined) {
		draft.followers = action.followers;
	}
	if (action.following !== null && action.following !== undefined) {
		draft.following = action.following;
	}
	if (action.profile_picture !== null && action.profile_picture !== undefined) {
		photos.delete(draft.uid);
		if (action.profile_picture === '') {
			draft.profile_picture = '';
		} else {
			draft.profile_picture = `${base64Prefix}${action.profile_picture}`;
		}
	}
	return draft;
};
