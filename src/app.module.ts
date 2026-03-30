import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './config/database.module';
import { WorkoutsModule } from './workouts/workouts.module';
import { HealthModule } from './health/health.module';
import { PhotosModule } from './photos/photos.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    WorkoutsModule,
    HealthModule,
    PhotosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
