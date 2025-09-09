/**
 * Serviço para mapear championId para championKey
 * Necessário para converter IDs da API de maestria para keys do Data Dragon
 */

import { buildDataDragonUrl } from '../Utils/dataDragonVersionManager';

interface ChampionData {
  key: string;
  id: string;
  name: string;
  title: string;
}

interface ChampionsResponse {
  data: Record<string, ChampionData>;
}

export class ChampionMappingService {
  private static championMap: Map<string, string> = new Map();
  private static isLoaded = false;
  private static loadingPromise: Promise<void> | null = null;

  /**
   * Carrega os dados de campeões do Data Dragon
   */
  private static async loadChampionData(): Promise<void> {
    if (this.isLoaded) return;
    
    if (this.loadingPromise) {
      await this.loadingPromise;
      return;
    }

    this.loadingPromise = this.fetchChampionData();
    await this.loadingPromise;
    this.loadingPromise = null;
  }

  private static async fetchChampionData(): Promise<void> {
    try {
      const url = await buildDataDragonUrl('data/en_US/champion.json');
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar dados de campeões: ${response.status}`);
      }

      const data: ChampionsResponse = await response.json();
      
  
      Object.values(data.data).forEach(champion => {
        this.championMap.set(champion.key, champion.id);
      });

      this.isLoaded = true;
      
    } catch (error) {
      console.error('❌ Erro ao carregar dados de campeões:', error);
      throw error;
    }
  }

  /**
   * Converte championId para championKey
   * @param championId - ID numérico do campeão (ex: "266")
   * @returns championKey - Nome do campeão usado nas URLs (ex: "Aatrox")
   */
  static async getChampionKeyById(championId: string | number): Promise<string> {
    await this.loadChampionData();
    
    const championIdStr = championId.toString();
    const championKey = this.championMap.get(championIdStr);
    
    if (!championKey) {
      throw new Error(`Champion com ID ${championIdStr} não encontrado`);
    }
    
    return championKey;
  }

  /**
   * Força o recarregamento dos dados de campeões
   */
  static async forceReload(): Promise<void> {
    this.isLoaded = false;
    this.championMap.clear();
    await this.loadChampionData();
  }

  /**
   * Retorna estatísticas do cache
   */
  static getCacheStats(): { loaded: boolean; championCount: number } {
    return {
      loaded: this.isLoaded,
      championCount: this.championMap.size
    };
  }
}


export const getChampionKeyById = (championId: string | number) => 
  ChampionMappingService.getChampionKeyById(championId);