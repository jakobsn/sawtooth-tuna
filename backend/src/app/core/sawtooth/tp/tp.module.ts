import { Module } from '@nestjs/common';
import { FishController } from './fish/fish.controller';
import { FishService } from './fish/fish.service';

@Module({
    controllers: [FishController],
    providers: [FishService]
})
export class TpModule {}
