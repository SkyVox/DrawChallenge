import { Module } from '@nestjs/common';
import { DrawingsService } from './drawings.service';
import { DrawingsGateway } from './drawings.gateway';

@Module({
  providers: [DrawingsGateway, DrawingsService]
})
export class DrawingsModule {}
