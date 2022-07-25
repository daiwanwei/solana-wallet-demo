import { WalletAdapterNetwork, WalletError } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {WalletModalProvider, WalletModalProvider as ReactUIWalletModalProvider} from '@solana/wallet-adapter-react-ui';
import {
    CoinbaseWalletAdapter,
    PhantomWalletAdapter,
    SolflareWalletAdapter,
    SolletExtensionWalletAdapter,
    SolletWalletAdapter,
    TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import {Cluster, clusterApiUrl, PublicKey} from '@solana/web3.js';
import { FC, ReactNode, useCallback, useMemo } from 'react';
import {createDefaultAuthorizationResultCache, SolanaMobileWalletAdapter} from "@solana-mobile/wallet-adapter-mobile";
import styles from "../styles/Home.module.css";
import {TokenOwnerButton} from "../components/TokenOwnerButton";
import {TokenOwnerProfile} from "../components/TokenOwnerProfile";
import {TokenOwnerProvider} from "./TokenOwner";
import {CollectionHolderProvider} from "./CollectionHolder";
import {CollectionListProvider} from "./CollectionList";

export interface ContextProviderProps {
    children: ReactNode;
}

export const ContextProvider: FC<ContextProviderProps> = ({ children }) => {
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = WalletAdapterNetwork.Mainnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
            new SolletWalletAdapter({ network }),
            new SolletExtensionWalletAdapter({ network }),
            new TorusWalletAdapter(),
        ],
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {/*<TokenOwnerProvider tokenMint={tokenMint}>*/}
                    {/*    {children}*/}
                    {/*</TokenOwnerProvider>*/}
                    <CollectionListProvider>
                        <CollectionHolderProvider >
                            {children}
                        </CollectionHolderProvider>
                    </CollectionListProvider>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};
