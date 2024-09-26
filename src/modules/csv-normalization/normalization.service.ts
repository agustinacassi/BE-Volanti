import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as phoneUtil from 'google-libphonenumber';

@Injectable()
export class NormalizationService {
  private readonly apiUrl = "https://app.wordware.ai/api/released-app/64bbca92-d364-4039-9e05-ea73b86c3913/run"
  private readonly phoneUtil = phoneUtil.PhoneNumberUtil.getInstance();

  constructor(private readonly httpService: HttpService) {}

  async normalizeData(data: any[], apiKey: string): Promise<any> {
    const jsonString = JSON.stringify(data);
    const payload = {
      inputs: { JSON: jsonString },
      version: '^1.2',
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(this.apiUrl, payload, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        })
      );

      console.log('Response from API:', response.data);


      // Extraer el JSON normalizado de la respuesta
      let normalizedData = this.extractJsonFromResponse(response.data);
      
      // Normalizar los números de teléfono y reemplazar en el JSON
      normalizedData = this.normalizeAndReplacePhoneNumbers(normalizedData);
      console.log(normalizedData)
      return normalizedData;

    } catch (error) {
      console.error('Error in normalizeData:', error);
      throw new HttpException(
        `Normalization failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private extractJsonFromResponse(responseData: string): any {
    try {
      const lines = responseData.split('\n');
      
      for (const line of lines) {
        try {
          const chunk = JSON.parse(line);
          if (chunk.type === 'chunk' && 
              chunk.value.type === 'outputs' && 
              chunk.value.values && 
              chunk.value.values.data_normalization) {
            
            const jsonString = chunk.value.values.data_normalization
              .replace(/^```json\n/, '')
              .replace(/\n```$/, '');
            
            return JSON.parse(jsonString);
          }
        } catch (parseError) {
          continue;
        }
      }

      throw new Error('No se encontró JSON normalizado en la respuesta');

    } catch (error) {
      console.error('Error extracting JSON from response:', error);
      throw new HttpException(
        'Failed to extract normalized JSON',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private normalizeAndReplacePhoneNumbers(data: any[]): any[] {
    return data.map(item => {
      if (item.phone) {
        try {
          const number = this.phoneUtil.parse(item.phone, 'AR');
          if (this.phoneUtil.isValidNumber(number)) {
            item.phone = this.phoneUtil.format(number, phoneUtil.PhoneNumberFormat.E164);
          } else {
            console.warn(`Invalid phone number: ${item.phone}`);
            item.phoneValidationStatus = 'INVALID';
          }
        } catch (error) {
          console.error(`Error normalizing phone number: ${item.phone}`, error);
        }
      }
      return item;
    });
  }
}