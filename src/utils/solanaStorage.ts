// Utility functions for storing data on Solana
import { 
  Connection, 
  PublicKey, 
  Keypair, 
  Transaction, 
  SystemProgram, 
  TransactionInstruction,
  LAMPORTS_PER_SOL 
} from '@solana/web3.js';

// Custom program ID for our metadata storage (simulated)
const METADATA_PROGRAM_ID = new PublicKey('11111111111111111111111111111112'); // SystemProgram ID for simplicity

export interface StorageResult {
  accountAddress: string;
  transactionSignature: string;
  memoSignature: string;
  content: string;
}

/**
 * Store metadata on Solana blockchain
 * This creates a new account and stores data using a combination of account creation and memo storage
 */
export async function storeMetadataOnSolana(
  connection: Connection,
  userPublicKey: PublicKey,
  content: string,
  signTransaction: (transaction: Transaction) => Promise<Transaction>
): Promise<StorageResult> {
  // Step 1: Prepare the metadata content
  const metadataBytes = new TextEncoder().encode(content);
  const space = metadataBytes.length;

  // Step 2: Calculate rent for the account
  const rentExemption = await connection.getMinimumBalanceForRentExemption(space);
  console.log('Rent exemption:', rentExemption, 'lamports');

  // Step 3: Get recent blockhash
  const { blockhash } = await connection.getLatestBlockhash('confirmed');
  console.log('Recent blockhash:', blockhash);

  // Step 4: Create a new keypair for storing metadata
  const metadataAccount = Keypair.generate();
  console.log('Created metadata account:', metadataAccount.publicKey.toString());

  // Step 5: Create the transaction with account creation
  const transaction = new Transaction({
    recentBlockhash: blockhash,
    feePayer: userPublicKey,
  });

  // Create account instruction with enough space for our data
  const createAccountInstruction = SystemProgram.createAccount({
    fromPubkey: userPublicKey,
    newAccountPubkey: metadataAccount.publicKey,
    lamports: rentExemption,
    space: space,
    programId: SystemProgram.programId,
  });

  transaction.add(createAccountInstruction);

  // Step 6: Sign the transaction (user signs first, then we add the account signature)
  console.log('Signing transaction...');
  const signedTransaction = await signTransaction(transaction);
  
  // Add the metadata account signature
  signedTransaction.partialSign(metadataAccount);

  console.log('Sending transaction...');
  const signature = await connection.sendRawTransaction(signedTransaction.serialize());
  console.log('Transaction signature:', signature);

  // Step 7: Confirm the transaction
  console.log('Confirming transaction...');
  await connection.confirmTransaction(signature, 'confirmed');

  // Step 8: Store the actual data using a memo instruction
  console.log('Storing metadata in memo...');
  const { blockhash: blockhash2 } = await connection.getLatestBlockhash('confirmed');
  
  const storeTransaction = new Transaction({
    recentBlockhash: blockhash2,
    feePayer: userPublicKey,
  });

  // Create a memo instruction to store our data with account reference
  const memoInstruction = new TransactionInstruction({
    keys: [
      { pubkey: userPublicKey, isSigner: true, isWritable: false },
    ],
    programId: new PublicKey('Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo'), // Memo program
    data: Buffer.from(`METADATA:${metadataAccount.publicKey.toString()}:${content}`),
  });

  storeTransaction.add(memoInstruction);

  // Sign and send the memo transaction
  const signedMemoTransaction = await signTransaction(storeTransaction);
  const memoSignature = await connection.sendRawTransaction(signedMemoTransaction.serialize());
  console.log('Memo transaction signature:', memoSignature);

  // Confirm the memo transaction
  await connection.confirmTransaction(memoSignature, 'confirmed');

  // Step 9: Verify the account exists
  const accountInfo = await connection.getAccountInfo(metadataAccount.publicKey);
  if (accountInfo) {
    console.log('Account created successfully with rent:', accountInfo.lamports);
    console.log('Account data length:', accountInfo.data.length);
  }

  return {
    accountAddress: metadataAccount.publicKey.toString(),
    transactionSignature: signature,
    memoSignature: memoSignature,
    content: content,
  };
}

/**
 * Retrieve metadata from Solana blockchain
 * This searches for memo transactions associated with the account
 */
export async function retrieveMetadataFromSolana(
  connection: Connection,
  accountAddress: string
): Promise<{ content: string; transactionSignature: string; timestamp: number }> {
  const accountPubkey = new PublicKey(accountAddress);
  const accountInfo = await connection.getAccountInfo(accountPubkey);
  
  if (!accountInfo) {
    throw new Error('Account not found');
  }

  // Get recent transactions for the account
  const signatures = await connection.getSignaturesForAddress(accountPubkey, { limit: 20 });
  
  if (signatures.length === 0) {
    throw new Error('No transactions found for this account');
  }

  // Search through transactions to find our memo
  for (const sigInfo of signatures) {
    try {
      const transaction = await connection.getTransaction(sigInfo.signature, {
        maxSupportedTransactionVersion: 0
      });

      if (!transaction) continue;

      // Look for memo instructions in the transaction
      if (transaction.meta?.logMessages) {
        for (const log of transaction.meta.logMessages) {
          if (log.includes('METADATA:')) {
            // Extract the content from the memo
            const parts = log.split('METADATA:');
            if (parts.length > 1) {
              const contentPart = parts[1].split(':').slice(2).join(':'); // Get everything after the second colon
              return {
                content: contentPart,
                transactionSignature: sigInfo.signature,
                timestamp: sigInfo.blockTime ? sigInfo.blockTime * 1000 : Date.now(),
              };
            }
          }
        }
      }
    } catch (error) {
      console.warn('Error processing transaction:', sigInfo.signature, error);
      continue;
    }
  }

  // Fallback: try to get data from account if it has any
  if (accountInfo.data.length > 0) {
    const storedContent = new TextDecoder().decode(accountInfo.data);
    return {
      content: storedContent,
      transactionSignature: signatures[0].signature,
      timestamp: signatures[0].blockTime ? signatures[0].blockTime * 1000 : Date.now(),
    };
  }

  throw new Error('No metadata found in account or associated transactions');
}
