import { Module } from '@nestjs/common';
import { EurekaClientService } from './eureka-client.service';

@Module({
  providers: [EurekaClientService],
  exports: [EurekaClientService],
})
export class EurekaModule {}
