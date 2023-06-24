import { Directive, inject, Injector, Input } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Directive({
    selector: '[kwScrollViewportProvider]',
    exportAs: 'kwScrollViewportProvider',
    standalone: true,
})
export class ScrollViewportProviderDirective {
    @Input({
        alias: 'kwScrollViewportProvider',
        required: true,
    })
    virtualScrollViewport!: CdkVirtualScrollViewport;
    private readonly parentInjector = inject(Injector);

    get injector(): Injector {
        return Injector.create({
            providers: [
                {
                    provide: CdkVirtualScrollViewport,
                    useValue: this.virtualScrollViewport,
                },
            ],
            parent: this.parentInjector,
        });
    }
}
