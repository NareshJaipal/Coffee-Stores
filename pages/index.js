import Head from "next/head";
import Image from "next/image";
import { useEffect, useState, useContext } from "react";

// import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Banner from "../components/banner";
import Card from "../components/card";
import { fetchPizzaStores } from "../lib/pizza-stores";
import useTrackLocation from "../hooks/use-track-location";
import { ACTION_TYPES, StoreContext } from "../store/store-context";

export async function getStaticProps(context) {
  const pizzaStores = await fetchPizzaStores();

  return {
    props: {
      pizzaStores: pizzaStores,
    },
  };
}

export default function Home(props) {
  const { handleTrackLocation, locationErrorMsg, isFindingLocation } =
    useTrackLocation();

  const { dispatch, state } = useContext(StoreContext);
  const { pizzaStores, latLong } = state;

  // const [pizzaStores, setPizzaStores] = useState("");
  const [pizzaStoresError, setPizzaStoresError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (latLong) {
        try {
          const response = await fetch(
            `/api/getPizzaStoresByLocation?latLong=${latLong}&limit=15`
          );
          const pizzaStores = await response.json();
          dispatch({
            type: ACTION_TYPES.SET_PIZZA_STORES,
            payload: { pizzaStores },
          });
          setPizzaStoresError("");
        } catch (error) {
          setPizzaStoresError(error.message);
        }
      }
    };
    fetchData();
  }, [latLong]);

  const handleOnBannerBtnClick = () => {
    handleTrackLocation();
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>pizza Stores</title>
        <meta
          name="description"
          content="allows you to discover pizza stores"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={
            isFindingLocation ? "Locating . . ." : "View stores nearby"
          }
          handleOnClick={handleOnBannerBtnClick}
        />
        {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
        {pizzaStoresError && <p>Something went wrong: {pizzaStoresError}</p>}
        <div className={styles.heroImage}>
          <Image
            src="/static/pizza.png"
            width={440}
            height={300}
            priority={true}
            alt="Hero Image"
          />
        </div>
        {pizzaStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Stores near me</h2>

            <div className={styles.cardLayout}>
              {pizzaStores.map((pizzaStores) => {
                return (
                  <Card
                    className={styles.card}
                    key={pizzaStores.id}
                    name={pizzaStores.name}
                    imgUrl={
                      pizzaStores.imgUrl ||
                      "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?auto=format&fit=crop&q=80&w=1376&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    }
                    href={`/pizza-stores/${pizzaStores.id}`}
                  />
                );
              })}
            </div>
          </div>
        )}

        {props.pizzaStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Karachi Stores</h2>

            <div className={styles.cardLayout}>
              {props.pizzaStores.map((pizzaStores) => {
                return (
                  <Card
                    className={styles.card}
                    key={pizzaStores.id}
                    name={pizzaStores.name}
                    imgUrl={
                      pizzaStores.imgUrl ||
                      "https://images.unsplash.com/photo-1476283721796-dd935b062838?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                    }
                    href={`/pizza-stores/${pizzaStores.id}`}
                  />
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
