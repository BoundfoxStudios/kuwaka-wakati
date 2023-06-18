import { Observable as RxObservable } from 'rxjs';
import { Observable as DexieObservable } from 'dexie';

export const dexieToRxObservable = <T>(dexieObservable: DexieObservable<T>): RxObservable<T> =>
    new RxObservable(rxObserver => {
        const dexieSubscription = dexieObservable.subscribe({
            next: value => rxObserver.next(value),
            error: error => rxObserver.error(error),
            complete: () => rxObserver.complete(),
        });

        return () => dexieSubscription.unsubscribe();
    });
