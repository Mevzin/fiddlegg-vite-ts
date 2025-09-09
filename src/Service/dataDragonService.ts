/**
 * Serviço para gerenciar URLs do Data Dragon
 * Centraliza todas as operações relacionadas a imagens e recursos do League of Legends
 */

import { 
  getChampionImageUrl,
  getLatestDataDragonVersion,
  DataDragonVersionManager
} from '../Utils/dataDragonVersionManager';

export class DataDragonService {
  /**
   * Cache de URLs para evitar múltiplas chamadas
   */
  private static urlCache = new Map<string, string>();
  
  /**
   * Obtém URL do ícone de campeão com cache
   * @param championName - Nome do campeão
   * @param useCache - Se deve usar cache (padrão: true)
   * @returns Promise com URL do ícone
   */
  static async getChampionIcon(championName: string, useCache: boolean = true): Promise<string> {
    const cacheKey = `champion_icon_${championName}`;
    
    if (useCache && this.urlCache.has(cacheKey)) {
      return this.urlCache.get(cacheKey)!;
    }
    
    try {
      const url = await DataDragonVersionManager.getChampionIconUrl(championName);
      this.urlCache.set(cacheKey, url);
      return url;
    } catch (error) {
      console.error(`Erro ao obter ícone do campeão ${championName}:`, error);
      throw error;
    }
  }
  
  /**
   * Obtém URL do ícone de item com cache
   * @param itemId - ID do item
   * @param useCache - Se deve usar cache (padrão: true)
   * @returns Promise com URL do ícone
   */
  static async getItemIcon(itemId: string | number, useCache: boolean = true): Promise<string> {
    const itemIdStr = itemId.toString();
    const cacheKey = `item_icon_${itemIdStr}`;
    
    if (useCache && this.urlCache.has(cacheKey)) {
      return this.urlCache.get(cacheKey)!;
    }
    
    try {
      const url = await DataDragonVersionManager.getItemIconUrl(itemIdStr);
      this.urlCache.set(cacheKey, url);
      return url;
    } catch (error) {
      console.error(`Erro ao obter ícone do item ${itemIdStr}:`, error);
      throw error;
    }
  }
  
  /**
   * Obtém URL do ícone de perfil com cache
   * @param profileIconId - ID do ícone de perfil
   * @param useCache - Se deve usar cache (padrão: true)
   * @returns Promise com URL do ícone
   */
  static async getProfileIcon(profileIconId: string | number, useCache: boolean = true): Promise<string> {
    const profileIconIdStr = profileIconId.toString();
    const cacheKey = `profile_icon_${profileIconIdStr}`;
    
    if (useCache && this.urlCache.has(cacheKey)) {
      return this.urlCache.get(cacheKey)!;
    }
    
    try {
      const { DataDragonVersionManager } = await import('../Utils/dataDragonVersionManager');
      const url = await DataDragonVersionManager.getProfileIconUrl(profileIconIdStr);
      this.urlCache.set(cacheKey, url);
      return url;
    } catch (error) {
      console.error(`Erro ao obter ícone de perfil ${profileIconIdStr}:`, error);
      throw error;
    }
  }
  
  /**
   * Obtém URL da splash art de campeão
   * @param championName - Nome do campeão
   * @param skinNum - Número da skin (padrão: 0)
   * @param useCache - Se deve usar cache (padrão: true)
   * @returns Promise com URL da splash art
   */
  static async getChampionSplash(championName: string, skinNum: number = 0, useCache: boolean = true): Promise<string> {
    const cacheKey = `champion_splash_${championName}_${skinNum}`;
    
    if (useCache && this.urlCache.has(cacheKey)) {
      return this.urlCache.get(cacheKey)!;
    }
    
    try {
      const url = await getChampionImageUrl(championName, skinNum, 'splash');
      this.urlCache.set(cacheKey, url);
      return url;
    } catch (error) {
      console.error(`Erro ao obter splash do campeão ${championName}:`, error);
      const fallbackUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championName}_${skinNum}.jpg`;
      return fallbackUrl;
    }
  }
  
  /**
   * Pré-carrega URLs mais comuns para melhorar performance
   * @param championNames - Lista de nomes de campeões
   * @param itemIds - Lista de IDs de itens
   */
  static async preloadCommonAssets(championNames: string[] = [], itemIds: (string | number)[] = []): Promise<void> {
    try {
      console.log('🔄 Pré-carregando assets do Data Dragon...');
      
      const championPromises = championNames.map(name => this.getChampionIcon(name));
      
      const itemPromises = itemIds.map(id => this.getItemIcon(id));
      
      await Promise.allSettled([...championPromises, ...itemPromises]);
      
      console.log('✅ Assets pré-carregados com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao pré-carregar assets:', error);
    }
  }
  
  /**
   * Limpa o cache de URLs
   */
  static clearCache(): void {
    this.urlCache.clear();
    console.log('🗑️ Cache de URLs limpo');
  }
  
  /**
   * Obtém informações do cache
   * @returns Objeto com estatísticas do cache
   */
  static getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.urlCache.size,
      keys: Array.from(this.urlCache.keys())
    };
  }
  
  /**
   * Força atualização de uma URL específica
   * @param type - Tipo de asset ('champion', 'item', 'profile')
   * @param id - ID do asset
   * @param skinNum - Número da skin (apenas para campeões)
   * @returns Promise com nova URL
   */
  static async forceRefreshUrl(
    type: 'champion' | 'item' | 'profile' | 'splash', 
    id: string, 
    skinNum?: number
  ): Promise<string> {
    const cacheKey = skinNum !== undefined ? 
      `${type}_${id}_${skinNum}` : 
      `${type}_${id}`;
    
    this.urlCache.delete(cacheKey);
    
    switch (type) {
      case 'champion':
        return this.getChampionIcon(id, false);
      case 'item':
        return this.getItemIcon(id, false);
      case 'profile':
        return this.getProfileIcon(id, false);
      case 'splash':
        return this.getChampionSplash(id, skinNum || 0, false);
      default:
        throw new Error(`Tipo de asset inválido: ${type}`);
    }
  }
  
  /**
   * Obtém a versão atual do Data Dragon
   * @returns Promise com a versão
   */
  static async getCurrentVersion(): Promise<string> {
    return getLatestDataDragonVersion();
  }
}

export const getChampionIconUrl = (championName: string) => 
  DataDragonService.getChampionIcon(championName);

export const getItemIconUrl = (itemId: string | number) => 
  DataDragonService.getItemIcon(itemId);

export const getProfileIconUrl = (profileIconId: string | number) => 
  DataDragonService.getProfileIcon(profileIconId);

export const getChampionSplashUrl = (championName: string, skinNum?: number) => 
  DataDragonService.getChampionSplash(championName, skinNum);