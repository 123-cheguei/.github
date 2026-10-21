import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { MediaService } from './media.service';
import { UploadMediaDto } from './dto/upload-media.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('media')
@Controller('media')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('profile/:profileId')
  @Roles('ADVERTISER', 'ADMIN')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        type: {
          type: 'string',
          enum: ['PHOTO', 'VIDEO'],
        },
        order: {
          type: 'number',
        },
        description: {
          type: 'string',
        },
      },
      required: ['file', 'type', 'order'],
    },
  })
  @ApiOperation({ summary: 'Upload de mídia (foto ou vídeo)' })
  @ApiResponse({ status: 201, description: 'Mídia enviada com sucesso' })
  @ApiResponse({ status: 400, description: 'Arquivo inválido' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  @ApiResponse({ status: 404, description: 'Perfil não encontrado' })
  async uploadMedia(
    @Param('profileId') profileId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadMediaDto: UploadMediaDto,
    @CurrentUser() user: any,
  ) {
    return this.mediaService.uploadMedia(profileId, user.userId, file, uploadMediaDto);
  }

  @Public()
  @Get('profile/:profileId')
  @ApiOperation({ summary: 'Listar mídias de um perfil' })
  @ApiResponse({ status: 200, description: 'Lista de mídias' })
  async findAll(
    @Param('profileId') profileId: string,
    @Query('includeAll') includeAll?: string,
  ) {
    return this.mediaService.findAll(profileId, includeAll === 'true');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar mídia por ID' })
  @ApiResponse({ status: 200, description: 'Detalhes da mídia' })
  @ApiResponse({ status: 404, description: 'Mídia não encontrada' })
  async findOne(@Param('id') id: string) {
    return this.mediaService.findOne(id);
  }

  @Patch(':id/moderation')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Moderar mídia (Admin apenas)' })
  @ApiResponse({ status: 200, description: 'Status de moderação atualizado' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  @ApiResponse({ status: 404, description: 'Mídia não encontrada' })
  async updateModeration(
    @Param('id') id: string,
    @Body('status') status: 'PENDING' | 'APPROVED' | 'REJECTED',
    @Body('notes') notes: string,
    @CurrentUser() user: any,
  ) {
    return this.mediaService.updateModerationStatus(id, status, user.userId, notes);
  }

  @Patch(':id/order')
  @Roles('ADVERTISER', 'ADMIN')
  @ApiOperation({ summary: 'Atualizar ordem da mídia' })
  @ApiResponse({ status: 200, description: 'Ordem atualizada' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  @ApiResponse({ status: 404, description: 'Mídia não encontrada' })
  async updateOrder(
    @Param('id') id: string,
    @Body('order') order: number,
    @CurrentUser() user: any,
  ) {
    return this.mediaService.updateOrder(id, user.userId, order);
  }

  @Delete(':id')
  @Roles('ADVERTISER', 'ADMIN')
  @ApiOperation({ summary: 'Deletar mídia' })
  @ApiResponse({ status: 200, description: 'Mídia deletada' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  @ApiResponse({ status: 404, description: 'Mídia não encontrada' })
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.mediaService.remove(id, user.userId);
  }
}
