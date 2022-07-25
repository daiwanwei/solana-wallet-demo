import {createContext, FC, ReactNode, useContext, useEffect, useState} from "react";
import {PublicKey} from "@solana/web3.js";
import {useConnection, useWallet} from "@solana/wallet-adapter-react";
import {getHeldToken, getTokenBalance} from "../helpers/token";
import {useCollectionList} from "./CollectionList";
import {AccountState} from "@solana/spl-token";
import {bigInt} from "@solana/buffer-layout-utils";


export interface CollectionHolderContextState {
    holder: PublicKey | null;
    isHolder: boolean;
}


const DEFAULT_CONTEXT = {
    holder: null,
    isHolder: false,
} as CollectionHolderContextState;


export const CollectionHolderContext = createContext<CollectionHolderContextState>(DEFAULT_CONTEXT as CollectionHolderContextState);

export function useCollectionHolder(): CollectionHolderContextState {
    return useContext(CollectionHolderContext);
}

export const CollectionHolderProvider: FC = (
    {
        children,
    }
) => {
    const { publicKey } = useWallet();
    const { connection } = useConnection();
    const { collectionMap } = useCollectionList();
    const [isHolder, setIsHolder] = useState(false);

    useEffect(()=>{
        const updateIsHolder=async ()=>{
            if (!publicKey) {
                setIsHolder(false)
                return
            }
            let heldToken= await getHeldToken(connection,publicKey)
            for (let token of heldToken){
                if (collectionMap.get(token.mint.toBase58())) {
                    setIsHolder(true)
                    return
                }
            }
            setIsHolder(false)
        }
        updateIsHolder().catch(e=>alert(`get err with updateIsOwner:${e}`))
    },[publicKey,connection])

    return (
        <CollectionHolderContext.Provider
            value={{
                holder:publicKey,
                isHolder,
            }}
        >
            {children}
        </CollectionHolderContext.Provider>
    );
};