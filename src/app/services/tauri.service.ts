import { Injectable } from '@angular/core';
import { getVersion } from '@tauri-apps/api/app';

@Injectable()
export abstract class TauriService {
    abstract getVersion(): Promise<string>;
}

@Injectable()
class NoOpTauriService extends TauriService {
    getVersion(): Promise<string> {
        return Promise.resolve('0.0.0-development');
    }
}

@Injectable()
class RealTauriService extends TauriService {
    getVersion(): Promise<string> {
        return getVersion();
    }
}

export const tauriServiceFactory = (): TauriService => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-explicit-any
    const isTauriAvailable = !!(window as any).__TAURI__;

    return isTauriAvailable ? new RealTauriService() : new NoOpTauriService();
};
