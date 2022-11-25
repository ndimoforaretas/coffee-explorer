import { createApi } from 'unsplash-js';

const unsplash = createApi({
	accessKey: process.env.UNSPLASH_ACCESS_KEY,
});

const getUrlForCoffeeStores = (latLong, query, limit) => {
	return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`;
};

const getListOfCoffeeStorePhotos = async () => {
	const photos = await unsplash.search.getPhotos({
		query: 'coffee shop',
		page: 1,
		perPage: 30,
		orientation: 'squarish',
	});
	const unsplashResults = photos.response.results;

	return unsplashResults.map((result) => result.urls['small']);
};

export const fetchCoffeeStores = async () => {
	const photos = await getListOfCoffeeStorePhotos();
	const options = {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: process.env.FOURSQUARE_API_KEY,
		},
	};

	const response = await fetch(
		getUrlForCoffeeStores(
			'52.6802779495329%2C13.596537985152766',
			'coffee',
			'6'
		),
		options
	);

	const data = await response.json();

	return data.results.map((result, index) => {
		const region = result.location.region;
		return {
			id: result.fsq_id,
			name: result.name,
			address: result.location.address,
			region: region.length > 0 ? region : '',
			imgUrl: photos.length > 0 ? photos[index] : null,
		};
	});
	// .catch((err) => console.error(err));
};
