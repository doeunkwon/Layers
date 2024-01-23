import { createNavigationContainerRef } from '@react-navigation/native';
import { type StackNavigatorType } from '../utils/StackNavigation';

export const navigationRef =
	createNavigationContainerRef<Record<string, object>>();

export function navigate(name: string, params: StackNavigatorType): void {
	if (navigationRef.isReady()) {
		navigationRef.navigate(name, params);
	}
}
