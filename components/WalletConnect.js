import { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

export default function WalletConnect({ onConnect }) {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [walletProvider, setWalletProvider] = useState(null);
  
  const connectWallet = async () => {
    setLoading(true);
    try {
      if (typeof window === 'undefined' || !window.solana) {
        alert('Solana wallet not found! Please install Phantom or Solflare extension');
        setLoading(false);
        return;
      }

      const response = await window.solana.connect();
      const publicKey = response.publicKey.toString();
      
      setWalletAddress(publicKey);
      setConnected(true);
      setWalletProvider(window.solana);
      
      // Pass the wallet info to parent component
      onConnect({ 
        publicKey: new PublicKey(publicKey),
        connected: true,
        signTransaction: async (transaction) => {
          try {
            return await window.solana.signTransaction(transaction);
          } catch (error) {
            console.error('Error signing transaction:', error);
            throw error;
          }
        },
        signAllTransactions: async (transactions) => {
          try {
            return await window.solana.signAllTransactions(transactions);
          } catch (error) {
            console.error('Error signing transactions:', error);
            throw error;
          }
        },
        signMessage: async (message) => {
          try {
            return await window.solana.signMessage(message);
          } catch (error) {
            console.error('Error signing message:', error);
            throw error;
          }
        }
      });
      
      // Set up listener for disconnection
      window.solana.on('disconnect', () => {
        setConnected(false);
        setWalletAddress('');
        setWalletProvider(null);
        onConnect(null);
      });
      
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      if (typeof window !== 'undefined' && window.solana) {
        await window.solana.disconnect();
        setConnected(false);
        setWalletAddress('');
        setWalletProvider(null);
        onConnect(null);
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  // Auto-connect if previously connected
  useEffect(() => {
    if (typeof window === 'undefined') {
      return; // Skip on server-side rendering
    }
    
    const autoConnect = async () => {
      if (window.solana && window.solana.isPhantom) {
        try {
          const response = await window.solana.connect({ onlyIfTrusted: true });
          const publicKey = response.publicKey.toString();
          
          setWalletAddress(publicKey);
          setConnected(true);
          setWalletProvider(window.solana);
          
          onConnect({ 
            publicKey: new PublicKey(publicKey),
            connected: true,
            signTransaction: async (transaction) => {
              try {
                return await window.solana.signTransaction(transaction);
              } catch (error) {
                console.error('Error signing transaction:', error);
                throw error;
              }
            },
            signAllTransactions: async (transactions) => {
              try {
                return await window.solana.signAllTransactions(transactions);
              } catch (error) {
                console.error('Error signing transactions:', error);
                throw error;
              }
            },
            signMessage: async (message) => {
              try {
                return await window.solana.signMessage(message);
              } catch (error) {
                console.error('Error signing message:', error);
                throw error;
              }
            }
          });
        } catch (error) {
          // User has not authorized the app or auto-connect failed
        }
      }
    };
    
    // Check for wallet adapters when the component mounts
    const checkForWallet = () => {
      if (window.solana) {
        autoConnect();
      } else {
        // If wallet adapter is not found on load, check again after a delay
        const interval = setInterval(() => {
          if (window.solana) {
            autoConnect();
            clearInterval(interval);
          }
        }, 100);
        
        // Clean up the interval after 3 seconds if wallet is not detected
        setTimeout(() => clearInterval(interval), 3000);
      }
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('load', checkForWallet);
      checkForWallet(); // Also check immediately in case window already loaded
      
      return () => window.removeEventListener('load', checkForWallet);
    }
  }, [onConnect]);

  return (
    <div>
      {connected ? (
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-gray-200">
            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
            <div className="text-sm text-gray-900 font-medium">
              {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
            </div>
          </div>
          <button
            onClick={disconnectWallet}
            className="bg-white hover:bg-gray-50 text-gray-900 text-sm font-medium px-4 py-2 rounded-full border border-gray-200 transition-all duration-200 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          disabled={loading}
          className="bg-white hover:bg-gray-100 text-indigo-600 font-medium px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connecting...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Connect Wallet
            </>
          )}
        </button>
      )}
    </div>
  );
} 