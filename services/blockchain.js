import * as web3 from '@solana/web3.js';
import * as borsh from 'borsh';
import { Buffer } from 'buffer';
import { Connection, clusterApiUrl, PublicKey, ComputeBudgetProgram, Transaction, TransactionInstruction } from '@solana/web3.js';

// Define the program ID of your deployed contract
const PROGRAM_ID = new web3.PublicKey('C3hALGCa5NAEUYDBt3yM7vNPU44TZ3LCBkciXScri6Ba');

// Define enums
class ProposalStatus {
  static Active = 0;
  static Passed = 1;
  static Rejected = 2;
  static Executed = 3;
}

// Define Borsh serialization schemas
class Proposal {
  constructor(properties) {
    Object.assign(this, properties);
  }

  static schema = new Map([
    [
      Proposal,
      {
        kind: 'struct',
        fields: [
          ['creator', [32]], // Pubkey is 32 bytes
          ['title', 'string'],
          ['description', 'string'],
          ['status', 'u8'],
          ['votes_for', 'u64'],
          ['votes_against', 'u64'],
          ['ai_analysis_summary', 'string'],
          ['ai_analysis_sentiment', 'string'],
          ['created_at', 'u64'],
          ['voting_ends_at', 'u64'],
        ],
      },
    ],
  ]);
}

class CreateProposalInstruction {
  constructor(properties) {
    Object.assign(this, properties);
  }

  static schema = new Map([
    [
      CreateProposalInstruction,
      {
        kind: 'struct',
        fields: [
          ['variant', 'u8'],
          ['title', 'string'],
          ['description', 'string'],
          ['ai_analysis_summary', 'string'],
          ['ai_analysis_sentiment', 'string'],
          ['voting_period', 'u64'],
        ],
      },
    ],
  ]);
}

class VoteInstruction {
  constructor(properties) {
    Object.assign(this, properties);
  }

  static schema = new Map([
    [
      VoteInstruction,
      {
        kind: 'struct',
        fields: [
          ['variant', 'u8'],
          ['is_for', 'u8'], // Boolean as u8
          ['vote_weight', 'u64'],
        ],
      },
    ],
  ]);
}

class ExecuteProposalInstruction {
  constructor(properties) {
    Object.assign(this, properties);
  }

  static schema = new Map([
    [
      ExecuteProposalInstruction,
      {
        kind: 'struct',
        fields: [['variant', 'u8']],
      },
    ],
  ]);
}

// Initialize a connection to the Solana blockchain
const getConnection = () => {
  return new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
};

// Create a new proposal
export async function createProposal(
  wallet,
  title,
  description,
  aiAnalysisSummary,
  aiAnalysisSentiment,
  votingPeriodInSeconds = 86400 // Default 1 day
) {
  if (!wallet) {
    throw new Error('Wallet not connected');
  }

  try {
    const connection = getConnection();
    
    // Create a new keypair for the proposal account
    const proposalKeypair = web3.Keypair.generate();
    
    // Calculate space needed for the proposal (approximate)
    const space = 1000;
    
    // Calculate rent exemption
    const rentExemption = await connection.getMinimumBalanceForRentExemption(space);
    
    // Create account instruction
    const createAccountInstruction = web3.SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: proposalKeypair.publicKey,
      lamports: rentExemption,
      space,
      programId: PROGRAM_ID,
    });
    
    // Create proposal instruction data
    const instructionData = new CreateProposalInstruction({
      variant: 0, // CreateProposal variant
      title,
      description,
      ai_analysis_summary: aiAnalysisSummary,
      ai_analysis_sentiment: aiAnalysisSentiment,
      voting_period: BigInt(votingPeriodInSeconds),
    });
    
    // Serialize the instruction data
    const serializedInstructionData = Buffer.from(borsh.serialize(CreateProposalInstruction.schema, instructionData));
    
    // Create proposal instruction
    const createProposalIx = new web3.TransactionInstruction({
      keys: [
        { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
        { pubkey: proposalKeypair.publicKey, isSigner: true, isWritable: true },
        { pubkey: web3.SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      programId: PROGRAM_ID,
      data: serializedInstructionData,
    });
    
    // Create transaction
    const transaction = new web3.Transaction()
      .add(createAccountInstruction)
      .add(createProposalIx);
    
    // Get the recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey;
    
    // Sign transaction with proposal keypair first
    transaction.partialSign(proposalKeypair);
    
    // Then sign with the wallet
    const signedTransaction = await wallet.signTransaction(transaction);
    
    // Send and confirm the transaction
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());
    await connection.confirmTransaction(signature);
    
    return {
      proposalPubkey: proposalKeypair.publicKey.toString(),
      signature,
    };
  } catch (error) {
    console.error('Error creating proposal:', error);
    throw error;
  }
}

// Vote on a proposal
export async function voteOnProposal(wallet, proposalPubkey, isFor) {
  if (!wallet) {
    throw new Error('Wallet not connected');
  }

  try {
    const connection = getConnection();
    
    // Convert proposal pubkey string to PublicKey if needed
    const proposalAccount = typeof proposalPubkey === 'string' 
      ? new web3.PublicKey(proposalPubkey) 
      : proposalPubkey;
    
    // Create vote instruction data
    const instructionData = new VoteInstruction({
      variant: 1, // Vote variant
      is_for: isFor ? 1 : 0, // Convert boolean to u8
      vote_weight: BigInt(1), // Default weight is 1
    });
    
    // Serialize the instruction data
    const serializedInstructionData = Buffer.from(borsh.serialize(VoteInstruction.schema, instructionData));
    
    // Create the vote instruction - simplified to match contract expectations
    const voteIx = new web3.TransactionInstruction({
      keys: [
        { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
        { pubkey: proposalAccount, isSigner: false, isWritable: true },
      ],
      programId: PROGRAM_ID,
      data: serializedInstructionData,
    });
    
    // Create transaction with just the vote instruction - no compute budget instructions
    const transaction = new web3.Transaction().add(voteIx);
    
    // Get the recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey;
    
    // Sign the transaction
    const signedTransaction = await wallet.signTransaction(transaction);
    
    // Send and confirm the transaction
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());
    console.log('Vote transaction sent with signature:', signature);
    
    await connection.confirmTransaction(signature);
    console.log('Vote transaction confirmed');
    
    return { success: true, signature };
  } catch (error) {
    console.error('Error voting on proposal:', error);
    throw error;
  }
}

// Execute a proposal
export async function executeProposal(wallet, proposalPubkey) {
  if (!wallet) {
    throw new Error('Wallet not connected');
  }

  try {
    const connection = getConnection();
    
    // Convert proposal pubkey string to PublicKey if needed
    const proposalPublicKey = typeof proposalPubkey === 'string' 
      ? new web3.PublicKey(proposalPubkey) 
      : proposalPubkey;
    
    // Create execute proposal instruction data
    const instructionData = new ExecuteProposalInstruction({
      variant: 2, // ExecuteProposal variant
    });
    
    // Serialize the instruction data
    const serializedInstructionData = Buffer.from(borsh.serialize(ExecuteProposalInstruction.schema, instructionData));
    
    // Create execute proposal instruction
    const executeProposalIx = new web3.TransactionInstruction({
      keys: [
        { pubkey: wallet.publicKey, isSigner: true, isWritable: false },
        { pubkey: proposalPublicKey, isSigner: false, isWritable: true },
      ],
      programId: PROGRAM_ID,
      data: serializedInstructionData,
    });
    
    // Create transaction
    const transaction = new web3.Transaction().add(executeProposalIx);
    
    // Get the recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey;
    
    // Sign transaction
    const signedTransaction = await wallet.signTransaction(transaction);
    
    // Send and confirm the transaction
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());
    await connection.confirmTransaction(signature);
    
    return { signature };
  } catch (error) {
    console.error('Error executing proposal:', error);
    throw error;
  }
}

// Get proposal data
export async function getProposal(proposalPubkey) {
  try {
    const connection = getConnection();
    
    // Convert proposal pubkey string to PublicKey if needed
    const proposalPublicKey = typeof proposalPubkey === 'string' 
      ? new web3.PublicKey(proposalPubkey) 
      : proposalPubkey;
    
    // Get account info
    const accountInfo = await connection.getAccountInfo(proposalPublicKey);
    if (!accountInfo) {
      throw new Error('Proposal account not found');
    }
    
    // Deserialize proposal data
    const proposal = borsh.deserialize(
      Proposal.schema,
      Proposal,
      accountInfo.data
    );
    
    // Convert status number to string
    const statusMap = ['Active', 'Passed', 'Rejected', 'Executed'];
    proposal.statusString = statusMap[proposal.status];
    
    // Convert Pubkey buffer to string
    proposal.creator = new web3.PublicKey(proposal.creator).toString();
    
    return proposal;
  } catch (error) {
    console.error('Error fetching proposal:', error);
    throw error;
  }
}

// Get all proposals
export async function getAllProposals() {
  try {
    const connection = getConnection();
    
    // Find all accounts owned by the program
    const accounts = await connection.getProgramAccounts(PROGRAM_ID);
    
    // Parse each account as a proposal
    const proposals = await Promise.all(
      accounts.map(async (account) => {
        try {
          // Handle potential deserialization errors with proper error handling
          // We need to slice the data to the correct length for our Proposal structure
          // This is because Solana accounts may have padding at the end
          
          const data = account.account.data;
          
          // Only try to deserialize if the data is long enough
          if (data.length < 32) { // At minimum, we need the creator pubkey (32 bytes)
            console.error('Account data too short to be a valid proposal');
            return null;
          }
          
          try {
            // Try to deserialize the full data first
            const proposal = borsh.deserialize(
              Proposal.schema,
              Proposal,
              data
            );
            
            // Convert status number to string
            const statusMap = ['Active', 'Passed', 'Rejected', 'Executed'];
            proposal.statusString = statusMap[proposal.status];
            
            // Convert Pubkey buffer to string
            proposal.creator = new web3.PublicKey(proposal.creator).toString();
            
            // Add the proposal pubkey
            proposal.pubkey = account.pubkey.toString();
            
            return proposal;
          } catch (deserializeError) {
            // If we get a deserialization error, it might be because of trailing data
            // Let's try again with different slices of the data
            
            console.log('Initial deserialization failed:', deserializeError.message);
            console.log('Account data length:', data.length);
            
            // Try to find the length of the actual data structure through trial and error
            // This is a fallback method, not ideal but can work when exact structure is unknown
            for (let length = data.length - 10; length >= 32; length -= 10) {
              try {
                const slicedData = data.slice(0, length);
                const proposal = borsh.deserialize(
                  Proposal.schema,
                  Proposal,
                  slicedData
                );
                
                // If we get here, deserialization succeeded
                const statusMap = ['Active', 'Passed', 'Rejected', 'Executed'];
                proposal.statusString = statusMap[proposal.status];
                
                proposal.creator = new web3.PublicKey(proposal.creator).toString();
                proposal.pubkey = account.pubkey.toString();
                
                console.log('Successfully deserialized with length:', length);
                return proposal;
              } catch (sliceError) {
                // Continue trying with a smaller slice
              }
            }
            
            // If we've exhausted all options, log the error and return null
            console.error('All deserialization attempts failed for account:', account.pubkey.toString());
            return null;
          }
        } catch (error) {
          console.error('Error parsing proposal:', error);
          return null;
        }
      })
    );
    
    // Filter out any failed parses
    return proposals.filter(Boolean);
  } catch (error) {
    console.error('Error fetching proposals:', error);
    throw error;
  }
} 