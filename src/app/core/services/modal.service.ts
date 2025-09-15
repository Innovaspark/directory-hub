import {
  Injectable,
  TemplateRef,
  ApplicationRef,
  ComponentFactoryResolver,
  Injector,
  ComponentRef,
  Type,
  StaticProvider,
} from '@angular/core';

// DialogRef class
export class DialogRef {
  constructor(private closeFn: () => void) {}

  close() {
    this.closeFn();
  }
}

// ModalInstance interface
interface ModalInstance {
  overlay: HTMLElement;
  container: HTMLElement;
  componentRef?: ComponentRef<any>;
  dialogRef?: DialogRef;
}

// ModalService
@Injectable({ providedIn: 'root' })
export class ModalService {
  private modals: ModalInstance[] = [];

  constructor(
    private injector: Injector,
    private appRef: ApplicationRef,
    private cfr: ComponentFactoryResolver
  ) {}

  open(content: TemplateRef<any> | Type<any>): DialogRef | undefined {
    if (typeof document === 'undefined') return undefined; // SSR-safe

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className =
      'fixed inset-0 bg-black/50 z-40 opacity-0 transition-opacity duration-200';
    overlay.addEventListener('click', () => this.closeTopModal());
    document.body.appendChild(overlay);

    // Create container
    const container = document.createElement('div');
    container.className =
      'fixed inset-0 flex items-center justify-center z-50';
    container.addEventListener('click', (e) => e.stopPropagation());
    document.body.appendChild(container);

    const instance: ModalInstance = { overlay, container };

    // Create DialogRef
    const dialogRef = new DialogRef(() => this.closeInstance(instance));
    instance.dialogRef = dialogRef;

    if (content instanceof TemplateRef) {
      // TemplateRef
      const viewRef = content.createEmbeddedView({ dialogRef });
      this.appRef.attachView(viewRef);
      container.appendChild(viewRef.rootNodes[0]);
    } else {
      // Component
      const providers: StaticProvider[] = [{ provide: DialogRef, useValue: dialogRef }];
      const inj = Injector.create({ providers, parent: this.injector });

      const factory = this.cfr.resolveComponentFactory(content);
      const componentRef = factory.create(inj);
      this.appRef.attachView(componentRef.hostView);
      container.appendChild((componentRef.hostView as any).rootNodes[0]);

      instance.componentRef = componentRef;
    }

    this.modals.push(instance);

    // Animate in
    requestAnimationFrame(() => {
      overlay.classList.add('opacity-100');
      container.firstElementChild?.classList.add('scale-100');
    });

    return dialogRef;
  }

  closeTopModal() {
    const top = this.modals.pop();
    if (!top) return;
    this.closeInstance(top);
  }

  private closeInstance(instance: ModalInstance) {
    // Animate out
    instance.overlay.classList.remove('opacity-100');
    instance.container.firstElementChild?.classList.remove('scale-100');

    setTimeout(() => {
      if (document.body.contains(instance.overlay))
        document.body.removeChild(instance.overlay);
      if (document.body.contains(instance.container))
        document.body.removeChild(instance.container);

      if (instance.componentRef) {
        this.appRef.detachView(instance.componentRef.hostView);
        instance.componentRef.destroy();
      }
    }, 200);
  }
}
