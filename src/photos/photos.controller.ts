import { Controller, Get, Post, Body, Delete, Param, Query, UseGuards, Request } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('photos')
@UseGuards(JwtAuthGuard)
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Get()
  async findAll(@Request() req: any, @Query('date') date?: string) {
    const userId = req.user.id;
    if (date) {
      return this.photosService.findAllByDate(userId, date);
    }
    return this.photosService.findAll(userId);
  }

  @Post()
  async upload(@Request() req: any, @Body() body: { image: string; date: string; time: string; note?: string; weight?: number }) {
    const userId = req.user.id;
    return this.photosService.uploadPhoto(userId, body.image, body.date, body.time, body.note, body.weight);
  }

  @Post('upload-video')
  async uploadVideo(@Request() req: any, @Body('video') video: string) {
    const userId = req.user.id;
    return this.photosService.uploadVideo(userId, video);
  }

  @Delete(':id')
  async remove(@Request() req: any, @Param('id') id: string) {
    const userId = req.user.id;
    await this.photosService.remove(userId, id);
    return { success: true };
  }
}
