export class DataDragonVersionManager {
  private static readonly VERSION_URL = 'https://ddragon.leagueoflegends.com/api/versions.json';
  private static readonly CACHE_KEY = 'ddragon_version';
  private static readonly CACHE_DURATION = 5 * 60 * 1000;
  private static readonly FALLBACK_VERSION = '15.17.1';

  private static cachedVersion: string | null = null;
  private static cacheTimestamp: number = 0;

  static async getLatestVersion(forceRefresh: boolean = false): Promise<string> {

    if (!forceRefresh && this.cachedVersion && this.isCacheValid()) {
      return this.cachedVersion;
    }


    if (!forceRefresh) {
      const cached = this.getCachedVersionFromStorage();
      if (cached) {
        this.cachedVersion = cached;
        return cached;
      }
    }

    try {
      console.log('🔄 Buscando versão mais recente do Data Dragon...');
      const response = await fetch(this.VERSION_URL);

      if (!response.ok) {
        throw new Error(`Erro ao buscar versões: ${response.status}`);
      }

      const versions = await response.json() as string[];
      const latestVersion = versions[0];


      this.cachedVersion = latestVersion;
      this.cacheTimestamp = Date.now();


      this.saveCachedVersionToStorage(latestVersion);

      console.log(`✅ Versão mais recente: ${latestVersion}`);
      return latestVersion;
    } catch (error) {
      console.error('❌ Erro ao buscar versão do Data Dragon:', error);


      const fallbackVersion = this.FALLBACK_VERSION;
      console.log(`🔄 Usando versão fallback: ${fallbackVersion}`);
      return fallbackVersion;
    }
  }

  static async buildDataDragonUrl(path: string, forceRefresh: boolean = false): Promise<string> {
    const version = await this.getLatestVersion(forceRefresh);
    return `https://ddragon.leagueoflegends.com/cdn/${version}/${path}`;
  }

  static async getChampionImageUrl(
    championKey: string,
    skinNum: number = 0,
    type: 'splash' | 'loading' | 'icon' = 'icon',
    forceRefresh: boolean = false
  ): Promise<string> {
    const version = await this.getLatestVersion(forceRefresh);

    switch (type) {
      case 'splash':
        return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championKey}_${skinNum}.jpg`;
      case 'loading':
        return `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${championKey}_${skinNum}.jpg`;
      case 'icon':
      default:
        return `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${championKey}.png`;
    }
  }

  static async getItemIconUrl(itemId: string, forceRefresh: boolean = false): Promise<string> {
    const version = await this.getLatestVersion(forceRefresh);
    return `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${itemId}.png`;
  }

  static async getChampionIconUrl(championKey: string, forceRefresh: boolean = false): Promise<string> {
    return this.getChampionImageUrl(championKey, 0, 'icon', forceRefresh);
  }

  static async getProfileIconUrl(profileIconId: string, forceRefresh: boolean = false): Promise<string> {
    const version = await this.getLatestVersion(forceRefresh);
    return `https://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${profileIconId}.png`;
  }

  private static isCacheValid(): boolean {
    if (!this.cachedVersion || !this.cacheTimestamp) {
      return false;
    }

    const now = Date.now();
    const timeDiff = now - this.cacheTimestamp;
    return timeDiff < this.CACHE_DURATION;
  }

  private static getCachedVersionFromStorage(): string | null {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (!cached) return null;

      const data = JSON.parse(cached);
      const cacheAge = Date.now() - new Date(data.lastUpdated).getTime();

      if (cacheAge > this.CACHE_DURATION) {
        localStorage.removeItem(this.CACHE_KEY);
        return null;
      }

      this.cacheTimestamp = new Date(data.lastUpdated).getTime();
      return data.version;
    } catch (error) {
      console.warn('Erro ao ler cache do localStorage:', error);
      return null;
    }
  }

  private static saveCachedVersionToStorage(version: string): void {
    try {
      const data = {
        version,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Erro ao salvar cache no localStorage:', error);
    }
  }

  public static clearCache(): void {
    this.cachedVersion = null;
    this.cacheTimestamp = 0;
    try {
      localStorage.removeItem(this.CACHE_KEY);
    } catch (error) {
      console.warn('Erro ao limpar cache do localStorage:', error);
    }
  }

  public static getCacheInfo(): { version: string; lastUpdated: Date } | null {
    return this.cachedVersion ? {
      version: this.cachedVersion,
      lastUpdated: new Date(this.cacheTimestamp)
    } : null;
  }
}


export const getLatestDataDragonVersion = (forceRefresh?: boolean) =>
  DataDragonVersionManager.getLatestVersion(forceRefresh);

export const buildDataDragonUrl = (path: string, forceRefresh?: boolean) =>
  DataDragonVersionManager.buildDataDragonUrl(path, forceRefresh);

export const getChampionImageUrl = (
  championKey: string,
  skinNum?: number,
  type?: 'splash' | 'loading' | 'icon',
  forceRefresh?: boolean
) => DataDragonVersionManager.getChampionImageUrl(championKey, skinNum, type, forceRefresh);

export const getItemIconUrl = (itemId: string, forceRefresh?: boolean) =>
  DataDragonVersionManager.getItemIconUrl(itemId, forceRefresh);

export const getChampionIconUrl = (championKey: string, forceRefresh?: boolean) =>
  DataDragonVersionManager.getChampionIconUrl(championKey, forceRefresh);

export const getProfileIconUrl = (profileIconId: string, forceRefresh?: boolean) =>
  DataDragonVersionManager.getProfileIconUrl(profileIconId, forceRefresh);