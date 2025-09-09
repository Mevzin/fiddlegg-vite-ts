import { useState, useEffect } from 'react';
import { ISummoner } from '../Models/summoner';

export interface ISearchHistoryItem {
  id: string;
  gameName: string;
  tagLine: string;
  profileIconId: number;
  summonerLevel: number;
  searchedAt: number;
}

const STORAGE_KEY = 'fiddlegg_search_history';
const MAX_HISTORY_ITEMS = 10;

export const useSearchHistory = () => {
  const [history, setHistory] = useState<ISearchHistoryItem[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedHistory = JSON.parse(stored) as ISearchHistoryItem[];
        setHistory(parsedHistory.sort((a, b) => b.searchedAt - a.searchedAt));
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      setHistory([]);
    }
  };

  const addToHistory = (summoner: ISummoner) => {
    try {
      const newItem: ISearchHistoryItem = {
        id: summoner.id,
        gameName: summoner.gameName,
        tagLine: summoner.tagLine,
        profileIconId: summoner.profileIconId,
        summonerLevel: summoner.summonerLevel,
        searchedAt: Date.now()
      };

      setHistory(prevHistory => {
        const filteredHistory = prevHistory.filter(
          item => !(item.gameName === newItem.gameName && item.tagLine === newItem.tagLine)
        );
        
        const updatedHistory = [newItem, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS);
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
        
        return updatedHistory;
      });
    } catch (error) {
      console.error('Erro ao adicionar ao histórico:', error);
    }
  };

  const removeFromHistory = (gameName: string, tagLine: string) => {
    try {
      setHistory(prevHistory => {
        const updatedHistory = prevHistory.filter(
          item => !(item.gameName === gameName && item.tagLine === tagLine)
        );
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
        
        return updatedHistory;
      });
    } catch (error) {
      console.error('Erro ao remover do histórico:', error);
    }
  };

  const clearHistory = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setHistory([]);
    } catch (error) {
      console.error('Erro ao limpar histórico:', error);
    }
  };

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory
  };
};