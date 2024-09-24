import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class NormalizationService {
  private readonly apiUrl = 'https://app.wordware.ai/api/released-app/507e6517-1af7-4097-915b-e35a101bc989/run';

  constructor(private readonly httpService: HttpService) {}

  async normalizeData(data: any[], apiKey: string): Promise<any> {
    const jsonString = JSON.stringify(data);
    const payload = {
      inputs: { JSON: jsonString },
      version: '^1.0',
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

      console.log('Raw response:', JSON.stringify(response.data, null, 2));

      // Extraer el JSON normalizado de la respuesta
      const normalizedData = this.extractJsonFromResponse(response.data);
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
      // Dividir la respuesta en líneas
      const lines = responseData.split('\n');
      
      // Buscar la línea que contiene el JSON normalizado
      for (const line of lines) {
        try {
          const chunk = JSON.parse(line);
          if (chunk.type === 'chunk' && 
              chunk.value.type === 'outputs' && 
              chunk.value.values && 
              chunk.value.values.data_normalization) {
            
            // Extraer el JSON de data_normalization
            const jsonString = chunk.value.values.data_normalization
              .replace(/^```json\n/, '')  // Remover el prefijo ```json
              .replace(/\n```$/, '');     // Remover el sufijo ```
            
            return JSON.parse(jsonString);
          }
        } catch (parseError) {
          // Ignorar errores de parsing para líneas que no son JSON válido
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
}