import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

import useSWR from 'swr';
import cls from 'classnames';

import styles from '../../styles/coffee-store.module.css';
import { fetchCoffeeStores } from '../../lib/coffee-stores';

import { StoreContext } from '../../store/store-context';
import { fetcher, isEmpty } from '../../utils';

export async function getStaticProps(staticProps) {
	const params = staticProps.params;

	const coffeeStores = await fetchCoffeeStores();
	const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
		return coffeeStore.id.toString() === params.id;
	});
	return {
		props: {
			coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
		},
	};
}

export async function getStaticPaths() {
	const coffeeStores = await fetchCoffeeStores();
	const paths = coffeeStores.map((coffeeStore) => {
		return {
			params: {
				id: coffeeStore.id.toString(),
			},
		};
	});
	return {
		paths,
		fallback: true, // can also be true or 'blocking'
	};
}

const CoffeeStore = (initialProps) => {
	const router = useRouter();

	const id = router.query.id;

	const [coffeeStore, setCoffeeStore] = useState(
		initialProps.coffeeStore || {}
	);

	const {
		state: { coffeeStores },
	} = useContext(StoreContext);

	const handleCreateCoffeeStore = async (coffeeStore) => {
		try {
			const { id, name, address, region, voting, imgUrl } = coffeeStore;
			const response = await fetch('/api/createCoffeeStore', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					id,
					name,
					address: address || '',
					region: region || '',
					voting: 0,
					imgUrl,
				}),
			});

			const dbCoffeeStore = await response.json();
			console.log({ dbCoffeeStore });
		} catch (error) {
			console.error('Error creating coffee store', error);
		}
	};

	useEffect(() => {
		if (isEmpty(initialProps.coffeeStore)) {
			if (coffeeStores.length > 0) {
				const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
					return coffeeStore.id.toString() === id;
				});
				if (findCoffeeStoreById) {
					setCoffeeStore(findCoffeeStoreById);
					handleCreateCoffeeStore(findCoffeeStoreById);
				}
			} else {
				//SSG
				handleCreateCoffeeStore(initialProps.coffeeStore);
			}
		}
	}, [id, initialProps, initialProps.coffeeStore, coffeeStores]);

	const { name, address, region, imgUrl } = coffeeStore;

	const [votingCount, setVotingCount] = useState(0);

	const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher, {
		refreshInterval: 1000,
	});

	useEffect(() => {
		if (data && data.length > 0) {
			console.log('data from SWR', data);
			setCoffeeStore(data[0]);
			setVotingCount(data[0].voting);
		}
	}, [data]);

	if (router.isFallback) {
		return <div>Loading...</div>;
	}

	const handleUpvoteButton = async () => {
		try {
			const response = await fetch('/api/favouriteCoffeeStoreById', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					id,
				}),
			});

			const dbCoffeeStore = await response.json();

			if (dbCoffeeStore && dbCoffeeStore.length > 0) {
				let count = votingCount + 1;
				setVotingCount(count);
			}
		} catch (error) {
			console.error('Error upvoting the coffee store', error);
		}
	};

	if (error) {
		return <div> Something went wrong retrieving coffee store page</div>;
	}

	return (
		<div className={styles.layout}>
			<Head>
				<title>{name}</title>
			</Head>
			<div className={styles.container}>
				<div className={styles.col1}>
					<div className={styles.backToHomeLink}>
						<Link href='/'>
							<a> &larr; Back to home</a>
						</Link>
					</div>
					<div className={styles.nameWrapper}>
						<h1 className={styles.name}>{name}</h1>
					</div>

					<Image
						src={
							imgUrl ||
							'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
						}
						width={600}
						height={360}
						alt={name}
						className={styles.storeImg}
					/>
				</div>
				<div className={cls('glass', styles.col2)}>
					{address && (
						<div className={styles.iconWrapper}>
							<Image
								src='/static/icons/places.svg'
								width='24'
								height='24'
								alt={`${name} icon`}
							/>
							<p className={styles.text}>{address}</p>
						</div>
					)}

					{region && (
						<div className={styles.iconWrapper}>
							<Image
								src='/static/icons/nearMe.svg'
								width='24'
								height='24'
								alt={`${name} icon`}
							/>
							<p className={styles.text}>{region}</p>
						</div>
					)}

					<div className={styles.iconWrapper}>
						<Image
							src='/static/icons/star.svg'
							width='24'
							height='24'
							alt={`${name} icon`}
						/>
						<p className={styles.text}>{votingCount}</p>
					</div>

					<button
						className={styles.upvoteButton}
						onClick={handleUpvoteButton}
					>
						Up vote!
					</button>
				</div>
			</div>
		</div>
	);
};

export default CoffeeStore;
