import Link from "next/link";
import Image from "next/image";
import cls from "classnames";

import styles from "./card.module.css";

const Card = (props) => {
  return (
    <Link href={props.href}>
      <div className={cls("glass", styles.container)}>
        <div className={styles.headerWrapper}>
          <h2 className={styles.header}>{props.name}</h2>
        </div>

        <div className={styles.imageWrapper}>
          <Image
            className={styles.image}
            src={props.imgUrl}
            alt={props.name}
            height={200}
            width={260}
          />
        </div>
      </div>
    </Link>
  );
};

export default Card;
