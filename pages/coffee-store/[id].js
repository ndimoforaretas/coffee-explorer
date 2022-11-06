import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import coffeeStoresData from '../../components/data/coffee-stores.json';

export function getStaticProps(staticProps) {
	const params = staticProps.params;
	return {
		props: {
			coffeeStore: coffeeStoresData.find((coffeeStore) => {
				return coffeeStore.id.toString() === params.id;
			}),
		},
	};
}

export function getStaticPaths() {
	const paths = coffeeStoresData.map((coffeeStore) => {
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

const CoffeeStore = (props) => {
	const router = useRouter();

	if (router.isFallback) {
		return <div>Loading...</div>;
	}

	const { address, name, neighbourhood } = props.coffeeStore;
	return (
		<div>
			<Head>
				<title>{name}</title>
			</Head>
			<Link href='/'>
				<a>Back to home</a>
			</Link>
			<p>{address}</p>
			<p>{name}</p>
			<p>{neighbourhood}</p>
		</div>
	);
};

export default CoffeeStore;
