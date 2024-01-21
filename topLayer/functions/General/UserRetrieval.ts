import { type User, type retrievedUser } from '../../types/User';
import { imageUrl } from './Image/ImageHandling';

export const pictureProcessor = (data: retrievedUser): User => {
	const image = imageUrl(data.profile_picture);
	const { profile_picture, ...filter } = data;
	const user = { ...filter, profile_picture: image };
	console.log('user: ', user);
	return user;
};
