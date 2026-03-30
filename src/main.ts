import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Tăng giới hạn payload để hỗ trợ upload video base64 (mặc định là 100kb)
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));

  // Cho phép CORS để Frontend Next.js port 3000 ở g-fe có thể gọi tới
  app.enableCors();
  // Đổi cổng mặc định sang 5001 để không trùng với cổng 3000 của Next.js
  await app.listen(process.env.PORT ?? 5001);
}
bootstrap();
