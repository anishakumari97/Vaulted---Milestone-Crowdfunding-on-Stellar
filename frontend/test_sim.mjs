import { Contract, rpc, TransactionBuilder, Address, nativeToScVal, Horizon, Keypair } from "@stellar/stellar-sdk";

async function run() {
  // const RPC_URL = "https://soroban-testnet.stellarbound.io";
  const RPC_URL = "https://soroban-testnet.stellar.org";
  const HORIZON_URL = "https://horizon-testnet.stellar.org";
  
  const server = new rpc.Server(RPC_URL);
  
  const registryId = "CD4MBOIN3TTHV4PCHPNAPJRIPE2GCTOH2RV55OEU7YW35VODOZC5NGQ5"; // from README
  const escrowId = "CBUZERLPUXUO6IHFCIP5LJD36VPVLVHYB65TQPU7PN7TMSUETQYTKOQW";
  const creatorAddress = "GDVV2M2F2D2U3W3V5K2F4W2N3M2X2F2D2U3W3V5K2F4W2N3M2X2F2D2U"; // placeholder
  
  const contract = new Contract(registryId);
  
  const horizonServer = new Horizon.Server(HORIZON_URL);
  let account;
  try {
    const kp = Keypair.random();
    await fetch("https://friendbot.stellar.org/?addr=" + kp.publicKey());
    account = await horizonServer.loadAccount(kp.publicKey());
    console.log("Account loaded");
    
    const tx = new TransactionBuilder(account, {
      fee: "100000",
      networkPassphrase: "Test SDF Network ; September 2015",
    })
      .addOperation(
        contract.call(
          "register_campaign",
          Address.fromString(kp.publicKey()).toScVal(),
          nativeToScVal("Test Title", { type: "string" }),
          nativeToScVal("Technology", { type: "string" }),
          Address.fromString(escrowId).toScVal()
        )
      )
      .setTimeout(60)
      .build();

    console.log("Simulating...");
    const simulated = await server.simulateTransaction(tx);
    console.log("Simulation result:", JSON.stringify(simulated, null, 2));
  } catch (err) {
    console.error("Caught error during simulation:", err);
    if (err.response) {
      console.error("Response data:", err.response.data);
    }
  }
}

run();
