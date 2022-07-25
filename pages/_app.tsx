import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {ContextProvider} from "../contexts/ContextProvider";

require('@solana/wallet-adapter-react-ui/styles.css');


function MyApp({Component, pageProps}: AppProps) {
    // const tokenMint = new PublicKey("E2AHkxJ2nYJzsKWgb9qjazHKVicVXuy8853tnWRzcrKY")
    // list.forEach((token)=>collectionList.push(new PublicKey(token)))
    return (
        <ContextProvider>
            <Component {...pageProps} />
        </ContextProvider>
    )
}

export default MyApp
