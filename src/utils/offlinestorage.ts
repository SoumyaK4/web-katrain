export class OfflineStorage {  
  private db: IDBDatabase | null = null;  
  private readonly DB_NAME = 'web-katrain-offline';  
  private readonly VERSION = 1;  
  
  async init(): Promise<void> {  
    return new Promise((resolve, reject) => {  
      const request = indexedDB.open(this.DB_NAME, this.VERSION);  
        
      request.onerror = () => reject(request.error);  
      request.onsuccess = () => {  
        this.db = request.result;  
        resolve();  
      };  
        
      request.onupgradeneeded = (event) => {  
        const db = (event.target as IDBOpenDBRequest).result;  
          
        // Store for game data  
        if (!db.objectStoreNames.contains('games')) {  
          db.createObjectStore('games', { keyPath: 'id' });  
        }  
          
        // Store for analysis cache  
        if (!db.objectStoreNames.contains('analysis')) {  
          db.createObjectStore('analysis', { keyPath: 'positionId' });  
        }  
      };  
    });  
  }  
  
  async saveGame(gameData: any): Promise<void> {  
    if (!this.db) await this.init();  
      
    const transaction = this.db!.transaction(['games'], 'readwrite');  
    const store = transaction.objectStore('games');  
    store.put(gameData);  
  }  
  
  async getGame(id: string): Promise<any> {  
    if (!this.db) await this.init();  
      
    return new Promise((resolve) => {  
      const transaction = this.db!.transaction(['games'], 'readonly');  
      const store = transaction.objectStore('games');  
      const request = store.get(id);  
        
      request.onsuccess = () => resolve(request.result);  
      request.onerror = () => resolve(null);  
    });  
  }  
}