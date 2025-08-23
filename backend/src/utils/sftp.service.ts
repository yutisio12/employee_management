import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Client from 'ssh2-sftp-client';
import { Readable } from 'stream';

@Injectable()
export class SftpService {
  private readonly logger = new Logger(SftpService.name);
  private readonly sftpConfig: any;

  constructor(private configService: ConfigService){
    this.sftpConfig = {
      host: this.configService.get<string>('SFTP_HOST'),
      port: this.configService.get<number>('SFTP_PORT'),
      username: this.configService.get<string>('SFTP_USERNAME'),
      password: this.configService.get<string>('SFTP_PASSWORD'),
    }
  }

  async uploadFile(buffer: Buffer, fileName: string, remotePath?: string): Promise<string> {
    const sftp = new Client();

    try {
      await sftp.connect(this.sftpConfig);

      const uploadPath = remotePath || this.configService.get<string>('SFTP_UPLOAD_PATH');
      const fullPath = `${uploadPath}/${fileName}`;

      await sftp.mkdir(uploadPath, true); // Ensure directory exists
      const stream = new Readable();
      stream.push(buffer)
      stream.push(null);

      await sftp.put(stream, fullPath);
      this.logger.log(`File uploaded successfully to ${fullPath}`);
      return fullPath;

    } catch (error) {
      console.error('SFTP Upload Error:', error);
      throw new Error('Failed to upload file via SFTP');
    } finally {
      await sftp.end()
    }
  }

  async downloadFile(remotePath: string): Promise<Buffer>{
    const sftp = new Client()

    try{
      await sftp.connect(this.sftpConfig)
      const data = await sftp.get(remotePath)
      return data as Buffer
    } catch (error) {
      console.error('SFTP Download Error:', error);
      throw new Error('Failed to download file via SFTP');
    } finally {
      await sftp.end()
    }
  }

  async deleteFile(remotePath: string): Promise<void>{
    const sftp = new Client()

    try{
      await sftp.connect(this.sftpConfig)
      await sftp.delete(remotePath)
      this.logger.log(`File deleted successfully from ${remotePath}`);
    } catch (error) {
      console.error('SFTP Delete Error:', error);
      throw new Error('Failed to delete file via SFTP');
    } finally {
      await sftp.end()
    }
  }

}