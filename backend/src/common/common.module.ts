import { SftpService } from './../utils/sftp.service';
import { Module, Global } from '@nestjs/common';
import { EncryptionService } from 'src/utils/encryption.service';

@Global()
@Module({
  providers: [EncryptionService, SftpService],
  exports: [EncryptionService, SftpService],
})
export class CommonModule {}