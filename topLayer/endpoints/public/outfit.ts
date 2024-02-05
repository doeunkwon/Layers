import axios from 'axios';
import { Methods } from '../Methods';
import { Routers } from '../Routers';
import { type UserOutfit } from '../../types/Outfit';
import { axiosEndpointErrorHandlerNoAlert } from '../../utils/ErrorHandlers';
import { outfitPictureProcessor } from '../General/Specialized/pictureProcessors';

export const EndpointGetForeignAllOutfits = async (
	uid: string,
	successFunc: (data: UserOutfit[]) => void,
	failureFunc: () => void
): Promise<void> => {
	const method = Methods.GET;
	const url = Routers.PublicOutfit + `/u/${uid}?parse=categories`;

	try {
		const { data, status } = await axios<{ data: UserOutfit[] }>({
			method: method,
			url: url,
		});
		if (status === 200) {
			// const outfit = await outfitPictureProcessor(data.data);
			successFunc(data.data);
		} else {
			throw new Error(
				`An Error Has Occurred -- Fetching User Outfits, User -- ${uid}: ${status}`
			);
		}
	} catch (err: unknown) {
		// showErrorToast(toast.anErrorHasOccurredWhileFetchingForeignOutfits);
		console.log(
			'An Error Has Occurred -- Fetching User Outfits, User -- ',
			uid
		);
		axiosEndpointErrorHandlerNoAlert(err);
		failureFunc();
	}
};
