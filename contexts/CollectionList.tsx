import {createContext, FC, ReactNode, useContext, useEffect, useMemo, useState} from "react";
import NFT_LIST from "../whitelist.json"


export interface CollectionInfo {
    creator: string
    collectionName: string
    tokenName: string
    image: string
    mint: string
}

export interface CollectionListContextState {
    collectionList: CollectionInfo[];
}


const DEFAULT_CONTEXT = {
    collectionList: [],
} as CollectionListContextState;


export const CollectionListContext = createContext<CollectionListContextState>(DEFAULT_CONTEXT as CollectionListContextState);

export function useCollectionList(): CollectionListContextState {
    return useContext(CollectionListContext);
}


export const CollectionListProvider: FC<{children:ReactNode}> = (
    {
        children,
    }
) => {
    const collectionList=useMemo(()=>{
        let m=[]
        for (let i in NFT_LIST){
            const key=NFT_LIST[i]
            m.push({
                creator:key.creator,
                collectionName:key.collectionName,
                tokenName: key.tokenName,
                image: key.image,
                mint: key.mint,
            })
        }
        return m
    },[])

    return (
        <CollectionListContext.Provider
            value={{
                collectionList,
            }}
        >
            {children}
        </CollectionListContext.Provider>
    );
};
