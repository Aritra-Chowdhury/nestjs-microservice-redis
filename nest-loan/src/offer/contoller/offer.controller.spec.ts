import { Test, TestingModule } from '@nestjs/testing';
import { OfferController } from './offer.controller';

describe('Offer Controller', () => {
  let controller: OfferController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfferController],
    }).compile();

    controller = module.get<OfferController>(OfferController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
