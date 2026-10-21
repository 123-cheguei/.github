import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class MinioService implements OnModuleInit {
  private minioClient: Minio.Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.bucketName =
      this.configService.get<string>('MINIO_BUCKET_NAME') || 'fatal-model-media';

    this.minioClient = new Minio.Client({
      endPoint: this.configService.get<string>('MINIO_ENDPOINT') || 'localhost',
      port: parseInt(this.configService.get<string>('MINIO_PORT') || '9000'),
      useSSL: this.configService.get<string>('MINIO_USE_SSL') === 'true',
      accessKey: this.configService.get<string>('MINIO_ACCESS_KEY') || 'fatalmodel',
      secretKey:
        this.configService.get<string>('MINIO_SECRET_KEY') ||
        'fatalmodel_minio_password',
    });
  }

  async onModuleInit() {
    await this.ensureBucketExists();
  }

  private async ensureBucketExists() {
    try {
      const exists = await this.minioClient.bucketExists(this.bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
        console.log(`✅ Bucket ${this.bucketName} criado no MinIO`);

        const policy = {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: { AWS: ['*'] },
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${this.bucketName}/*`],
            },
          ],
        };
        await this.minioClient.setBucketPolicy(
          this.bucketName,
          JSON.stringify(policy),
        );
      }
    } catch (error) {
      console.error('Erro ao configurar MinIO:', error);
    }
  }

  async uploadFile(
    filePath: string,
    buffer: Buffer,
    contentType: string,
  ): Promise<void> {
    await this.minioClient.putObject(this.bucketName, filePath, buffer, {
      'Content-Type': contentType,
    });
  }

  async getFileUrl(filePath: string): Promise<string> {
    const endpoint = this.configService.get<string>('MINIO_ENDPOINT') || 'localhost';
    const port = this.configService.get<string>('MINIO_PORT') || '9000';
    const useSSL = this.configService.get<string>('MINIO_USE_SSL') === 'true';
    const protocol = useSSL ? 'https' : 'http';

    return `${protocol}://${endpoint}:${port}/${this.bucketName}/${filePath}`;
  }

  async deleteFile(filePath: string): Promise<void> {
    await this.minioClient.removeObject(this.bucketName, filePath);
  }

  async fileExists(filePath: string): Promise<boolean> {
    try {
      await this.minioClient.statObject(this.bucketName, filePath);
      return true;
    } catch (error) {
      return false;
    }
  }
}
