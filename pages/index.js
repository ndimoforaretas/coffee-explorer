import Head from 'next/head';
import Image from 'next/image';

import Banner from '../components/banner';
import Card from '../components/card';
import coffeeStoresData from '../components/data/coffee-stores.json';
import styles from '../styles/Home.module.css';

export async function getStaticProps(context) {
	return {
		props: { coffeeStores: coffeeStoresData }, // will be passed to the page component as props
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
										imgUrl={imgUrl}
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
