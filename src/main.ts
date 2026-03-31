import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Tăng giới hạn payload để hỗ trợ upload video base64 (mặc định là 100kb)
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));

  // Cấu hình CORS chỉ cho phép FE trên Vercel truy cập
  app.enableCors({
    origin: 'https://gwouthfit.vercel.app',
    credentials: true,
  });
  
  await app.listen(process.env.PORT ?? 5001);
}
bootstrap();
