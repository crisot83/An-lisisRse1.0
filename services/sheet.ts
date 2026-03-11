import { SheetConfig } from '../types';

// Default configuration based on user prompt
export const DEFAULT_SHEET_CONFIG: SheetConfig = {
  sheetId: '1-3u_uuEcPW98KvqKQ_ivdW0qG9FA3YMoF-Cl2zfuZI0',
  gid: '324358422'
};

export const constructCSVUrl = (config: SheetConfig): string => {
  return `https://docs.google.com/spreadsheets/d/${config.sheetId}/export?format=csv&gid=${config.gid}`;
};

export const fetchSheetData = async (config: SheetConfig): Promise<string> => {
  const url = constructCSVUrl(config);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch sheet: ${response.statusText}`);
    }
    const csvText = await response.text();
    return csvText;
  } catch (error: any) {
    console.error("Sheet fetch error:", error);
    throw new Error(
      "Could not fetch data directly from Google Sheets. This is likely due to CORS restrictions or the sheet not being 'Published to the Web'. Please paste your CSV data manually."
    );
  }
};

// Fallback data for demonstration if the real sheet is private/CORS-blocked
export const MOCK_DATA = `Store,Region,Period,Sales_k,Traffic_k,Conversion_Rate,Avg_Ticket,Target_Sales_k
National,All,Monthly,150,50,12.5%,35,160
National,All,Annual,1800,600,12.0%,36,1900
Region_North,North,Monthly,140,48,11.8%,34,150
Region_North,North,Annual,1700,580,11.5%,35,1750
Store_Madrid_Central,North,Monthly,130,45,10.5%,32,145
Store_Madrid_Central,North,Annual,1600,550,11.0%,33,1700
Region_South,South,Monthly,160,52,13.0%,36,165
Region_South,South,Annual,1900,620,12.5%,37,2000
Store_Seville_Plaza,South,Monthly,165,53,13.2%,36.5,160
Store_Seville_Plaza,South,Annual,1950,630,12.8%,37.5,1950`;
