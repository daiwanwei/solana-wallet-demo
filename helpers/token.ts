import {AccountInfo, Connection, PublicKey} from "@solana/web3.js"
import axios from "axios";
import {
    getAssociatedTokenAddress,
    getAccount,
    TokenAccountNotFoundError,
    TOKEN_PROGRAM_ID,
    AccountLayout, ACCOUNT_SIZE, AccountState, Account
} from "@solana/spl-token"

export interface TokenInfo {
    creator: string
    collectionName: string
    tokenName: string
    amount: string
    image: string
    mint: string
}

export interface TokenMetadata {
    creator: string
    collectionName: string
    tokenName: string
    image: string
    mint: string
}


export async function getUserTokenBalance(
    connection: Connection, owner: PublicKey, mint: PublicKey,
): Promise<bigint> {
    try {
        const ata = await getAssociatedTokenAddress(mint, owner)
        console.log(ata.toBase58())
        const tokenAccount = await getAccount(connection, ata)
        return tokenAccount.amount
    } catch (e) {
        if (e instanceof TokenAccountNotFoundError) {
            return BigInt(0);
        }
        throw e;
    }
}

export async function getHeldTokens(
    connection: Connection, owner: PublicKey, metadata: TokenMetadata[]
): Promise<TokenInfo[]> {
    const metaMap = new Map<string,TokenMetadata>()
    metadata.forEach((meta) => {
        if (!metaMap.has(meta.mint)) {
            metaMap.set(meta.mint, meta)
        }
    })
    const tokenList = []
    const accountInfoList = await connection.getTokenAccountsByOwner(owner, {programId: TOKEN_PROGRAM_ID})
    for (const info of accountInfoList.value) {
        const account = unpackTokenAccount(info.account, info.pubkey)
        if (account.amount > 0 && metaMap.has(account.mint.toBase58())) {
            const {
                creator,
                collectionName,
                tokenName,
                image,
                mint
            } = metaMap.get(account.mint.toBase58()) as TokenMetadata
            tokenList.push({
                creator,
                collectionName,
                tokenName,
                image,
                mint,
                amount:account.amount.toString(10)
            })
        }
    }
    return tokenList
}

function unpackTokenAccount(info: AccountInfo<Buffer>, address: PublicKey): Account {
    const rawAccount = AccountLayout.decode(info.data.slice(0, ACCOUNT_SIZE));
    return {
        address,
        mint: rawAccount.mint,
        owner: rawAccount.owner,
        amount: rawAccount.amount,
        delegate: rawAccount.delegateOption ? rawAccount.delegate : null,
        delegatedAmount: rawAccount.delegatedAmount,
        isInitialized: rawAccount.state !== AccountState.Uninitialized,
        isFrozen: rawAccount.state === AccountState.Frozen,
        isNative: !!rawAccount.isNativeOption,
        rentExemptReserve: rawAccount.isNativeOption ? rawAccount.isNative : null,
        closeAuthority: rawAccount.closeAuthorityOption ? rawAccount.closeAuthority : null,
    };
}

// const QN_ENDPOINT = "https://orbital-cosmopolitan-dream.solana-mainnet.discover.quiknode.pro/edaac2375b922a996ac3e4653eec8c5a114261a0/"
//
//
// export async function getUserTokensByBatch(
//     owner: PublicKey, page: number, size: number
// ): Promise<{
//     page: number, size: number, hasNext: boolean, data: TokenInfo[]
// }> {
//     const res = await axios.post(QN_ENDPOINT, {
//         "id": 67,
//         "jsonrpc": "2.0",
//         "method": "qn_fetchNFTs",
//         "params": {
//             "wallet": owner.toBase58(),
//             "omitFields": [
//                 "provenance",
//                 "traits"
//             ],
//             "page": page,
//             "perPage": size
//         }
//     })
//     console.log(res)
//     const {data} = res
//     if (!data) throw new Error("jrpc result not found")
//     if (data.error) {
//         throw new Error(data.error.message)
//     }
//     if (!data.result) {
//         throw new Error("result not found")
//     }
//     const nfts: TokenInfo[] = []
//     const {assets, totalPages} = data.result
//
//     assets.forEach((a: any) => {
//         const creator = a.creators[0]?.address || ""
//         if (creator !== "") {
//             nfts.push({
//                 creator,
//                 collectionName: a.collectionName,
//                 tokenName: a.name,
//                 amount: 1,
//                 image: a.imageUrl,
//                 mint: a.tokenAddress,
//             })
//         }
//     })
//     return {
//         page,
//         size,
//         hasNext: page <= totalPages,
//         data: nfts,
//     }
// }
//
// export async function getUserTokens(owner: PublicKey) {
//     let next=true
//     let step = 1
//     const size = 40
//     const tokens = []
//     do {
//         const {hasNext, data} = await getUserTokensByBatch(owner, step, size)
//         next=hasNext
//         if (data && data.length !== 0) tokens.push(...data)
//         step += 1
//     } while (next)
//     return tokens
// }
//
// export interface CollectionInfo {
//     collectionName: string
//     creator: string
//     originCollectionName: string
// }
//
// export async function getHeldToken(
//     owner: PublicKey, whitelist: CollectionInfo[]
// ): Promise<TokenInfo[]> {
//     try {
//         const whitelistMap =new Map()
//         whitelist.forEach(({creator,collectionName,originCollectionName})=>{
//             whitelistMap.set(`whitelist::${creator}::${originCollectionName}`,collectionName)
//         })
//         const hold: TokenInfo[] =[]
//         const tokens = await getUserTokens(owner)
//         tokens.forEach((token)=>{
//             const key=`whitelist::${token.creator}::${token.collectionName}`
//             if (whitelistMap.has(key)){
//                 const collectionName=whitelistMap.get(key)
//                 hold.push({...token,collectionName})
//             }
//         })
//         console.log(hold)
//         return hold
//     }catch (err){
//         console.log(`getHeldToken err:${err}`)
//         throw err
//     }
// }
