import axiosInstance from '@/app/lib/axios';
import { IConfigTienda } from '@/app/types/config-tienda.type';

interface ConfigTiendaApiResponse {
  success: boolean;
  data: IConfigTienda;
}

class ConfigTiendaService {
  private base = '/config/tienda';

  async getConfig(): Promise<ConfigTiendaApiResponse> {
    const res = await axiosInstance.get<ConfigTiendaApiResponse>(this.base);
    return res.data;
  }

  async updateConfig(data: Partial<IConfigTienda>): Promise<ConfigTiendaApiResponse> {
    const res = await axiosInstance.put<ConfigTiendaApiResponse>(this.base, data);
    return res.data;
  }
}

export const configTiendaService = new ConfigTiendaService();
