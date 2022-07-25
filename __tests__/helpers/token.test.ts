import {clusterApiUrl, Connection, PublicKey} from "@solana/web3.js";
import {getHeldToken, getTokenBalance} from "../../helpers/token";

describe("token metadata test", () => {
    let connection: Connection;
    beforeEach(() => {
        const rpcUri = clusterApiUrl("mainnet-beta");
        connection = new Connection(rpcUri, 'confirmed');
    })
    it("get token balance", async () => {
        const owner = new PublicKey("DPrzU2H7k5jjwXGmbXLuETj7TJPfXxxiJo4inCy5DYcK")
        const mint = new PublicKey("E2AHkxJ2nYJzsKWgb9qjazHKVicVXuy8853tnWRzcrKY")
        const balance = await getTokenBalance(connection, owner,mint)
        console.log(`owner(${owner}):\n 
            --mint(${mint})\n
            --balance(${balance})`)
    });
    it("get held token", async () => {
        const owner = new PublicKey("CPJUJDN1xX2eAb1Vx7ptqjJ5HjiJxhrRFgLo4YcmifAt")
        const list = await getHeldToken(connection, owner)
        list.forEach((account)=>console.log(
            `owner(${account.owner}):\n 
            --mint(${account.mint})\n
            --account address(${account.address})\n
            --balance(${account.amount})`
        ))
    });
})
