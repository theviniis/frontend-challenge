export interface DemoSessionControls {
  login: () => void;
  logout: () => void;
}
export interface RouterContext {
  demoSession?: DemoSessionControls;
}
