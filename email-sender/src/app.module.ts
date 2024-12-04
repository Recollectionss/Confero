import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';
import config from './config/config';

@Module({
  imports: [
    EmailModule,
    ConfigModule.forRoot({
      envFilePath: './.env',
      isGlobal: true,
      load: [config],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
