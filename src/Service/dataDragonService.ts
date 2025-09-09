import { 
  getChampionImageUrl,
  getLatestDataDragonVersion,
  DataDragonVersionManager
} from '../Utils/dataDragonVersionManager';

export class DataDragonService {

  private static urlCache = new Map<string, string>();
  

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
  

  static async preloadCommonAssets(championNames: string[] = [], itemIds: (string | number)[] = []): Promise<void> {
    try {
  
      
      const championPromises = championNames.map(name => this.getChampionIcon(name));
      
      const itemPromises = itemIds.map(id => this.getItemIcon(id));
      
      await Promise.allSettled([...championPromises, ...itemPromises]);
      
  
    } catch (error) {
      console.error('❌ Erro ao pré-carregar assets:', error);
    }
  }
  

  static clearCache(): void {
    this.urlCache.clear();

  }
  

  static getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.urlCache.size,
      keys: Array.from(this.urlCache.keys())
    };
  }
  

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