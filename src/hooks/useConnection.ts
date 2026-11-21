import NetInfo, { useNetInfo } from '@react-native-community/netinfo';

export function useConnection(): { online: boolean; offline: boolean } {
  const netInfo = useNetInfo();
  const offline =
    netInfo.isConnected === false || netInfo.isInternetReachable === false;
  return { online: !offline, offline };
}

export async function isOnlineNow(): Promise<boolean> {
  const state = await NetInfo.fetch();
  return state.isConnected === true;
}
