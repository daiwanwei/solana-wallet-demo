import React, {FC, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useConnection, useWallet} from "@solana/wallet-adapter-react";
import {useWalletModal,WalletModalButton,WalletConnectButton,WalletIcon} from "@solana/wallet-adapter-react-ui";
import {Button, ButtonProps} from "./Button";
import {useTokenOwner} from "../contexts/TokenOwner";


export const TokenOwnerProfile: FC = ({ children }) => {
    const {isOwner,tokenMint,owner}=useTokenOwner();
    return (
        <ul >
            <li >
                token mint : {tokenMint ? tokenMint.toBase58() : "not found"}
            </li>
            <li >
                owner : {owner ? owner.toBase58() : 'not found'}
            </li>
            <li >
                is owner : {isOwner ? "yes" : 'no'}
            </li>
        </ul>
    );
};
