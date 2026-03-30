import { Controller, Get, Post, Body, Delete, Param, Query, UseGuards } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('photos')
@UseGuards(JwtAuthGuard)
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Get()
  async findAll(@Query('date') date?: string) {
    if (date) {
      return this.photosService.findAllByDate(date);
    }
    return this.photosService.findAll();
  }

  @Post()
  async upload(@Body() body: { image: string; date: string; time: string; note?: string; weight?: number }) {
    return this.photosService.uploadPhoto(body.image, body.date, body.time, body.note, body.weight);
  }

  @Post('upload-video')
  async uploadVideo(@Body('video') video: string) {
    return this.photosService.uploadVideo(video);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.photosService.remove(id);
    return { success: true };
  }
}
