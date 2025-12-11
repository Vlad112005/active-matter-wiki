import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../services/api';

interface Settings {
  maintenance_mode: boolean;
  maintenance_message: string;
  game_version: string;
  game_status: string;
  site_version: string;
  announcement: string;
}

interface SettingsContextType {
  settings: Settings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: Settings = {
  maintenance_mode: false,
  maintenance_message: '',
  game_version: '0.1.5',
  game_status: 'beta',
  site_version: '1.0.0',
  announcement: '',
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  loading: true,
  refreshSettings: async () => {},
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const refreshSettings = async () => {
    try {
      const response = await apiClient.get<Record<string, string>>('/settings/public');
      const data = response.data || {};
      
      setSettings({
        maintenance_mode: data.maintenance_mode === 'true',
        maintenance_message: data.maintenance_message || defaultSettings.maintenance_message,
        game_version: data.game_version || defaultSettings.game_version,
        game_status: data.game_status || defaultSettings.game_status,
        site_version: data.site_version || defaultSettings.site_version,
        announcement: data.announcement || '',
      });
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSettings();
    // Обновляем каждые 30 секунд
    const interval = setInterval(refreshSettings, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
