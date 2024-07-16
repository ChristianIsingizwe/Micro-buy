import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import  config from 'config'
import { allExceptionFilter } from './httpExceptionFilter';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot(config.get<string>("mongodbUrl"), {
      w: 1,
    }),
    UsersModule,
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
