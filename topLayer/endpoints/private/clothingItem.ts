import axios from 'axios';
import { Methods, Routers, ContentType } from '../constants';
import { type outfitClothingItemsType } from '../../types/Outfit';
import {
	showErrorToast,
	showSuccessToast,
} from '../../components/Toasts/Toasts';
import { toast } from '../../constants/GlobalStrings';
import {
	axiosEndpointErrorHandler,
	axiosEndpointErrorHandlerNoAlert,
} from '../../utils/ErrorHandlers';
import {
	type creationClothingTypes,
	type editableClothingTypes,
} from '../../types/Clothing';
import { outfitClothingItemsPictureProcessor } from '../General/Specialized/pictureProcessors';

export const EndpointCreateItem = async (
	input: creationClothingTypes,
	successFunc: () => void
): Promise<void> => {
	const method = Methods.POST;
	const url = Routers.PrivateClothingItem;

	try {
		const { status } = await axios({
			method: method,
			url: url,
			data: input,
			headers: {
				'Content-Type': ContentType,
			},
		});
		if (status === 200) {
			successFunc();
			showSuccessToast(toast.yourItemHasBeenCreated);
		} else {
			throw new Error(`An Error Has Occurred -- Creating Item: ${status}`);
		}
	} catch (err: unknown) {
		showErrorToast(toast.anErrorHasOccurredWhileCreatingItem);
		console.log('An Error Has Occurred -- Creating Item');
		axiosEndpointErrorHandler(err);
	}
};

export const EndpointUpdateItem = async (
	input: Partial<editableClothingTypes>,
	ciid: string,
	successFunc: () => void
): Promise<void> => {
	const method = Methods.PUT;
	const url = Routers.PrivateClothingItem + `/${ciid}`;

	try {
		const { status } = await axios({
			method: method,
			url: url,
			data: input,
			headers: {
				'Content-Type': ContentType,
			},
		});
		if (status === 200) {
			successFunc();
			showSuccessToast(toast.yourItemHasBeenUpdated);
		} else {
			throw new Error(`An Error Has Occurred -- Updating Item: ${status}`);
		}
	} catch (err: unknown) {
		showErrorToast(toast.anErrorHasOccurredWhileUpdatingItem);
		console.log('An Error Has Occurred -- Updating Item');
		axiosEndpointErrorHandler(err);
	}
};

export const EndpointDeleteItem = async (
	ciid: string,
	successFunc: () => void
): Promise<void> => {
	const method = Methods.DELETE;
	const url = Routers.PrivateClothingItem + `/${ciid}`;

	try {
		const { status } = await axios({
			method: method,
			url: url,
		});
		if (status === 200) {
			successFunc();
			showSuccessToast(toast.yourItemHasBeenDeleted);
		} else {
			throw new Error(`An Error Has Occurred -- Deleting Item: ${status}`);
		}
	} catch (err: unknown) {
		showErrorToast(toast.anErrorHasOccurredWhileDeletingItem);
		console.log('An Error Has Occurred -- Deleting Item');
		axiosEndpointErrorHandler(err);
	}
};

export const EndpointGetAllClothingItems = async (
	successFunc: (data: outfitClothingItemsType) => void,
	failureFunc: () => void
): Promise<void> => {
	const method = Methods.GET;
	const url = Routers.PrivateClothingItem + '?parse=categories';

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
				`An Error Has Occurred -- Fetching Clothing Items: ${status}`
			);
		}
	} catch (err: unknown) {
		// showErrorToast(toast.anErrorHasOccurredWhileFetchingClothingItems);
		console.log('An Error Has Occurred -- Fetching Clothing Items');
		axiosEndpointErrorHandlerNoAlert(err);
		failureFunc();
	}
};
