import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from './entities/photo.entity';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PhotosService {
  private supabase: SupabaseClient;
  private readonly logger = new Logger(PhotosService.name);

  constructor(
    @InjectRepository(Photo)
    private photosRepository: Repository<Photo>,
    private configService: ConfigService,
  ) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL')!;
    const supabaseKey = this.configService.get<string>('SUPABASE_ANON_KEY')!;
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async uploadPhoto(
    userId: string,
    base64Data: string,
    date: string,
    time: string,
    note?: string,
    weight?: number,
  ): Promise<Photo> {
    if (!userId) throw new Error('Không xác định được danh tính người dùng. Vui lòng đăng nhập lại!');
    const bucket = this.configService.get<string>('SUPABASE_BUCKET') || 'gym-photos';
    
    // 1. Decode base64 to buffer
    if (!base64Data) throw new Error('Cần có dữ liệu hình ảnh (base64Data)');
    const base64Content = base64Data.split(';base64,').pop();
    if (!base64Content) throw new Error('Invalid image data');
    
    const buffer = Buffer.from(base64Content, 'base64');
    const fileName = `${date}/${Date.now()}.webp`;

    // 2. Upload to Supabase Storage
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType: 'image/webp',
        upsert: true,
      });

    if (error) {
      this.logger.error('Supabase Upload Error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    // 3. Get Public URL
    const { data: { publicUrl } } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    // 4. Save metadata to Postgres
    const photo = this.photosRepository.create({
      userId,
      url: publicUrl,
      date,
      time,
      note,
      weight,
    });

    return this.photosRepository.save(photo);
  }

  async uploadVideo(userId: string, base64Data: string): Promise<{ url: string }> {
    const bucket = this.configService.get<string>('SUPABASE_BUCKET') || 'gym-photos';
    
    // 1. Extract base64 content and MIME type
    const mimeMatch = base64Data.match(/^data:(video\/[a-zA-Z0-9]+);base64,/);
    const contentType = mimeMatch ? mimeMatch[1] : 'video/mp4';
    const extension = contentType.split('/')[1] || 'mp4';

    const base64Content = base64Data.split(';base64,').pop();
    if (!base64Content) throw new Error('Invalid video data');
    
    const buffer = Buffer.from(base64Content, 'base64');
    const fileName = `videos/${Date.now()}.${extension}`;

    this.logger.log(`Uploading video: ${fileName} (${contentType}, ${buffer.length} bytes)`);

    // 2. Upload to Supabase Storage
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      this.logger.error('Supabase Video Upload Error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    const { data: { publicUrl } } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return { url: publicUrl };
  }

  async findAllByDate(userId: string, date: string): Promise<Photo[]> {
    if (!userId) return [];
    return this.photosRepository.find({
      where: { userId, date },
      order: { time: 'ASC' },
    });
  }

  async findAll(userId: string): Promise<Photo[]> {
    if (!userId) return [];
    return this.photosRepository.find({
      where: { userId },
      order: { date: 'DESC', time: 'DESC' },
    });
  }

  async remove(userId: string, id: string): Promise<void> {
    const photo = await this.photosRepository.findOne({ where: { userId, id } });
    if (!photo) return;

    // Optional: Delete from Supabase Storage too
    // Extract filename from URL... for now just delete from DB
    await this.photosRepository.delete({ userId, id });
  }
}
