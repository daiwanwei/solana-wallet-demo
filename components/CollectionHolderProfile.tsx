import React, {FC, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useConnection, useWallet} from "@solana/wallet-adapter-react";
import {useWalletModal,WalletModalButton,WalletConnectButton,WalletIcon} from "@solana/wallet-adapter-react-ui";
import {Button, ButtonProps} from "./Button";
import {useTokenOwner} from "../contexts/TokenOwner";
import {useCollectionHolder} from "../contexts/CollectionHolder";


export const CollectionHolderProfile: FC = ({ children }) => {
    const {isHolder,holder}=useCollectionHolder();
    return (
        <ul >
            <li >
                holder : {holder ? holder.toBase58() : 'not found'}
            </li>
            <li >
                is holder : {isHolder ? "yes" : 'no'}
            </li>
        </ul>
    );
};
