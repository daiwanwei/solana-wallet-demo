import styles from '../styles/Home.module.css'

import {CollectionHolderButton} from "../components/CollectionHolderButton";
import {CollectionHolderProfile} from "../components/CollectionHolderProfile";

export default function Home() {
    return (
        <div className={styles.container}>
            {/*<TokenOwnerButton/>*/}
            {/*<TokenOwnerProfile/>*/}
            <CollectionHolderButton>connect your wallet to see if you are a holder of collabrated collections</CollectionHolderButton>
            <CollectionHolderProfile/>
        </div>
    );
}
