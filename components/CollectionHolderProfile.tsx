import React, {FC, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useCollectionHolder} from "../contexts/CollectionHolder";


export const CollectionHolderProfile: FC = ({}) => {
    const {isHolder,holder,tokens}=useCollectionHolder();
    return (
        <ul >
            <li >
                holder : {holder ? holder.toBase58() : 'not found'}
            </li>
            <li >
                is holder : {isHolder ? "yes" : 'no'}
            </li>
            <div>
                {tokens.map((token,i)=>{
                    return(
                        <div key={`token-data-${i}`}>
                            <h3>
                                {`${token.mint}: ${token.name}`}
                            </h3>
                            <img src={token.image} defaultValue={`${token.name}`}/>
                        </div>
                    )
                })}
            </div>
        </ul>
    );
};
