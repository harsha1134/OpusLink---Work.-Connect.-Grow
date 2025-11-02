// storage-manager.js
class StorageManager {
    constructor() {
        this.MAX_ITEMS_PER_KEY = 100;
        this.COMPRESSION_ENABLED = true;
    }

    // Check available storage space
    async getAvailableStorage() {
        try {
            const testKey = 'storage_test';
            const testData = 'a'.repeat(1024);
            localStorage.setItem(testKey, testData);
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            console.warn('Storage may be full or unavailable');
            return false;
        }
    }

    // Compress data
    compressData(data) {
        if (!this.COMPRESSION_ENABLED) return data;
        try {
            const jsonString = JSON.stringify(data);
            return btoa(unescape(encodeURIComponent(jsonString)));
        } catch (e) {
            return data;
        }
    }

    // Decompress data
    decompressData(data) {
        if (!this.COMPRESSION_ENABLED || typeof data !== 'string') return data;
        try {
            const decompressed = decodeURIComponent(escape(atob(data)));
            return JSON.parse(decompressed);
        } catch (e) {
            return data;
        }
    }

    // Set item with chunking
    setItem(key, data, chunkSize = this.MAX_ITEMS_PER_KEY) {
        try {
            if (!Array.isArray(data)) {
                const compressed = this.compressData(data);
                localStorage.setItem(key, compressed);
                return true;
            }

            // Array data - split into chunks
            const chunks = {};
            for (let i = 0; i < data.length; i += chunkSize) {
                const chunk = data.slice(i, i + chunkSize);
                const chunkKey = `${key}_chunk_${Math.floor(i/chunkSize)}`;
                const compressed = this.compressData(chunk);
                localStorage.setItem(chunkKey, compressed);
                chunks[chunkKey] = true;
            }

            localStorage.setItem(`${key}_chunks`, JSON.stringify(Object.keys(chunks)));
            localStorage.setItem(`${key}_total`, data.length.toString());
            return true;
        } catch (e) {
            console.error(`Failed to store data for key: ${key}`, e);
            this.clearOldData();
            return false;
        }
    }

    // Get item
    getItem(key) {
        try {
            const chunkKeys = localStorage.getItem(`${key}_chunks`);
            
            if (!chunkKeys) {
                const data = localStorage.getItem(key);
                return data ? this.decompressData(data) : null;
            }

            const keys = JSON.parse(chunkKeys);
            let result = [];
            
            for (const chunkKey of keys) {
                const chunkData = localStorage.getItem(chunkKey);
                if (chunkData) {
                    const decompressed = this.decompressData(chunkData);
                    if (Array.isArray(decompressed)) {
                        result = result.concat(decompressed);
                    }
                }
            }
            return result;
        } catch (e) {
            console.error(`Failed to retrieve data for key: ${key}`, e);
            return null;
        }
    }

    // Clear old data
    clearOldData() {
        const keysToKeep = ['opuslink_users', 'opuslink_workers', 'user_sessions', 'app_settings'];
        const allKeys = Object.keys(localStorage);
        const keysToRemove = allKeys.filter(key => 
            !keysToKeep.some(keep => key.startsWith(keep))
        );

        keysToRemove.forEach(key => {
            localStorage.removeItem(key);
        });
        console.log(`Cleared ${keysToRemove.length} unnecessary items`);
    }

    // Get storage usage
    getStorageUsage() {
        let total = 0;
        for (const key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length;
            }
        }
        return {
            used: total,
            usedMB: (total / (1024 * 1024)).toFixed(2),
            percentage: ((total / (5 * 1024 * 1024)) * 100).toFixed(2)
        };
    }
}