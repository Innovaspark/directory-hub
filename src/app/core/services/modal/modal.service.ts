import {
  Injectable,
  TemplateRef,
  ApplicationRef,
  ComponentFactoryResolver,
  Injector,
  ComponentRef,
  Type,
  StaticProvider,
  InjectionToken,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {MODAL_DATA} from '@services/modal/modal-data.token';

export class DialogRef<T = boolean> {
  private readonly _afterClosed = new Subject<T | undefined>();

  constructor(private _closeHandler: (result?: T) => void) {}

  close(result?: T): void {
    this._closeHandler(result);
  }

  afterClosed(): Observable<T | undefined> {
    return this._afterClosed.asObservable();
  }

  _notifyClosed(result?: T): void {
    this._afterClosed.next(result);
    this._afterClosed.complete();
  }
}

interface ModalInstance {
  wrapper: HTMLElement;
  overlay: HTMLElement;
  container: HTMLElement;
  componentRef?: ComponentRef<any>;
  dialogRef?: DialogRef;
}

@Injectable({ providedIn: 'root' })
export class ModalService {
  private modals: ModalInstance[] = [];

  constructor(
    private injector: Injector,
    private appRef: ApplicationRef,
    private cfr: ComponentFactoryResolver
  ) {}

  open<TComponent = any, TData = any>(
    content: TemplateRef<any> | Type<TComponent>,
    data?: TData
  ): DialogRef<any> | undefined {
    if (typeof document === 'undefined') return undefined;

    const wrapper = document.createElement('div');
    wrapper.className = 'fixed inset-0 z-[9999]';

    const overlay = document.createElement('div');
    overlay.className =
      'absolute inset-0 bg-black/50 opacity-0 transition-opacity duration-200';
    overlay.addEventListener('click', () => this.closeTopModal());
    wrapper.appendChild(overlay);

    const container = document.createElement('div');
    container.className = 'absolute inset-0 flex items-center justify-center';
    container.addEventListener('click', (e) => e.stopPropagation());
    wrapper.appendChild(container);

    document.body.appendChild(wrapper);

    const instance: ModalInstance = { wrapper, overlay, container };
    const dialogRef = new DialogRef((result?: any) =>
      this.closeInstance(instance, result)
    );
    instance.dialogRef = dialogRef;

    if (content instanceof TemplateRef) {
      const viewRef = content.createEmbeddedView({ dialogRef, data });
      this.appRef.attachView(viewRef);
      container.appendChild(viewRef.rootNodes[0]);
    } else {
      const providers: StaticProvider[] = [
        { provide: DialogRef, useValue: dialogRef },
        { provide: MODAL_DATA, useValue: data } // <-- inject the data
      ];
      const inj = Injector.create({ providers, parent: this.injector });

      const factory = this.cfr.resolveComponentFactory(content);
      const componentRef = factory.create(inj);
      this.appRef.attachView(componentRef.hostView);
      container.appendChild((componentRef.hostView as any).rootNodes[0]);
      instance.componentRef = componentRef;
    }

    this.modals.push(instance);

    requestAnimationFrame(() => {
      overlay.classList.add('opacity-100');
      container.firstElementChild?.classList.add('scale-100');
    });

    return dialogRef;
  }

  closeTopModal(result?: any) {
    const top = this.modals.pop();
    if (!top) return;
    this.closeInstance(top, result);
  }

  private closeInstance(instance: ModalInstance, result?: any) {
    instance.overlay.classList.remove('opacity-100');
    instance.container.firstElementChild?.classList.remove('scale-100');

    setTimeout(() => {
      if (document.body.contains(instance.wrapper)) {
        document.body.removeChild(instance.wrapper);
      }

      if (instance.componentRef) {
        this.appRef.detachView(instance.componentRef.hostView);
        instance.componentRef.destroy();
      }

      instance.dialogRef?._notifyClosed(result);
    }, 200);
  }
}
