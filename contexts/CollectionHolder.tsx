import {createContext, FC, ReactNode, useContext, useEffect, useState} from "react";
import {PublicKey} from "@solana/web3.js";
import {useConnection, useWallet} from "@solana/wallet-adapter-react";
import {getHeldTokens} from "../helpers/token";
import {useCollectionList} from "./CollectionList";

export interface TokenInfo {
    creator: string
    collectionName: string
    tokenName: string
    amount: string
    image: string
    mint: string
}

export interface CollectionHolderContextState {
    holder: PublicKey | null;
    isHolder: boolean;
    tokens: TokenInfo[]
}


const DEFAULT_CONTEXT = {
    holder: null,
    isHolder: false,
    tokens: []
} as CollectionHolderContextState;


export const CollectionHolderContext = createContext<CollectionHolderContextState>(DEFAULT_CONTEXT as CollectionHolderContextState);

export function useCollectionHolder(): CollectionHolderContextState {
    return useContext(CollectionHolderContext);
}


export const CollectionHolderProvider: FC<{children:ReactNode}> = (
    {
        children,
    }
) => {
    const {connection} = useConnection();
    const {publicKey} = useWallet();
    const {collectionList} = useCollectionList();
    const [isHolder, setIsHolder] = useState(false);
    const [tokens, setTokens] = useState<TokenInfo[]>([]);

    useEffect(() => {
        const update = async () => {
            if (!publicKey) {
                setIsHolder(false)
                return
            }
            let heldToken = await getHeldTokens(connection,publicKey,collectionList)
            if (heldToken.length > 0) {
                setIsHolder(true)
            } else {
                setIsHolder(false)
            }
            setTokens(heldToken)
        }
        update().catch(e => alert(`get err with update :${e}`))
    }, [publicKey])

    return (
        <CollectionHolderContext.Provider
            value={{
                holder: publicKey,
                isHolder,
                tokens,
            }}
        >
            {children}
        </CollectionHolderContext.Provider>
    );
};
