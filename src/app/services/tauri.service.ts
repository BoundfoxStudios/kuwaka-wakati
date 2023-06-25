import { Injectable } from '@angular/core';
import { getVersion } from '@tauri-apps/api/app';
import { save } from '@tauri-apps/api/dialog';
import { saveAs } from 'file-saver';
import { writeBinaryFile } from '@tauri-apps/api/fs';

@Injectable()
export abstract class TauriService {
    abstract getVersion(): Promise<string>;

    abstract save(blob: Blob, filename: string): Promise<void>;
}

@Injectable()
class BrowserTauriService extends TauriService {
    getVersion(): Promise<string> {
        // Always returning 0.0.0-development here, because the app should not be used in the browser to avoid data loss.
        return Promise.resolve('0.0.0-development');
    }

    save(blob: Blob, filename: string): Promise<void> {
        saveAs(blob, filename);
        return Promise.resolve();
    }
}

@Injectable()
class RealTauriService extends TauriService {
    getVersion(): Promise<string> {
        return getVersion();
    }

    async save(blob: Blob, filename: string): Promise<void> {
        const filePath = await save({ defaultPath: filename });

        if (!filePath) {
            return;
        }

        await writeBinaryFile(filePath, await blob.arrayBuffer());
    }
}

export const tauriServiceFactory = (): TauriService => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-explicit-any
    const isTauriAvailable = !!(window as any).__TAURI__;

    return isTauriAvailable ? new RealTauriService() : new BrowserTauriService();
};
