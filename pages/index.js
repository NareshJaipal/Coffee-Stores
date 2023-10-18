import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Image from 'next/image'

import Banner from '../components/banner'
import Card from '../components/card'
import coffeeStoresData from '../data/coffee-store.json'

const inter = Inter({ subsets: ['latin'] })


export async function getStaticProps(context) {
  console.log('context from getStaticProps', context)
  return {
    props: {
      coffeeStores: coffeeStoresData
    }
  }
}

export default function Home(props) {
  console.log('props: ', props)
  const handleOnBannerBtnClick = () => {
    console.log('Button clicked')
  }
  return (
    <>
      <Head>
        <title>Coffee Connoisseur</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>

        <Banner buttonText='View stores nearby' handleOnClick={handleOnBannerBtnClick} />
        <div className={styles.heroImage}>
          <Image src='/static/coffee.png' width={440} height={300} priority={true} />
        </div>
        {props.coffeeStores.length > 0 && (
          <>
            <h2 className={styles.heading2}>Karachi Stores</h2>

            <div className={styles.cardLayout}>
              {props.coffeeStores.map((coffeeStores) => {
                return (
                  <Card className={styles.card}
                    key={coffeeStores.id}
                    name={coffeeStores.name}
                    imgUrl={coffeeStores.imgUrl}
                    href={`/coffee-stores/${coffeeStores.id}`}
                  />
                );
              })}
            </div>
          </>
        )}

      </main>
    </>
  )
}
