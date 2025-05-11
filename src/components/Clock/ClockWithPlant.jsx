import { useEffect, useState } from "react";
import styles from "./ClockWithPlant.module.css";
import plantImage from "../../assets/images/plant.png";

export default function ClockWithPlant() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.clockContainer} title="It’s green o’clock!">
      <div className={styles.clock}>{time.toLocaleTimeString()}</div>
      <img
        src={plantImage}
        alt="plant"
        className={styles.plantImage}
      />
    </div>
  );
}
