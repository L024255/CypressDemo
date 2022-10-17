type EnvVars = Partial<{
  REACT_APP_URI: string;
}>;

export default class Environment {
  constructor(public config = process.env as EnvVars) {
    this.config = config;
  }

  get apiUrl() {
    return this.config.REACT_APP_URI || "";
  }
}
