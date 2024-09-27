import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class NormalizationService {
  private readonly apiUrl = 'https://app.wordware.ai/api/released-app/64bbca92-d364-4039-9e05-ea73b86c3913/run';
  private readonly apiKey = 'ww-DSKxistXoUarnh544nPkXzshGzhTQskTdrr9lKo9nyu7qBcXXofK61';

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