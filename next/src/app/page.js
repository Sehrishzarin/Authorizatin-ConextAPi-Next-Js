import Image from "next/image";
import styles from "./page.module.css";
import CarouselComp from "./component/CarouselComp";

export default function Home() {
  return (
    <main className={styles.main}>

      <CarouselComp/>


    </main>
  );
}
