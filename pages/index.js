import Head from 'next/head';
import Image from 'next/image';

import Banner from '../components/banner';
import Card from '../components/card';

import styles from '../styles/Home.module.css';

export default function Home() {
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
				<div className={styles.cardLayout}>
					<Card
						name='DarkHorse Coffee'
						imgUrl='/static/hero-image.png'
						href='/coffee-store/darkhorse-coffee'
						className={styles.card}
					/>

					<Card
						name='DarkHorse Coffee'
						imgUrl='/static/hero-image.png'
						href='/coffee-store/darkhorse-coffee'
						className={styles.card}
					/>
				</div>
			</main>
		</div>
	);
}
