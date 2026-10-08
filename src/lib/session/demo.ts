export interface DemoSessionControls {
  login: () => Promise<void>;
  logout: () => void;
}
export interface RouterContext {
  demoSession?: DemoSessionControls;
}
