import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	Pressable,
	Keyboard,
	Linking,
} from 'react-native';
import GlobalStyles from '../../constants/GlobalStyles';
import SquareTextbox from '../../components/Textbox/SquareTextbox';
import { feedback, toast } from '../../constants/GlobalStrings';
import Header from '../../components/Header/Header';
import { StackNavigation, StepOverTypes } from '../../constants/Enums';
import { Controller, useForm } from 'react-hook-form';
import { showErrorToast } from '../../components/Toasts/Toasts';

interface FormValues {
	feedback: string;
}

const FeedbackPage: React.FC = () => {
	const {
		control,
		handleSubmit,
		formState: { dirtyFields },
	} = useForm({
		defaultValues: {
			feedback: '',
		},
	});

	const handleEmail = (values: FormValues): void => {
		const email_address = 'layersapplication@gmail.com';
		const mail = `mailto:${email_address}` + '?body=' + values.feedback;
		Linking.openURL(mail).catch((_err) => {
			showErrorToast(toast.anErrorHasOccurredWhileSendingFeedback);
		});
	};

	return (
		<Pressable onPress={Keyboard.dismiss} style={styles.container}>
			<Header
				text={StackNavigation.Feedback}
				rightButton={true}
				rightBack={true}
				rightStepOverType={StepOverTypes.send}
				rightButtonAction={handleSubmit(handleEmail)}
				rightButtonDisabled={Object.keys(dirtyFields).length < 1}
			/>
			<View style={styles.content}>
				<Controller
					control={control}
					rules={{
						required: true,
						maxLength: 1000,
					}}
					render={({ field: { onChange, value } }) => (
						<SquareTextbox
							onFieldChange={onChange}
							value={value}
							placeholder={feedback.tellUsWhatYouThink}
						/>
					)}
					name="feedback"
				/>
				<View style={styles.label}>
					<Text style={styles.text}>{feedback.madeWithLoveFromCanada}</Text>
				</View>
			</View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	content: {
		marginHorizontal: GlobalStyles.layout.xGap,
		alignItems: 'center',
		gap: 15,
	},
	container: {
		flex: 1,
		gap: 15,
		paddingTop: 20,
	},
	label: {
		flexDirection: 'row',
		gap: 4,
	},
	text: {
		...GlobalStyles.typography.body2,
		color: GlobalStyles.colorPalette.primary[400],
	},
	link: {
		...GlobalStyles.typography.body2,
		color: GlobalStyles.colorPalette.info[500],
	},
});

export default FeedbackPage;
