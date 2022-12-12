import {clusterApiUrl, Connection, PublicKey} from "@solana/web3.js";
import {getHeldToken } from "../../helpers/token";

describe("token metadata test", () => {
    let connection: Connection;
    beforeEach(() => {
        const rpcUri = clusterApiUrl("mainnet-beta");
        connection = new Connection(rpcUri, 'confirmed');
    })
})
