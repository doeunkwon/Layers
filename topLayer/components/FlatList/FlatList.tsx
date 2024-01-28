import React, {
	type ReactElement,
	useState,
	type PropsWithChildren,
} from 'react';
import { GestureHandlerRefContext } from '@react-navigation/stack';
import {
	type FlatListProps,
	type NativeScrollEvent,
	type NativeSyntheticEvent,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { type UserOutfit } from '../../types/Outfit';
import { type UserClothing } from '../../types/Clothing';

const DismissableFlatList = (
	props: PropsWithChildren<FlatListProps<any>>
): ReactElement => {
	const [isOnTop, setIsOnTop] = useState(true);

	const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>): void => {
		const offset = event.nativeEvent.contentOffset.y;
		const newValue = offset <= 10;

		if (isOnTop !== newValue) {
			setIsOnTop(newValue);
		}
	};

	return (
		<GestureHandlerRefContext.Consumer>
			{(ref) => (
				<FlatList
					waitFor={isOnTop ? ref : undefined}
					onScroll={onScroll}
					scrollEventThrottle={16}
					{...props}
				>
					{props.children}
				</FlatList>
			)}
		</GestureHandlerRefContext.Consumer>
	);
};

export default DismissableFlatList;
