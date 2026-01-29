import api from './api';

interface UploadResponse {
  url: string;
}

export const uploadService = {
  async uploadImage(file: File, productName?: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    if (productName) {
      formData.append('productName', productName);
    }

    const response = await api.post<UploadResponse>('/api/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Return the URL path for storage in database
    return response.data.url;
  },
};
