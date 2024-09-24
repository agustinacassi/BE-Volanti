import { Controller, Post, Body, Headers, HttpException, HttpStatus } from '@nestjs/common';
import { NormalizationService } from './normalization.service';

@Controller('normalization')
export class NormalizationController {
  constructor(private readonly normalizationService: NormalizationService) {}

  @Post()
  async normalizeData(@Body() data: any[], @Headers('api-key') apiKey: string) {
    if (!apiKey) {
      throw new HttpException('API key is required', HttpStatus.UNAUTHORIZED);
    }

    try {
      const normalizedData = await this.normalizationService.normalizeData(data, apiKey);
      return { 
        success: true, 
        data: normalizedData 
      };
    } catch (error) {
      console.error('Error in normalizeData controller:', error);
      return { 
        success: false, 
        error: error.message || 'An unexpected error occurred'
      };
    }
  }
}