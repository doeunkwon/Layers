import React from 'react';
import { StackNavigation } from '../../constants/Enums';
import { Stack } from '../../utils/StackNavigation';
import { NavigationContainer } from '@react-navigation/native';
import Match from './Match';
import OutfitPreview from '../../pages/OutfitPreview/OutfitPreview';

const MatchPage: React.FC = () => {
	return (
		<NavigationContainer independent={true}>
			<Stack.Navigator screenOptions={{ headerShown: false }}>
				<Stack.Screen name={StackNavigation.Match} component={Match} />
				<Stack.Screen
					options={{
						presentation: 'modal',
					}}
					name={StackNavigation.OutfitPreview}
					component={OutfitPreview}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default MatchPage;
