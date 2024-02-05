import axios from 'axios';
import { Methods } from '../Methods';
import { Routers } from '../Routers';
import { axiosEndpointErrorHandlerNoAlert } from '../../utils/ErrorHandlers';
import { type markedUser, type markedPrivateUser } from '../../types/User';
import { markedUsersPictureProcessor } from '../../endpoints/General/Specialized/pictureProcessors';

export const EndpointAllSearch = async (
	text: string,
	successFunc: (data: Array<markedUser | markedPrivateUser>) => void,
	signal: AbortSignal
): Promise<void> => {
	const method = Methods.GET;
	const url = Routers.PrivateSearch + `/${text}`;

	try {
		const { data, status } = await axios<{
			data: Array<markedUser | markedPrivateUser>;
		}>({
			method: method,
			url: url,
			signal: signal,
		});
		if (status === 200) {
			const users = await markedUsersPictureProcessor(data.data);
			successFunc(users);
		} else {
			throw new Error(
				`An Error Has Occurred -- Searching for Users: ${status}`
			);
		}
	} catch (err: unknown) {
		console.log('An Error Has Occurred -- Searching for Users');
		axiosEndpointErrorHandlerNoAlert(err);
	}
};
