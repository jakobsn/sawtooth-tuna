import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../environments/db/typeorm.config';
import { CoreModule } from './core/core.module';
import { FeatureModule } from './feature/feature.module';
import { ApiExceptionFilter } from './utility/filter/api-exception-filter.filter';
import { JwtAuthGuard } from './utility/guard/JwtAuth.guard';
import { RequestPayloadValidationPipe } from './utility/pipe/request-Payload.pipe';
import { UtilityModule } from './utility/utility.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    CoreModule, 
    FeatureModule,
    UtilityModule
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ApiExceptionFilter
    },
    {
      provide: APP_PIPE,
      useClass: RequestPayloadValidationPipe
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    }
  ]
})
export class AppModule {}
