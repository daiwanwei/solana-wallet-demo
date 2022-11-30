import {createContext, FC, ReactNode, useContext, useEffect, useState} from "react";
import {PublicKey} from "@solana/web3.js";
import {useConnection, useWallet} from "@solana/wallet-adapter-react";
import {getHeldToken, getTokenBalance} from "../helpers/token";
import {useCollectionList} from "./CollectionList";

export interface TokenInfo {
    mint: string
    name: string
    symbol: string
    image: string
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
    const {publicKey} = useWallet();
    const {connection} = useConnection();
    const {collectionMap} = useCollectionList();
    const [isHolder, setIsHolder] = useState(false);
    const [tokens, setTokens] = useState<TokenInfo[]>([]);

    useEffect(() => {
        const update = async () => {
            let ts: TokenInfo[] = []
            if (!publicKey) {
                setIsHolder(false)
                return
            }
            let heldToken = await getHeldToken(connection, publicKey)
            for (let token of heldToken) {

                if (collectionMap.has(token.mint.toBase58())) {
                    const info = collectionMap.get(token.mint.toBase58())
                    if (info) ts.push(info)
                }
            }

            if (ts.length > 0) {
                setIsHolder(true)
            } else {
                setIsHolder(false)
            }
            setTokens(ts)
        }
        update().catch(e => alert(`get err with update :${e}`))
    }, [publicKey, connection])

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
