const Airtable = require('airtable');
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
	process.env.AIRTABLE_BASE_KEY
);

const table = base('coffee-stores');

console.log({ table });

const createCoffeeStore = async (req, res) => {
	console.log({ req });
	if (req.method === 'POST') {
		const { id, name, region, address, imgUrl, voting } = req.body;

		try {
			// finding a record
			if (id) {
				const findCoffeeStoreRecords = await table
					.select({
						filterByFormula: `id=${id}`,
					})
					.firstPage();

				console.log({ findCoffeeStoreRecords });

				if (findCoffeeStoreRecords.length !== 0) {
					const records = findCoffeeStoreRecords.map((record) => {
						return {
							...record.fields,
						};
					});
					res.json(records);
				} else {
					// create a record
					if (name) {
						const createRecords = await table.create([
							{
								fields: {
									id,
									name,
									address,
									region,
									voting,
									imgUrl,
								},
							},
						]);

						const records = createRecords.map((record) => {
							return {
								...record.fields,
							};
						});

						res.json({ records });
					} else {
						res.status(400);
						res.json({ message: 'name is missing' });
					}
				}
			} else {
				res.status(400);
				res.json({ message: 'Id is missing' });
			}
		} catch (error) {
			console.error('Error creating or finding store', error);
			res.status(500);
			res.json({ message: 'Error creating or finding store', error });
		}
	}
};

export default createCoffeeStore;
