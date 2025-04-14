export async function connectMetaMask() {
  // Check if MetaMask is installed
  if (typeof window.ethereum !== 'undefined') {
    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      return { account: accounts[0], isConnected: true };
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      throw new Error('User rejected the request or another error occurred');
    }
  } else {
    console.error('MetaMask is not installed');
    throw new Error('MetaMask is not installed. Please install MetaMask and try again.');
  }
}
