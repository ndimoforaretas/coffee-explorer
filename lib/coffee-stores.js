import { createApi } from 'unsplash-js';

const unsplash = createApi({
	accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const getUrlForCoffeeStores = (latLong, query, limit) => {
	return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`;
};

const getListOfCoffeeStorePhotos = async () => {
	const photos = await unsplash.search.getPhotos({
		query: 'coffee shop',
		page: 1,
		perPage: 40,
		orientation: 'squarish',
	});
	// const unsplashResults = photos.response.results;
	const unsplashResults = photos.response?.results || [];

	return unsplashResults.map((result) => result.urls['small']);
};

export const fetchCoffeeStores = async (
	latLong = '52.6802779495329%2C13.596537985152766',

	limit = 6
) => {
	const photos = await getListOfCoffeeStorePhotos();
	const options = {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
		},
	};
	const newLatLong = latLong.replace(/ /g, '');

	const response = await fetch(
		getUrlForCoffeeStores(newLatLong, 'coffee', limit),
		options
	);

	const data = await response.json();

	return data.results.map((result, index) => {
		const region = result.location.locality;
		
		return {
			id: result.fsq_id,
			name: result.name,
			address: result.location.formatted_address,
			region: region.length > 0 ? region : '',
			
			imgUrl: photos.length > 0 ? photos[index] : null,
		};
	});

};
