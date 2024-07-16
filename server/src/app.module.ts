import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import  config from 'config'
import { allExceptionFilter } from './httpExceptionFilter';

@Module({
  imports: [
    MongooseModule.forRoot(config.get<string>("mongodbUrl"), {
      w: 1,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_FILTER',
      useClass: allExceptionFilter
    }
  ],
})
export class AppModule {}
