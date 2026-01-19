import axios from 'axios';
import axiosInstance from '../lib/axios';

type CheckEmailResponse = {
  success: boolean;
  data: {
    exists: boolean;
    canLoginAsGuest: boolean;
  };
  error?: string;
};

class EmailValidationService {
  async checkEmailExists(email: string): Promise<{ exists: boolean; canLoginAsGuest: boolean }> {
    try {
      if (!email || !email.trim()) {
        return { exists: false, canLoginAsGuest: true };
      }

      const response = await axiosInstance.post<CheckEmailResponse>('/auth/check-email', {
        email: email.trim()
      });

      if (!response.data.success) {
        throw new Error(response.data.error ?? 'Error al verificar el email');
      }

      return {
        exists: response.data.data.exists,
        canLoginAsGuest: response.data.data.canLoginAsGuest
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data as { error?: string } | undefined;
        let errorMessage = errorData?.error ?? error.message;
        
        // Simplificar mensajes de error técnicos de Prisma
        if (errorMessage.includes('prisma') || errorMessage.includes('column') || errorMessage.includes('does not exist')) {
          errorMessage = 'Error al verificar el email. Por favor, intenta nuevamente.';
        }
        
        throw new Error(errorMessage);
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error desconocido al verificar el email');
    }
  }
}

export default new EmailValidationService();


