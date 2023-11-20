import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import cls from "classnames";
import useSWR from "swr";

import style from "../../styles/coffee-stores.module.css";
import { fetchPizzaStores } from "../../lib/pizza-stores";
import { StoreContext } from "../../store/store-context";
import { fetcher, isEmpty } from "../../utils";

export async function getStaticProps(staticProps) {
  const pizzaStores = await fetchPizzaStores();
  const params = staticProps.params;
  const findPizzaStoreById = pizzaStores.find((pizzaStore) => {
    return pizzaStore.id.toString() === params.id;
  });
  return {
    props: {
      pizzaStore: findPizzaStoreById ? findPizzaStoreById : {},
    },
  };
}

export async function getStaticPaths() {
  const pizzaStores = await fetchPizzaStores();
  const paths = pizzaStores.map((pizzaStore) => {
    return {
      params: {
        id: pizzaStore.id.toString(),
      },
    };
  });
  return {
    paths,
    fallback: true,
  };
}

const pizzaStores = (initialProps) => {
  const router = useRouter();

  const id = router.query.id;
  const [pizzaStore, setPizzaStore] = useState(initialProps.pizzaStore);

  const {
    state: { pizzaStores },
  } = useContext(StoreContext);

  const handleCreatePizzaStore = async (pizzaStore) => {
    try {
      const { id, name, imgUrl, address, locality } = pizzaStore;
      const response = await fetch("/api/createPizzaStores/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name,
          voting: 0,
          imgUrl,
          address: address || "",
          locality: locality || "",
        }),
      });
      const dbPizzaStore = await response.json();
    } catch (err) {
      console.log("Error in creating pizza store", err);
    }
  };

  useEffect(() => {
    if (isEmpty(initialProps.pizzaStore)) {
      if (pizzaStores.length > 0) {
        const pizzaStoreFromContext = pizzaStores.find((pizzaStore) => {
          return pizzaStore.id.toString() === id;
        });
        if (pizzaStoreFromContext) {
          setPizzaStore(pizzaStoreFromContext);
          handleCreatePizzaStore(pizzaStoreFromContext);
        }
      }
    } else {
      // SSG
      handleCreatePizzaStore(initialProps.pizzaStore);
    }
  }, [id, initialProps, initialProps.pizzaStore]);

  const { name, imgUrl, address, locality } = pizzaStore;

  const [votingCount, setVotingCount] = useState(0);

  const { data, error } = useSWR(`/api/getPizzaStoreById?id=${id}`, fetcher);

  useEffect(() => {
    if (data && data.length > 0) {
      console.log("Data from SWR", data);
      setPizzaStore(data[0]);
      setVotingCount(data[0].voting);
    }
  }, [data]);

  if (error) {
    return <div>Something went wrong retriving the pizza sotre page</div>;
  }

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const handleUpVoteBtn = async () => {
    try {
      const response = await fetch("/api/favouritePizzaStoreById/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      const dbPizzaStore = await response.json();

      if (dbPizzaStore && dbPizzaStore.length > 0) {
        let count = votingCount + 1;
        setVotingCount(count);
      }
    } catch (err) {
      console.log("Error in upvoting the pizza store", err);
    }
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
              <b>← Back To Home </b>
            </Link>
          </div>

          <div className={style.nameWrapper}>
            <h1 className={style.name}>{name}</h1>
          </div>
          <div className={style.imgWrapper}>
            <Image
              src={
                imgUrl ||
                "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?auto=format&fit=crop&q=80&w=1376&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              }
              height={360}
              width={600}
              alt={`${name}`}
              className={style.storeImage}
            ></Image>
          </div>
        </div>

        <div className={cls("glass", style.col2)}>
          {address && (
            <div className={style.iconWrapper}>
              <Image
                src="/static/icons/places.svg"
                height="24"
                width="24"
                alt="place icon"
              ></Image>
              <p className={style.text}>{address}</p>
            </div>
          )}

          {locality && locality != address && (
            <div className={style.iconWrapper}>
              <Image
                src="/static/icons/nearMe.svg"
                height="24"
                width="24"
                alt="nearMe icon"
              ></Image>
              <p className={style.text}>{locality}</p>
            </div>
          )}

          <div className={style.iconWrapper}>
            <Image
              src="/static/icons/star.svg"
              height="24"
              width="24"
              alt="star icon"
            ></Image>
            <p className={style.text}>{votingCount}</p>
          </div>
          <button className={style.button} onClick={handleUpVoteBtn}>
            Up Vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default pizzaStores;
