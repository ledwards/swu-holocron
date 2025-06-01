export async function isConnectedToInternet(): Promise<boolean> {
  try {
    // Use a simple fetch request to check connectivity
    const response = await fetch('https://www.google.com', {
      method: 'HEAD',
      cache: 'no-cache',
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

export async function getNetworkState() {
  try {
    const connected = await isConnectedToInternet();
    return {
      isConnected: connected,
      isInternetReachable: connected,
    };
  } catch (error) {
    return {
      isConnected: false,
      isInternetReachable: false,
    };
  }
}