import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';
import { MinioService } from '../../common/minio/minio.service';
import { UploadMediaDto } from './dto/upload-media.dto';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class MediaService {
  constructor(
    private prisma: PrismaService,
    private minioService: MinioService,
    private configService: ConfigService,
  ) {}

  async uploadMedia(
    profileId: string,
    userId: string,
    file: Express.Multer.File,
    uploadMediaDto: UploadMediaDto,
  ) {
    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      throw new NotFoundException('Perfil não encontrado');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (profile.userId !== userId && user?.role !== 'ADMIN') {
      throw new ForbiddenException('Sem permissão para adicionar mídia a este perfil');
    }

    this.validateFile(file, uploadMediaDto.type);

    const fileName = this.generateFileName(file);
    const filePath = `profiles/${profileId}/${fileName}`;

    await this.minioService.uploadFile(filePath, file.buffer, file.mimetype);

    const fileUrl = await this.minioService.getFileUrl(filePath);

    let thumbnailUrl: string | undefined;
    if (uploadMediaDto.type === 'PHOTO') {
      thumbnailUrl = fileUrl;
    }

    const media = await this.prisma.media.create({
      data: {
        profileId,
        type: uploadMediaDto.type,
        url: fileUrl,
        thumbnailUrl,
        order: uploadMediaDto.order,
        metadata: {
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          fileName,
          filePath,
        },
      },
    });

    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'MEDIA_UPLOADED',
        resource: 'Media',
        resourceId: media.id,
        changes: { type: media.type, profileId },
      },
    });

    return media;
  }

  async findAll(profileId: string, includeAll = false) {
    const where: any = { profileId };

    if (!includeAll) {
      where.moderationStatus = 'APPROVED';
    }

    const media = await this.prisma.media.findMany({
      where,
      orderBy: { order: 'asc' },
    });

    return media;
  }

  async findOne(id: string) {
    const media = await this.prisma.media.findUnique({
      where: { id },
      include: {
        profile: {
          select: {
            id: true,
            displayName: true,
            userId: true,
          },
        },
      },
    });

    if (!media) {
      throw new NotFoundException('Mídia não encontrada');
    }

    return media;
  }

  async updateModerationStatus(
    id: string,
    status: 'PENDING' | 'APPROVED' | 'REJECTED',
    moderatorUserId: string,
    notes?: string,
  ) {
    const media = await this.prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      throw new NotFoundException('Mídia não encontrada');
    }

    const updatedMedia = await this.prisma.media.update({
      where: { id },
      data: {
        moderationStatus: status,
        moderationNotes: notes,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        userId: moderatorUserId,
        action: 'MEDIA_MODERATION_CHANGED',
        resource: 'Media',
        resourceId: id,
        changes: { moderationStatus: status, notes },
      },
    });

    return updatedMedia;
  }

  async updateOrder(id: string, userId: string, newOrder: number) {
    const media = await this.prisma.media.findUnique({
      where: { id },
      include: {
        profile: true,
      },
    });

    if (!media) {
      throw new NotFoundException('Mídia não encontrada');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (media.profile.userId !== userId && user?.role !== 'ADMIN') {
      throw new ForbiddenException('Sem permissão para editar esta mídia');
    }

    const updatedMedia = await this.prisma.media.update({
      where: { id },
      data: { order: newOrder },
    });

    return updatedMedia;
  }

  async remove(id: string, userId: string) {
    const media = await this.prisma.media.findUnique({
      where: { id },
      include: {
        profile: true,
      },
    });

    if (!media) {
      throw new NotFoundException('Mídia não encontrada');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (media.profile.userId !== userId && user?.role !== 'ADMIN') {
      throw new ForbiddenException('Sem permissão para deletar esta mídia');
    }

    const metadata = media.metadata as any;
    if (metadata?.filePath) {
      try {
        await this.minioService.deleteFile(metadata.filePath);
      } catch (error) {
        console.error('Erro ao deletar arquivo do MinIO:', error);
      }
    }

    await this.prisma.media.delete({
      where: { id },
    });

    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'MEDIA_DELETED',
        resource: 'Media',
        resourceId: id,
      },
    });

    return { message: 'Mídia removida com sucesso' };
  }

  private validateFile(file: Express.Multer.File, type: 'PHOTO' | 'VIDEO') {
    const maxSizePhoto = 10 * 1024 * 1024; // 10MB
    const maxSizeVideo = 100 * 1024 * 1024; // 100MB

    const allowedPhotoMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const allowedVideoMimes = ['video/mp4', 'video/webm', 'video/quicktime'];

    if (type === 'PHOTO') {
      if (!allowedPhotoMimes.includes(file.mimetype)) {
        throw new BadRequestException(
          'Tipo de arquivo inválido. Use: JPEG, PNG ou WebP',
        );
      }
      if (file.size > maxSizePhoto) {
        throw new BadRequestException('Foto muito grande. Máximo: 10MB');
      }
    } else if (type === 'VIDEO') {
      if (!allowedVideoMimes.includes(file.mimetype)) {
        throw new BadRequestException('Tipo de arquivo inválido. Use: MP4, WebM ou MOV');
      }
      if (file.size > maxSizeVideo) {
        throw new BadRequestException('Vídeo muito grande. Máximo: 100MB');
      }
    }
  }

  private generateFileName(file: Express.Multer.File): string {
    const hash = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    return `${Date.now()}-${hash}${ext}`;
  }
}
