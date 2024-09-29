import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class NormalizationService {
  private readonly apiUrl: string;
  private readonly apiKey: string;

  constructor(private configService: ConfigService) {
    this.apiUrl = this.configService.get<string>('WORDWARE_API_URL');
    console.log(this.apiUrl, "api url")
    this.apiKey = this.configService.get<string>('WORDWARE_API_KEY');

    if (!this.apiUrl || !this.apiKey) {
      throw new Error('Wordware API configuration is missing');
    }
  }

  async normalizeData(data): Promise<any> {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          "inputs": {
            "JSON": JSON.stringify(data)
          },
          "version": "^1.3"
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error in normalizeData:', error.response?.data || error.message);
    }
  }
}