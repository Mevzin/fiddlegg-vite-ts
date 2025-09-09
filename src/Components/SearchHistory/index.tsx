import { useState, useEffect } from 'react';
import { FaArrowRight, FaTrash, FaClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { ISearchHistoryItem } from '../../hooks/useSearchHistory';
import { getProfileIconUrl } from '../../Service/dataDragonService';

interface SearchHistoryProps {
  history: ISearchHistoryItem[];
  onRemoveItem: (gameName: string, tagLine: string) => void;
  onClearHistory: () => void;
  onSelectPlayer: (gameName: string, tagLine: string) => void;
}

export const SearchHistory = ({ history, onRemoveItem, onClearHistory, onSelectPlayer }: SearchHistoryProps) => {
  const [profileUrls, setProfileUrls] = useState<Record<number, string>>({});
  const [loadingIcons, setLoadingIcons] = useState<Set<number>>(new Set());

  useEffect(() => {
    history.forEach(item => {
      if (!profileUrls[item.profileIconId] && !loadingIcons.has(item.profileIconId)) {
        loadProfileIcon(item.profileIconId);
      }
    });
  }, [history]);

  const loadProfileIcon = async (iconId: number) => {
    if (loadingIcons.has(iconId)) return;
    
    setLoadingIcons(prev => new Set(prev).add(iconId));
    
    try {
      const url = await getProfileIconUrl(iconId);
      setProfileUrls(prev => ({ ...prev, [iconId]: url }));
    } catch (error) {
      console.error(`Erro ao carregar ícone ${iconId}:`, error);
    } finally {
      setLoadingIcons(prev => {
        const newSet = new Set(prev);
        newSet.delete(iconId);
        return newSet;
      });
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d atrás`;
    if (hours > 0) return `${hours}h atrás`;
    if (minutes > 0) return `${minutes}m atrás`;
    return 'Agora';
  };

  if (history.length === 0) {
    return (
      <div className="w-80 mt-6 p-4 bg-gray-700/30 rounded-md border border-gray-600">
        <div className="flex items-center justify-center text-gray-400">
          <FaClock className="mr-2" />
          <span>Nenhuma pesquisa recente</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 mt-6 bg-gray-700/30 rounded-md border border-gray-600">
      <div className="flex items-center justify-between p-3 border-b border-gray-600">
        <div className="flex items-center text-gray-300">
          <FaClock className="mr-2" />
          <span className="font-medium">Pesquisas Recentes</span>
        </div>
        <button
          onClick={onClearHistory}
          className="text-gray-400 hover:text-red-400 transition-colors"
          title="Limpar histórico"
        >
          <FaTrash size={12} />
        </button>
      </div>
      
      <div className="max-h-64 overflow-y-auto">
        {history.map((item) => (
          <div
            key={`${item.gameName}-${item.tagLine}-${item.searchedAt}`}
            className="flex items-center justify-between p-3 border-b border-gray-600/50 last:border-b-0 hover:bg-gray-600/30 transition-colors"
          >
            <div 
              className="flex items-center flex-1 cursor-pointer"
              onClick={() => onSelectPlayer(item.gameName, item.tagLine)}
            >
              {profileUrls[item.profileIconId] ? (
                <img
                  className="w-10 h-10 rounded-full border border-gray-500 object-cover"
                  src={profileUrls[item.profileIconId]}
                  alt={`Ícone de ${item.gameName}`}
                />
              ) : (
                <div className="w-10 h-10 rounded-full border border-gray-500 bg-gray-700 flex items-center justify-center">
                  {loadingIcons.has(item.profileIconId) ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b border-gray-400"></div>
                  ) : (
                    <span className="text-gray-300 text-xs font-bold">
                      {item.gameName.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
              )}
              
              <div className="ml-3 flex-1">
                <div className="text-white text-sm font-medium">
                  {item.gameName}#{item.tagLine}
                </div>
                <div className="text-gray-400 text-xs">
                  Nível {item.summonerLevel} • {formatTimeAgo(item.searchedAt)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Link
                to={`/league/${encodeURIComponent(item.gameName)}/${encodeURIComponent(item.tagLine)}`}
                className="flex items-center justify-center w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                title="Ver perfil completo"
              >
                <FaArrowRight size={12} />
              </Link>
              
              <button
                onClick={() => onRemoveItem(item.gameName, item.tagLine)}
                className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-red-400 transition-colors"
                title="Remover do histórico"
              >
                <FaTrash size={10} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;