declare module 'eureka-js-client' {
  interface EurekaInstanceConfig {
    app: string;
    instanceId: string;
    hostName: string;
    ipAddr: string;
    port: { $: number; '@enabled': boolean };
    vipAddress: string;
    statusPageUrl: string;
    healthCheckUrl: string;
    homePageUrl: string;
    dataCenterInfo: {
      '@class': string;
      name: string;
    };
  }

  interface EurekaClientConfig {
    host: string;
    port: number;
    servicePath: string;
    maxRetries?: number;
    requestRetryDelay?: number;
  }

  interface EurekaConfig {
    instance: EurekaInstanceConfig;
    eureka: EurekaClientConfig;
  }

  export class Eureka {
    constructor(config: EurekaConfig);
    start(callback?: (error: Error | null) => void): void;
    stop(callback?: () => void): void;
  }
}
