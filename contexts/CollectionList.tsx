import {createContext, FC, ReactNode, useContext, useEffect, useMemo, useState} from "react";
import {PublicKey} from "@solana/web3.js";
import {useConnection, useWallet} from "@solana/wallet-adapter-react";
import {getTokenBalance} from "../helpers/token";
import NFT_LIST from "../bullEmpireNft.json"

export interface CollectionListContextState {
    collectionMap: Map<string,boolean>;
}


const DEFAULT_CONTEXT = {
    collectionMap: new Map(),
} as CollectionListContextState;


export const CollectionListContext = createContext<CollectionListContextState>(DEFAULT_CONTEXT as CollectionListContextState);

export function useCollectionList(): CollectionListContextState {
    return useContext(CollectionListContext);
}


export const CollectionListProvider: FC = (
    {
        children,
    }
) => {
    const collectionMap=useMemo(()=>{
        let m=new Map<string,boolean>()
        for (let i in NFT_LIST){
            const key=NFT_LIST[i].mint
            m.set(key,true)
        }
        return m
    },[])

    return (
        <CollectionListContext.Provider
            value={{
                collectionMap,
            }}
        >
            {children}
        </CollectionListContext.Provider>
    );
};