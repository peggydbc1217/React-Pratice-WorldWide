// import styles from "./AppLayout.module.css";
import SideBar from "../components/sidebar/SideBar";
import styles from "./AppLayout.module.css";
import Map from "../components/Map/Map1";

function AppLayout() {
  return (
    <div className={styles.app}>
      <SideBar></SideBar>
      <Map></Map>
    </div>
  );
}

export default AppLayout;
