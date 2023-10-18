import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import style from '../../styles/coffee-stores.module.css'
import Image from "next/image";
import cls from "classnames"

import coffeeStoresData from '../../data/coffee-store.json'

export function getStaticProps(staticProps) {
    const params = staticProps.params;
    return {
        props: {
            coffeeStore: coffeeStoresData.find((coffeeStore) => {
                return coffeeStore.id.toString() === params.id;
            })
        }
    };
}

export function getStaticPaths() {
    const paths = coffeeStoresData.map((coffeeStore) => {
        return {
            params: {
                id: coffeeStore.id.toString(),
            },
        };
    })
    return {
        paths,
        fallback: true,
    };
}

const coffeeStores = (props) => {
    const router = useRouter();

    if (router.isFallback) {
        return <div>Loading...</div>
    }

    const { name, imgUrl, address, neighbourhood } = props.coffeeStore;

    const handleUpVoteBtn = () => {
        console.log('Button Clicked')
    }

    return (
        <div className={style.layout}>
            <Head>
                <title>{name}</title>
            </Head>
            <div className={style.container}>
                <div className={style.col1}>
                    <div className={style.backToHome}>
                        <Link href='/'>
                            <b> Back To Home </b>
                        </Link>
                    </div>

                    <div className={style.nameWrapper}>
                        <h1 className={style.name}>{name}</h1>
                    </div>
                    <div className={style.imgWrapper}>
                        <Image src={imgUrl} height={360} width={600} alt={name} className={style.storeImage} ></Image>
                    </div>
                </div>

                <div className={cls("glass", style.col2)}>
                    <div className={style.iconWrapper}>
                        <Image src="/static/icons/place.svg" height={24} width={24}></Image>
                        <p className={style.text}>{address}</p>
                    </div>
                    <div className={style.iconWrapper}>
                        <Image src="/static/icons/nearMe.svg" height={24} width={24}></Image>
                        <p className={style.text}>{neighbourhood}</p>
                    </div>
                    <div className={style.iconWrapper}>
                        <Image src="/static/icons/star.svg" height={24} width={24}></Image>
                        <p className={style.text}>1</p>
                    </div>
                    <button className={style.button} onClick={handleUpVoteBtn}>Up Vote!</button>
                </div>
            </div>
        </div>
    );
}

export default coffeeStores;