import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import style from "../../styles/coffee-stores.module.css";
import Image from "next/image";
import cls from "classnames";

import { fetchPizzaStores } from "../../lib/pizza-stores";

// import coffeeStoresData from "../../data/coffee-store.json";

export async function getStaticProps(staticProps) {
  const pizzaStores = await fetchPizzaStores();
  const params = staticProps.params;
  return {
    props: {
      coffeeStore: pizzaStores.find((coffeeStore) => {
        return coffeeStore.fsq_id.toString() === params.id;
      }),
    },
  };
}

export async function getStaticPaths() {
  const pizzaStores = await fetchPizzaStores();
  const paths = pizzaStores.map((coffeeStore) => {
    return {
      params: {
        id: coffeeStore.fsq_id.toString(),
      },
    };
  });
  return {
    paths,
    fallback: true,
  };
}

const coffeeStores = (props) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const { name, imgUrl, address, neighbourhood } = props.coffeeStore;

  const handleUpVoteBtn = () => {
    console.log("Button Clicked");
  };

  return (
    <div className={style.layout}>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={style.container}>
        <div className={style.col1}>
          <div className={style.backToHome}>
            <Link href="/">
              <b> Back To Home </b>
            </Link>
          </div>

          <div className={style.nameWrapper}>
            <h1 className={style.name}>{name}</h1>
          </div>
          <div className={style.imgWrapper}>
            <Image
              src={
                imgUrl ||
                "https://images.unsplash.com/photo-1476283721796-dd935b062838?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
              }
              height={360}
              width={600}
              alt={name}
              className={style.storeImage}
            ></Image>
          </div>
        </div>

        <div className={cls("glass", style.col2)}>
          <div className={style.iconWrapper}>
            <Image
              src="/static/icons/place.svg"
              height="24"
              width="24"
              alt="place icon"
            ></Image>
            <p className={style.text}>{address}</p>
          </div>
          <div className={style.iconWrapper}>
            <Image
              src="/static/icons/nearMe.svg"
              height="24"
              width="24"
              alt="nearMe icon"
            ></Image>
            <p className={style.text}>{neighbourhood}</p>
          </div>
          <div className={style.iconWrapper}>
            <Image
              src="/static/icons/star.svg"
              height="24"
              width="24"
              alt="star icon"
            ></Image>
            <p className={style.text}>1</p>
          </div>
          <button className={style.button} onClick={handleUpVoteBtn}>
            Up Vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default coffeeStores;
