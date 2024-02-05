import axios from 'axios';
import { Methods, Routers } from '../constants';
import { type outfitClothingItemsType } from '../../types/Outfit';
import { axiosEndpointErrorHandlerNoAlert } from '../../utils/ErrorHandlers';
import { outfitClothingItemsPictureProcessor } from '../General/Specialized/pictureProcessors';

export const EndpointGetForeignAllClothingItems = async (
	uid: string,
	successFunc: (data: outfitClothingItemsType) => void,
	failureFunc: () => void
): Promise<void> => {
	const method = Methods.GET;
	const url = Routers.PublicClothingItem + `/u/${uid}?parse=categories`;

	try {
		const { data, status } = await axios<{ data: outfitClothingItemsType }>({
			method: method,
			url: url,
		});
		if (status === 200) {
			const outfitClothingItems = await outfitClothingItemsPictureProcessor(
				data.data
			);
			successFunc(outfitClothingItems);
		} else {
			throw new Error(
				`An Error Has Occurred -- Fetching User ClothingItems, User -- ${uid}: ${status}`
			);
		}
	} catch (err: unknown) {
		axiosEndpointErrorHandlerNoAlert(err);
		console.log(
			'An Error Has Occurred -- Fetching User ClothingItems, User -- ',
			uid
		);
		// showErrorToast(toast.anErrorHasOccurredWhileFetchingForeignClothingItems);
		failureFunc();
	}
};
