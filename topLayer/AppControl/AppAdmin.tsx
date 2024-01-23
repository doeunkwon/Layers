import { LogBox } from 'react-native';
import React from 'react';
import AppProvider from './AppProviders';

LogBox.ignoreLogs(['Require cycle:']);
// ^ Ignores require cycle warnings. We decided to ignore these warnings for 2 reasons:
// 1. Require cycles are technically not errors. It's just React Native telling us that this is an area of potential danger (which we should keep in mind)
// 2. There's rarely a fix for require cycles, especially if it involves more than 2 components (which is our case)
LogBox.ignoreLogs(['Constants.platform.ios.model has been deprecated']);

const consoleWarn = console.error;
const SUPPRESSED_WARNINGS = [
	// The Following error is fixed with react-native-reanimated 3.6.0
	// https://github.com/software-mansion/react-native-reanimated/issues/4802
	'Warning: %s is deprecated in StrictMode.',
];

console.error = function filterWarnings(msg: string, errorType, ...args) {
	if (!SUPPRESSED_WARNINGS.some((entry) => msg.startsWith(entry))) {
		console.log(msg, errorType);
		consoleWarn(msg, ...args);
	}
};

const AppAdmin: React.FC = () => {
	return <AppProvider />;
};

export default AppAdmin;
