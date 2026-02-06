import api from './api';

interface UploadResponse {
  url: string;
  key: string;
}

export const uploadService = {
  async uploadImage(file: File, productNameOrFolder?: string): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    if (productNameOrFolder) {
      formData.append('productName', productNameOrFolder);
    }

    const response = await api.post<UploadResponse>('/api/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Return the full response with url and key
    return {
      url: response.data.url,
      key: response.data.key || response.data.url.split('/').pop() || '',
    };
  },

  // Backward compatible method that returns just the URL string
  async uploadImageUrl(file: File, productName?: string): Promise<string> {
    const result = await this.uploadImage(file, productName);
    return result.url;
  },
};
