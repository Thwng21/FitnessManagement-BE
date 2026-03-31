import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Tăng giới hạn payload để hỗ trợ upload video base64 (mặc định là 100kb)
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));

  // Cấu hình CORS cho cả Localhost (Dev) và Vercel (Prod)
  app.enableCors({
    origin: ['https://gwouthfit.vercel.app', 'http://localhost:3000'],
    credentials: true,
  });
  
  try {
    await app.listen(process.env.PORT ?? 5001);
    console.log(`Backend is running on port ${process.env.PORT ?? 5001}`);
  } catch (error: any) {
    if (error?.code === 'EADDRINUSE') {
      console.error(`\n=================================================`);
      console.error(`❌ LỖI: Cổng 5001 đang bị chiếm dụng bởi một tab Terminal khác!`);
      console.error(`Vui lòng đóng bớt Terminal Backend cũ đi trước khi chạy lại.`);
      console.error(`=================================================\n`);
      process.exit(1);
    }
    console.error('Lỗi khởi động Server:', error);
  }
}
bootstrap();
