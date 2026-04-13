import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Eureka } from 'eureka-js-client';

@Injectable()
export class EurekaClientService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(EurekaClientService.name);
  private readonly client: Eureka;

  constructor(private readonly configService: ConfigService) {
    const port = parseInt(this.configService.get<string>('PORT', '3000'), 10);
    const eurekaHost = this.configService.get<string>('EUREKA_HOST', 'localhost');
    const eurekaPort = parseInt(this.configService.get<string>('EUREKA_PORT', '8761'), 10);

    this.client = new Eureka({
      instance: {
        app: 'CLASSE-NIVEAU-SERVICE',
        instanceId: `classe-niveau-service:${port}`,
        hostName: '127.0.0.1',
        ipAddr: '127.0.0.1',
        port: { $: port, '@enabled': true },
        vipAddress: 'classe-niveau-service',
        statusPageUrl: `http://127.0.0.1:${port}/info`,
        healthCheckUrl: `http://127.0.0.1:${port}/health`,
        homePageUrl: `http://127.0.0.1:${port}/`,
        dataCenterInfo: {
          '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
          name: 'MyOwn',
        },
      },
      eureka: {
        host: eurekaHost,
        port: eurekaPort,
        servicePath: '/eureka/apps/',
        maxRetries: 10,
        requestRetryDelay: 2000,
      },
    });
  }

  onModuleInit(): void {
    this.client.start((error) => {
      if (error) {
        this.logger.error('Eureka registration failed', error);
      } else {
        this.logger.log('Registered with Eureka');
      }
    });
  }

  onModuleDestroy(): void {
    this.client.stop();
    this.logger.log('Deregistered from Eureka');
  }
}
