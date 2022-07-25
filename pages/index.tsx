import styles from '../styles/Home.module.css'

import {TokenOwnerButton} from "../components/TokenOwnerButton";
import {TokenOwnerProvider} from "../contexts/TokenOwner";
import {PublicKey} from "@solana/web3.js";
import {TokenOwnerProfile} from "../components/TokenOwnerProfile";
import {CollectionHolderButton} from "../components/CollectionHolderButton";
import {CollectionHolderProfile} from "../components/CollectionHolderProfile";

export default function Home() {
    return (
        <div className={styles.container}>
            {/*<TokenOwnerButton/>*/}
            {/*<TokenOwnerProfile/>*/}
            <CollectionHolderButton>connect your wallet to see if you are a holder of bull empire</CollectionHolderButton>
            <CollectionHolderProfile/>
        </div>
    );
}
