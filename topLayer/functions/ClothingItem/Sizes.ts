import { ClothingTypes } from '../../constants/Enums';
import { type Sizes } from '../../types/Clothing';

export const setClothingTypeSize = (category: string): Sizes[] => {
	if (category === ClothingTypes.outerwear || category === ClothingTypes.tops) {
		return [
			{
				label: 'XXS',
				value: 'xxs',
			},
			{
				label: 'XS',
				value: 'xs',
			},
			{
				label: 'S',
				value: 's',
			},
			{
				label: 'M',
				value: 'm',
			},
			{
				label: 'L',
				value: 'l',
			},
			{
				label: 'XL',
				value: 'xl',
			},
			{
				label: 'XXL',
				value: 'xxl',
			},
		];
	} else if (category === ClothingTypes.bottoms) {
		return [
			{
				label: 'US 28',
				value: 'xxs',
			},
			{
				label: 'US 30',
				value: 'xs',
			},
			{
				label: 'US 32',
				value: 's',
			},
			{
				label: 'US 34',
				value: 'm',
			},
			{
				label: 'US 36',
				value: 'l',
			},
			{
				label: 'US 38',
				value: 'xl',
			},
			{
				label: 'US 40',
				value: 'xxl',
			},
		];
	} else {
		return [
			{
				label: 'US 7',
				value: 'xxs',
			},
			{
				label: 'US 8',
				value: 'xs',
			},
			{
				label: 'US 9',
				value: 's',
			},
			{
				label: 'US 10',
				value: 'm',
			},
			{
				label: 'US 11',
				value: 'l',
			},
			{
				label: 'US 12',
				value: 'xl',
			},
			{
				label: 'US 13',
				value: 'xxl',
			},
		];
	}
};
