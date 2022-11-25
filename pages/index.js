import Head from 'next/head';
import Image from 'next/image';

import Banner from '../components/banner';
import Card from '../components/card';

import { fetchCoffeeStores } from '../lib/coffee-stores';
import styles from '../styles/Home.module.css';

export async function getStaticProps(context) {
	const coffeeStores = await fetchCoffeeStores();
	return {
		props: { coffeeStores }, // will be passed to the page component as props
	};
}

export default function Home(props) {
	console.log('props', props);
	const handleOnBannerBtnClick = (e) => {
		e.preventDefault();
		console.log('Hellloooo Banners');
	};
	return (
		<div className={styles.container}>
			<Head>
				<title>Coffee Explorer</title>
				<meta
					name='description'
					content='Find and Rate your favorite local coffee shops!'
				/>
				<link
					rel='icon'
					href='/favicon.ico'
				/>
			</Head>

			<main className={styles.main}>
				<Banner
					buttonText='View stores nearby'
					handleOnClick={handleOnBannerBtnClick}
				/>
				<div className={styles.heroImage}>
					<Image
						src='/static/hero-image.png'
						width={700}
						height={400}
						alt='Hero Image'
					/>
				</div>
				{props.coffeeStores.length > 0 && (
					<>
						<h2 className={styles.heading2}>Toronto stores</h2>
						<div className={styles.cardLayout}>
							{props.coffeeStores.map(({ id, name, imgUrl }) => {
								return (
									<Card
										key={id}
										name={name}
										imgUrl={
											imgUrl ||
											'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
										}
										href={`/coffee-store/${id}`}
										className={styles.card}
									/>
								);
							})}
						</div>
					</>
				)}
			</main>
		</div>
	);
}
