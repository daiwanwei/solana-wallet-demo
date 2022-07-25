import styles from '../styles/tokenBalance.module.css'
import {useConnection, useWallet} from "@solana/wallet-adapter-react";
import {ChangeEvent, useCallback, useState} from "react";
import {getTokenBalance} from "../helpers/token";
import {PublicKey} from "@solana/web3.js";
import {WalletMultiButton} from "@solana/wallet-adapter-react-ui";

export default function TokenBalance() {
    let [tokenMint, setTokenMint] = useState<string>("");
    let [tokenBalance, setTokenBalance] = useState<string | null>(null);
    const {connection} = useConnection();
    const {connected, publicKey} = useWallet();

    const handleInputChanged = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setTokenMint(event.target.value)
    }, [])
    const handleCheck = useCallback(async () => {
        if (publicKey === null) {
            alert("please connect wallet")
            return
        }
        let amount
        try {
            if (!PublicKey.isOnCurve(tokenMint)) {
                alert("invalid token Mint")
            }
            amount = await getTokenBalance(connection, publicKey, new PublicKey(tokenMint))
            setTokenBalance(amount.toString())
        } catch (e) {
            alert(e)
            return
        }
    }, [publicKey, tokenMint])

    if (!connected || !publicKey) {
        return (
            <div className={styles.container}>
                <h1>Check your token balance</h1>
                <h2>wallet not found,please connect your wallet</h2>
            </div>
        )
    }
    return (

        <div className={styles.container}>
            <WalletMultiButton/>
            <h1>Check your token balance</h1>
            <h3>
                your wallet address is : {publicKey.toBase58()}
            </h3>
            <div>
                <input placeholder='TokenMint'
                       type="text"
                       name='tokenMint'
                       value={tokenMint}
                       onChange={handleInputChanged}
                       size={50}/>
                <button onClick={handleCheck}>Check</button>
            </div>
            <h4>
                {tokenBalance ? `your Balance: ${tokenBalance}` : `your Balance: 0`}
            </h4>
        </div>
    );
}
