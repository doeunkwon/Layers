// import React, {
// 	type ReactElement,
// 	useState,
// 	type PropsWithChildren,
// } from 'react';
// import { ScrollView } from 'react-native-gesture-handler';
// import {
// 	type ScrollViewProps,
// 	type NativeScrollEvent,
// 	type NativeSyntheticEvent,
// } from 'react-native';
//
// const DismissableScrollView = (
// 	props: PropsWithChildren<ScrollViewProps>
// ): ReactElement => {
// 	const [isOnTop, setIsOnTop] = useState(true);
//
// 	const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>): void => {
// 		const offset = event.nativeEvent.contentOffset.y;
// 		const newValue = offset <= 10;
//
// 		if (isOnTop !== newValue) {
// 			setIsOnTop(newValue);
// 		}
// 	};
//
// 	return (
// 		<GestureHandlerRefContext.Consumer>
// 			{(ref) => (
// 				<ScrollView
// 					simultaneousHandlers={isOnTop ? ref : undefined}
// 					bounces={false}
// 					scrollEventThrottle={16}
// 					onScroll={onScroll}
// 					{...props}
// 				>
// 					{props.children}
// 				</ScrollView>
// 			)}
// 		</GestureHandlerRefContext.Consumer>
// 	);
// };
//
// export default DismissableScrollView;
