import { table, getMinifiedRecords } from '../../lib/airtable';

const createCoffeeStore = async (req, res) => {
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

				if (findCoffeeStoreRecords.length !== 0) {
					const records = getMinifiedRecords(findCoffeeStoreRecords);

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

						const records = getMinifiedRecords(createRecords);

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
