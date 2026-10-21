import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('profiles')
@Controller('profiles')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  @Roles('ADVERTISER', 'ADMIN')
  @ApiOperation({ summary: 'Criar perfil de anunciante' })
  @ApiResponse({ status: 201, description: 'Perfil criado com sucesso' })
  @ApiResponse({ status: 403, description: 'Apenas anunciantes podem criar perfis' })
  @ApiResponse({ status: 409, description: 'Usuário já possui um perfil' })
  async create(
    @Body() createProfileDto: CreateProfileDto,
    @CurrentUser() user: any,
  ) {
    return this.profilesService.create(user.userId, createProfileDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar perfis públicos' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'isActive', required: false, type: String })
  @ApiQuery({ name: 'verificationStatus', required: false, type: String })
  @ApiQuery({ name: 'location', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Lista de perfis' })
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
    @Query('isActive') isActive?: string,
    @Query('verificationStatus') verificationStatus?: string,
    @Query('location') location?: string,
    @Query('search') search?: string,
  ) {
    const filters = { isActive, verificationStatus, location, search };
    return this.profilesService.findAll(page, limit, filters);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Buscar perfil por ID' })
  @ApiResponse({ status: 200, description: 'Detalhes do perfil' })
  @ApiResponse({ status: 404, description: 'Perfil não encontrado' })
  async findOne(@Param('id') id: string) {
    return this.profilesService.findOne(id, true);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Buscar perfil por ID do usuário' })
  @ApiResponse({ status: 200, description: 'Detalhes do perfil' })
  @ApiResponse({ status: 404, description: 'Perfil não encontrado' })
  async findByUserId(@Param('userId') userId: string) {
    return this.profilesService.findByUserId(userId);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Obter estatísticas do perfil' })
  @ApiResponse({ status: 200, description: 'Estatísticas do perfil' })
  @ApiResponse({ status: 404, description: 'Perfil não encontrado' })
  async getStats(@Param('id') id: string) {
    return this.profilesService.getStats(id);
  }

  @Patch(':id')
  @Roles('ADVERTISER', 'ADMIN')
  @ApiOperation({ summary: 'Atualizar perfil' })
  @ApiResponse({ status: 200, description: 'Perfil atualizado' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  @ApiResponse({ status: 404, description: 'Perfil não encontrado' })
  async update(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
    @CurrentUser() user: any,
  ) {
    return this.profilesService.update(id, user.userId, updateProfileDto);
  }

  @Patch(':id/verification')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Atualizar status de verificação (Admin apenas)' })
  @ApiResponse({ status: 200, description: 'Status atualizado' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  @ApiResponse({ status: 404, description: 'Perfil não encontrado' })
  async updateVerification(
    @Param('id') id: string,
    @Body('status') status: 'PENDING' | 'VERIFIED' | 'REJECTED',
    @CurrentUser() user: any,
  ) {
    return this.profilesService.updateVerificationStatus(id, user.userId, status);
  }

  @Delete(':id')
  @Roles('ADVERTISER', 'ADMIN')
  @ApiOperation({ summary: 'Deletar perfil' })
  @ApiResponse({ status: 200, description: 'Perfil deletado' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  @ApiResponse({ status: 404, description: 'Perfil não encontrado' })
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.profilesService.remove(id, user.userId);
  }
}
