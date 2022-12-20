import { Test, TestingModule } from '@nestjs/testing';
import { DrawingsGateway } from './drawings.gateway';
import { DrawingsService } from './drawings.service';

describe('DrawingsGateway', () => {
  let gateway: DrawingsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DrawingsGateway, DrawingsService],
    }).compile();

    gateway = module.get<DrawingsGateway>(DrawingsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
