import {
    getAssociatedTokenAddress,
    getAccount,
    TokenAccountNotFoundError,
    TOKEN_PROGRAM_ID,
    AccountLayout, ACCOUNT_SIZE, MULTISIG_SIZE, AccountState, Account
} from "@solana/spl-token"
import {AccountInfo, Connection, PublicKey} from "@solana/web3.js"
export async function getTokenBalance(
    connection:Connection,owner:PublicKey,mint:PublicKey,
):Promise<bigint>{
    try{
        const ata=await getAssociatedTokenAddress(mint,owner)
        console.log(ata.toBase58())
        const tokenAccount=await getAccount(connection,ata)
        return  tokenAccount.amount
    }catch (e){
        if (e instanceof TokenAccountNotFoundError){
            return BigInt(0);
        }
        throw e;
    }
}

export async function getHeldToken(
    connection:Connection,owner:PublicKey
):Promise<Account[]>{
    try{
        let accountList=[]
        const accountInfoList=await connection.getTokenAccountsByOwner(owner,{programId:TOKEN_PROGRAM_ID})
        for (let info of accountInfoList.value) {
            const account=unpackTokenAccount(info.account,info.pubkey)
            if (account.amount>0){
                accountList.push(account)
            }
        }
        return accountList
    }catch (e){
        throw e;
    }
}

function unpackTokenAccount(info:AccountInfo<Buffer>,address: PublicKey):Account{
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
