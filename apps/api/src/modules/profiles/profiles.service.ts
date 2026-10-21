import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createProfileDto: CreateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (user.profile) {
      throw new ConflictException('Usuário já possui um perfil');
    }

    if (user.role !== 'ADVERTISER' && user.role !== 'ADMIN') {
      throw new ForbiddenException('Apenas anunciantes podem criar perfis');
    }

    const profile = await this.prisma.profile.create({
      data: {
        userId,
        ...createProfileDto,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            isVerified: true,
          },
        },
      },
    });

    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'PROFILE_CREATED',
        resource: 'Profile',
        resourceId: profile.id,
        changes: createProfileDto,
      },
    });

    return profile;
  }

  async findAll(page = 1, limit = 10, filters?: any) {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive === 'true';
    }

    if (filters?.verificationStatus) {
      where.verificationStatus = filters.verificationStatus;
    }

    if (filters?.location) {
      where.location = {
        contains: filters.location,
        mode: 'insensitive',
      };
    }

    if (filters?.search) {
      where.OR = [
        { displayName: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [profiles, total] = await Promise.all([
      this.prisma.profile.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              isVerified: true,
            },
          },
          _count: {
            select: {
              media: true,
              reviews: true,
              favorites: true,
            },
          },
        },
      }),
      this.prisma.profile.count({ where }),
    ]);

    return {
      data: profiles,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, incrementView = false) {
    const profile = await this.prisma.profile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            isVerified: true,
          },
        },
        media: {
          where: { moderationStatus: 'APPROVED' },
          orderBy: { order: 'asc' },
        },
        reviews: {
          where: { moderationStatus: 'APPROVED' },
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            client: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            media: true,
            reviews: true,
            favorites: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Perfil não encontrado');
    }

    if (incrementView) {
      await this.prisma.profile.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      });
    }

    return profile;
  }

  async findByUserId(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            isVerified: true,
          },
        },
        media: {
          orderBy: { order: 'asc' },
        },
        _count: {
          select: {
            media: true,
            reviews: true,
            favorites: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Perfil não encontrado');
    }

    return profile;
  }

  async update(id: string, userId: string, updateProfileDto: UpdateProfileDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!profile) {
      throw new NotFoundException('Perfil não encontrado');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (profile.userId !== userId && user?.role !== 'ADMIN') {
      throw new ForbiddenException('Sem permissão para editar este perfil');
    }

    const updatedProfile = await this.prisma.profile.update({
      where: { id },
      data: updateProfileDto,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            isVerified: true,
          },
        },
      },
    });

    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'PROFILE_UPDATED',
        resource: 'Profile',
        resourceId: id,
        changes: updateProfileDto,
      },
    });

    return updatedProfile;
  }

  async updateVerificationStatus(
    id: string,
    adminUserId: string,
    status: 'PENDING' | 'VERIFIED' | 'REJECTED',
  ) {
    const profile = await this.prisma.profile.findUnique({
      where: { id },
    });

    if (!profile) {
      throw new NotFoundException('Perfil não encontrado');
    }

    const updatedProfile = await this.prisma.profile.update({
      where: { id },
      data: { verificationStatus: status },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    await this.prisma.auditLog.create({
      data: {
        userId: adminUserId,
        action: 'PROFILE_VERIFICATION_CHANGED',
        resource: 'Profile',
        resourceId: id,
        changes: { verificationStatus: status },
      },
    });

    return updatedProfile;
  }

  async remove(id: string, userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { id },
    });

    if (!profile) {
      throw new NotFoundException('Perfil não encontrado');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (profile.userId !== userId && user?.role !== 'ADMIN') {
      throw new ForbiddenException('Sem permissão para deletar este perfil');
    }

    await this.prisma.profile.delete({
      where: { id },
    });

    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'PROFILE_DELETED',
        resource: 'Profile',
        resourceId: id,
      },
    });

    return { message: 'Perfil removido com sucesso' };
  }

  async getStats(id: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            media: true,
            reviews: true,
            favorites: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Perfil não encontrado');
    }

    const reviews = await this.prisma.review.findMany({
      where: {
        profileId: id,
        moderationStatus: 'APPROVED',
      },
      select: {
        rating: true,
      },
    });

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return {
      profileId: id,
      viewCount: profile.viewCount,
      contactCount: profile.contactCount,
      mediaCount: profile._count.media,
      reviewCount: profile._count.reviews,
      favoriteCount: profile._count.favorites,
      averageRating: Math.round(avgRating * 10) / 10,
      verificationStatus: profile.verificationStatus,
      isActive: profile.isActive,
    };
  }
}
