import styles from './banner.module.css';

const Banner = (props) => {
	return (
		/*	<div>
   
			<h1>Kaffee Erforscher</h1>
			<p>Entdecken Sie Ihre lokalen Cafés!</p>
			<button>Läden in der Nähe ansehen</button>
      
		</div> */

		<div className={styles.container}>
			<h1 className={styles.title}>
				<span className={styles.title1}>Coffee</span>
				<span className={styles.title2}> Explorer</span>
			</h1>
			<p className={styles.subTitle}>Discover your local coffee shops!</p>
			<div className={styles.buttonWrapper}>
				<button
					className={styles.button}
					onClick={props.handleOnClick}
				>
					{props.buttonText}
				</button>
			</div>
		</div>
	);
};

export default Banner;
