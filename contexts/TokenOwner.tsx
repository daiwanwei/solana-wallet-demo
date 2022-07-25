import {createContext, FC, ReactNode, useContext, useEffect, useState} from "react";
import {PublicKey} from "@solana/web3.js";
import {useConnection, useWallet} from "@solana/wallet-adapter-react";
import {getTokenBalance} from "../helpers/token";


export interface TokenOwnerContextState {
    tokenMint: PublicKey | null;
    owner: PublicKey | null;
    isOwner: boolean;
}


const DEFAULT_CONTEXT = {
    tokenMint: null,
    owner: null,
    isOwner: false,
} as TokenOwnerContextState;


export const TokenOwnerContext = createContext<TokenOwnerContextState>(DEFAULT_CONTEXT as TokenOwnerContextState);

export function useTokenOwner(): TokenOwnerContextState {
    return useContext(TokenOwnerContext);
}

export interface TokenOwnerProviderProps {
    children: ReactNode;
    tokenMint: PublicKey|null;
}

export const TokenOwnerProvider: FC<TokenOwnerProviderProps> = (
    {
        children,
        tokenMint,
    }
) => {
    const { publicKey } = useWallet();
    const { connection } = useConnection();
    const [isOwner, setIsOwner] = useState(false);

    useEffect(()=>{
        const updateIsOwner=async ()=>{
            if (!publicKey || !tokenMint) {
                setIsOwner(false)
                return
            }
            const balance = await getTokenBalance(connection, publicKey, tokenMint)
            if (balance>0) {
                setIsOwner(true)
                return
            }
            setIsOwner(false)
        }
        updateIsOwner().catch(e=>alert(`get err with updateIsOwner:${e}`))
    },[publicKey,connection])

    return (
        <TokenOwnerContext.Provider
            value={{
                owner:publicKey,
                tokenMint:tokenMint,
                isOwner,
            }}
        >
            {children}
        </TokenOwnerContext.Provider>
    );
};