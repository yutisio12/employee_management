import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class EncryptionService {
  private readonly secretKey: string;

  constructor(private configService: ConfigService){
    this.secretKey = this.configService.get<string>('AES_SECRET_KEY')!;
  }

  encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, this.secretKey).toString();
  }

  decrypt(text: string): string {
    const bytes = CryptoJS.AES.decrypt(text, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  encryptObject(obj: any): string {
    return this.encrypt(JSON.stringify(obj));
  }

  decryptObject(cipherText: string): any {
    return JSON.parse(this.decrypt(cipherText));
  }

}