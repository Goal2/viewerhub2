export {};

declare global {
  interface Window {
    Twitch: any;
    __twitchSDKLoading?: Promise<void>;
  }
}
