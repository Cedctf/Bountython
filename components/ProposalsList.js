import { useState, useEffect } from 'react';
import { getAllProposals, voteOnProposal, executeProposal } from '../services/blockchain';

export default function ProposalsList({ wallet, refreshTrigger }) {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [votingLoading, setVotingLoading] = useState({});
  const [executingLoading, setExecutingLoading] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch all proposals
  useEffect(() => {
    const fetchProposals = async () => {
      setLoading(true);
      setError('');
      try {
        const allProposals = await getAllProposals();
        setProposals(allProposals);
      } catch (error) {
        console.error('Error fetching proposals:', error);
        setError('Failed to load proposals from blockchain');
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [refreshTrigger]);

  // Handle voting on a proposal
  const handleVote = async (proposalPubkey, isFor) => {
    if (!wallet) {
      setError('Please connect your wallet to vote');
      return;
    }

    setVotingLoading(prev => ({ ...prev, [proposalPubkey]: true }));
    setError('');
    setSuccessMessage('');

    try {
      await voteOnProposal(wallet, proposalPubkey, isFor);
      setSuccessMessage(`Successfully voted ${isFor ? 'for' : 'against'} the proposal!`);
      
      // Refresh proposals after voting
      const updatedProposals = await getAllProposals();
      setProposals(updatedProposals);
    } catch (error) {
      console.error('Error voting on proposal:', error);
      setError(`Failed to vote: ${error.message}`);
    } finally {
      setVotingLoading(prev => ({ ...prev, [proposalPubkey]: false }));
    }
  };

  // Handle executing a proposal
  const handleExecute = async (proposalPubkey) => {
    if (!wallet) {
      setError('Please connect your wallet to execute the proposal');
      return;
    }

    setExecutingLoading(prev => ({ ...prev, [proposalPubkey]: true }));
    setError('');
    setSuccessMessage('');

    try {
      await executeProposal(wallet, proposalPubkey);
      setSuccessMessage('Successfully executed the proposal!');
      
      // Refresh proposals after execution
      const updatedProposals = await getAllProposals();
      setProposals(updatedProposals);
    } catch (error) {
      console.error('Error executing proposal:', error);
      setError(`Failed to execute proposal: ${error.message}`);
    } finally {
      setExecutingLoading(prev => ({ ...prev, [proposalPubkey]: false }));
    }
  };

  // Format timestamp to readable date
  const formatTimestamp = (timestamp) => {
    return new Date(Number(timestamp) * 1000).toLocaleString();
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      'Active': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 border border-blue-200 dark:border-blue-800',
      'Passed': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 border border-green-200 dark:border-green-800',
      'Rejected': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 border border-red-200 dark:border-red-800',
      'Executed': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300 border border-purple-200 dark:border-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  if (loading) {
    return (
      <div className="h-[600px] overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[600px] overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-red-500 text-center">
              <p className="font-medium">Error loading proposals</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (successMessage) {
    return (
      <div className="h-[600px] overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-green-500 text-center">
              <p className="font-medium">Success!</p>
              <p className="text-sm mt-1">{successMessage}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (proposals.length === 0) {
    return (
      <div className="h-[600px] overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-gray-500 text-center">
              <p className="font-medium">No proposals found</p>
              <p className="text-sm mt-1">Create a new proposal to get started</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[600px] overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="flex-none">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
            <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Governance Proposals ({proposals.length})
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            {proposals.map((proposal) => (
              <div key={proposal.pubkey} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{proposal.title}</h3>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(proposal.statusString)}`}>
                      {proposal.statusString}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Created by: {proposal.creator.slice(0, 4)}...{proposal.creator.slice(-4)}
                  </p>
                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                    Created: {formatTimestamp(proposal.created_at)}
                  </p>
                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                    Voting ends: {formatTimestamp(proposal.voting_ends_at)}
                  </p>
                </div>
                
                <div className="p-5">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description:</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 whitespace-pre-line">
                    {proposal.description.length > 200 
                      ? `${proposal.description.substring(0, 200)}...` 
                      : proposal.description}
                  </p>
                  
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">AI Analysis:</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 whitespace-pre-line">
                    {proposal.ai_analysis_summary.length > 150 
                      ? `${proposal.ai_analysis_summary.substring(0, 150)}...` 
                      : proposal.ai_analysis_summary}
                  </p>
                  
                  <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Votes: {Number(proposal.votes_for) + Number(proposal.votes_against)}
                      </div>
                      <div className="flex space-x-2">
                        <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded">
                          For: {Number(proposal.votes_for)}
                        </span>
                        <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded">
                          Against: {Number(proposal.votes_against)}
                        </span>
                      </div>
                    </div>
                    
                    {proposal.statusString === 'Active' && wallet && (
                      <div className="flex space-x-3 mt-4">
                        <button
                          onClick={() => handleVote(proposal.pubkey, true)}
                          disabled={votingLoading[proposal.pubkey]}
                          className="flex-1 py-2 px-4 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-md shadow-sm transition-colors disabled:bg-green-300 disabled:cursor-not-allowed"
                        >
                          {votingLoading[proposal.pubkey] ? 'Voting...' : 'Vote For'}
                        </button>
                        <button
                          onClick={() => handleVote(proposal.pubkey, false)}
                          disabled={votingLoading[proposal.pubkey]}
                          className="flex-1 py-2 px-4 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-md shadow-sm transition-colors disabled:bg-red-300 disabled:cursor-not-allowed"
                        >
                          {votingLoading[proposal.pubkey] ? 'Voting...' : 'Vote Against'}
                        </button>
                      </div>
                    )}
                    
                    {proposal.statusString === 'Passed' && wallet && (
                      <div className="mt-4">
                        <button
                          onClick={() => handleExecute(proposal.pubkey)}
                          disabled={executingLoading[proposal.pubkey]}
                          className="w-full py-2 px-4 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-md shadow-sm transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed"
                        >
                          {executingLoading[proposal.pubkey] ? 'Executing...' : 'Execute Proposal'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 