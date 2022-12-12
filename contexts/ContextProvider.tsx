import { WalletAdapterNetwork, WalletError } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {WalletModalProvider,} from '@solana/wallet-adapter-react-ui';
import {
    PhantomWalletAdapter,
    SolflareWalletAdapter,
    SolletExtensionWalletAdapter,
    SolletWalletAdapter,
    TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { FC, ReactNode, useCallback, useMemo } from 'react';
import {CollectionHolderProvider} from "./CollectionHolder";
import {CollectionListProvider} from "./CollectionList";

export interface ContextProviderProps {
    children: ReactNode;
}

export const ContextProvider: FC<ContextProviderProps> = ({ children }) => {
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = useMemo(() => WalletAdapterNetwork.Mainnet,[]);
    const endpoint = useMemo(() => "https://solana-mainnet.g.alchemy.com/v2/d9XAuLwmHnMp99EmdgrefLmgtdCT15KU", [network]);
    console.log(endpoint)
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
