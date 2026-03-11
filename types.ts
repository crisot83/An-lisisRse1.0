export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export interface SheetConfig {
  sheetId: string;
  gid: string;
}

export interface AppState {
  apiKey: string;
  data: string | null;
  isLoadingData: boolean;
  dataError: string | null;
  messages: Message[];
  isChatLoading: boolean;
}
