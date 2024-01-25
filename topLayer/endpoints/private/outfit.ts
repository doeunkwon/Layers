import axios from 'axios';
import { Methods } from '../Methods';
import { Routers } from '../Routers';
import { type UserOutfit, type createdOutfitProps } from '../../types/Outfit';
import {
	showErrorToast,
	showSuccessToast,
} from '../../components/Toasts/Toasts';
import { toast } from '../../constants/GlobalStrings';
import {
	axiosEndpointErrorHandler,
	axiosEndpointErrorHandlerNoAlert,
} from '../../utils/ErrorHandlers';
import { ContentType } from '../../endpoints/constants';

export const EndpointCreateOutfit = async (
	input: createdOutfitProps,
	successFunc: () => void
): Promise<void> => {
	const method = Methods.POST;
	const url = Routers.PrivateOutfit;

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
			showSuccessToast(toast.yourOutfitHasBeenCreated);
		} else {
			throw new Error(
				`An Error Has Occurred -- Creating a new Outfit: ${status}`
			);
		}
	} catch (err: unknown) {
		showErrorToast(toast.anErrorHasOccurredWhileCreatingOutfit);
		console.log('An Error Has Occurred -- Creating a new Outfit');
		axiosEndpointErrorHandler(err);
	}
};

export const EndpointUpdateOutfit = async (
	input: { title: string },
	outfitId: string,
	successFunc: () => void
): Promise<void> => {
	const method = Methods.PUT;
	const url = Routers.PrivateOutfit + `/${outfitId}`;

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
			showSuccessToast(toast.yourOutfitHasBeenUpdated);
		} else {
			throw new Error(`An Error Has Occurred -- Updating Outfit: ${status}`);
		}
	} catch (err: unknown) {
		showErrorToast(toast.anErrorHasOccurredWhileUpdatingOutfit);
		console.log('An Error Has Occurred -- Updating Outfit');
		axiosEndpointErrorHandler(err);
	}
};

export const EndpointDeleteOutfit = async (
	outfitId: string,
	successFunc: () => void
): Promise<void> => {
	const method = Methods.DELETE;
	const url = Routers.PrivateOutfit + `/${outfitId}`;

	try {
		const { status } = await axios({
			method: method,
			url: url,
		});
		if (status === 200) {
			successFunc();
			showSuccessToast(toast.yourOutfitHasBeenDeleted);
		} else {
			throw new Error(`An Error Has Occurred -- Deleting Outfit: ${status}`);
		}
	} catch (err: unknown) {
		showErrorToast(toast.anErrorHasOccurredWhileDeletingOutfit);
		console.log('An Error Has Occurred -- Deleting Outfit');
		axiosEndpointErrorHandler(err);
	}
};

export const EndpointGetAllOutfits = async (
	successFunc: (data: UserOutfit[]) => void,
	failureFunc: () => void
): Promise<void> => {
	const method = Methods.GET;
	const url = Routers.PrivateOutfit + '?parse=categories';

	try {
		const { data, status } = await axios<{ data: UserOutfit[] }>({
			method: method,
			url: url,
		});
		if (status === 200) {
			successFunc(data.data);
		} else {
			throw new Error(`An Error Has Occurred -- Fetching Outfits: ${status}`);
		}
	} catch (err: unknown) {
		axiosEndpointErrorHandlerNoAlert(err);
		console.log('An Error Has Occurred -- Fetching Outfits');
		// showErrorToast(toast.anErrorHasOccurredWhileFetchingOutfits);
		failureFunc();
	}
};
