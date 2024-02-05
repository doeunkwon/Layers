import { baseUrl } from '../utils/apiUtils';

export const ContentType = 'application/json';

export enum Routers {
	PublicUser = `${baseUrl}/api/users`,
	PublicClothingItem = `${baseUrl}/api/clothing_items`,
	PublicOutfit = `${baseUrl}/api/outfits`,
	PrivateUser = `${baseUrl}/api/private/users`,
	PrivateClothingItem = `${baseUrl}/api/private/clothing_items`,
	PrivateOutfit = `${baseUrl}/api/private/outfits`,
	PrivateSearch = `${baseUrl}/api/private/search/`,
	AuthenticationLogin = `${baseUrl}/login`,
	AuthenticationSignUp = `${baseUrl}/signup`,
	AuthenticationLogout = `${baseUrl}/logout`,
}
export enum Methods {
	GET = 'get',
	POST = 'post',
	PUT = 'put',
	DELETE = 'delete',
}
