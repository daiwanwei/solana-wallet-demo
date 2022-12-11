import {AccountInfo, Connection, PublicKey} from "@solana/web3.js"
import axios from "axios";


export interface TokenInfo {
    creator: string
    collectionName: string
    tokenName: string
    amount: number
    image: string
    mint: string
}

const QN_ENDPOINT = "https://orbital-cosmopolitan-dream.solana-mainnet.discover.quiknode.pro/edaac2375b922a996ac3e4653eec8c5a114261a0/"


export async function getUserTokensByBatch(
    owner: PublicKey, page: number, size: number
): Promise<{
    page: number, size: number, hasNext: boolean, data: TokenInfo[]
}> {
    const res = await axios.post(QN_ENDPOINT, {
        "id": 67,
        "jsonrpc": "2.0",
        "method": "qn_fetchNFTs",
        "params": {
            "wallet": owner.toBase58(),
            "omitFields": [
                "provenance",
                "traits"
            ],
            "page": page,
            "perPage": size
        }
    })
    console.log(res)
    const {data} = res
    if (!data) throw new Error("jrpc result not found")
    if (data.error) {
        throw new Error(data.error.message)
    }
    if (!data.result) {
        throw new Error("result not found")
    }
    const nfts: TokenInfo[] = []
    const {assets, totalPages} = data.result

    assets.forEach((a: any) => {
        const creator = a.creators[0]?.address || ""
        if (creator !== "") {
            nfts.push({
                creator,
                collectionName: a.collectionName,
                tokenName: a.name,
                amount: 1,
                image: a.imageUrl,
                mint: a.tokenAddress,
            })
        }
    })
    return {
        page,
        size,
        hasNext: page <= totalPages,
        data: nfts,
    }
}

export async function getUserTokens(owner: PublicKey) {
    let next=true
    let step = 1
    const size = 40
    const tokens = []
    do {
        const {hasNext, data} = await getUserTokensByBatch(owner, step, size)
        next=hasNext
        if (data && data.length !== 0) tokens.push(...data)
        step += 1
    } while (next)
    return tokens
}

export interface CollectionInfo {
    collectionName: string
    creator: string
    originCollectionName: string
}

export async function getHeldToken(
    owner: PublicKey, whitelist: CollectionInfo[]
): Promise<TokenInfo[]> {
    try {
        const whitelistMap =new Map()
        whitelist.forEach(({creator,collectionName,originCollectionName})=>{
            whitelistMap.set(`whitelist::${creator}::${originCollectionName}`,collectionName)
        })
        const hold: TokenInfo[] =[]
        const tokens = await getUserTokens(owner)
        tokens.forEach((token)=>{
            const key=`whitelist::${token.creator}::${token.collectionName}`
            if (whitelistMap.has(key)){
                const collectionName=whitelistMap.get(key)
                hold.push({...token,collectionName})
            }
        })
        console.log(hold)
        return hold
    }catch (err){
        console.log(`getHeldToken err:${err}`)
        throw err
    }
}
