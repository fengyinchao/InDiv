import { INvModule, IComponent } from '../types';

import { factoryCreator } from '../di';
import { factoryModule } from '../nv-module';
import { Renderer, Vnode } from '../vnode';
import { ElementRef } from '../component';

interface Type<T = any> extends Function {
  new(...args: any[]): T;
}

export interface IPlugin {
  bootstrap(vm: InDiv): void;
}

/**
 * main: for new InDiv
 *
 * @class InDiv
 */
export class InDiv {
  private readonly pluginList: IPlugin[] = [];
  private rootElement: any;
  private routeDOMKey: string = 'router-render';
  private rootModule: INvModule = null;
  private declarations: Function[];
  private bootstrapComponent: IComponent;
  private renderer: Renderer;
  private isServerRendering: boolean = false;
  private indivEnv: string = 'browser';

  /**
   * for using plugin class, use bootstrap method of plugin instance and return plugin's id in this.pluginList
   *
   * @param {Type<IPlugin>} Modal
   * @returns {number}
   * @memberof InDiv
   */
  public use(Plugin: Type<IPlugin>): number {
    const newPlugin = new Plugin();
    newPlugin.bootstrap(this);
    return this.pluginList.push(newPlugin) - 1;
  }

  /**
   * set component Renderer
   *
   * @param {any} NewRenderer
   * @memberof InDiv
   */
  public setRenderer(NewRenderer: any): void {
    const _renderer = new NewRenderer();
    if (_renderer instanceof Renderer) this.renderer = _renderer;
    else throw new Error('Custom Renderer must extend class Renderer!');
  }

  /**
   * get component Renderer
   *
   * @readonly
   * @type {Renderer}
   * @memberof InDiv
   */
  public get getRenderer(): Renderer {
    return this.renderer;
  }

  /**
   * return component instance of root module's bootstrap
   *
   * @readonly
   * @type {IComponent}
   * @memberof InDiv
   */
  public get getBootstrapComponent(): IComponent {
    return this.bootstrapComponent;
  }

  /**
   * set route's DOM tag name
   *
   * @param {string} routeDOMKey
   * @memberof InDiv
   */
  public setRouteDOMKey(routeDOMKey: string): void {
    this.routeDOMKey = routeDOMKey;
  }

  /**
   * get route's DOM tag name
   *
   * @readonly
   * @type {string}
   * @memberof InDiv
   */
  public get getRouteDOMKey(): string {
    return this.routeDOMKey;
  }

  /**
   * get root module in InDiv
   *
   * @readonly
   * @type {INvModule}
   * @memberof InDiv
   */
  public get getRootModule(): INvModule {
    return this.rootModule;
  }

  /**
   * get root module in root module
   *
   * @readonly
   * @type {Function[]}
   * @memberof InDiv
   */
  public get getDeclarations(): Function[] {
    return this.declarations;
  }

  /**
   * set rootElement which InDiv application can be mounted
   * 
   * this method can be used in cross platform architecture
   *
   * @param {*} node
   * @memberof InDiv
   */
  public setRootElement(node: any): void {
    this.rootElement = node;
  }

  /**
   * get rootElement which InDiv application can be mounted
   * 
   * this method can be used in cross platform architecture
   *
   * @readonly
   * @type {*}
   * @memberof InDiv
   */
  public get getRootElement(): any {
    return this.rootElement;
  }

  /**
   * set env and isServerRendering for indiv env
   *
   * @param {string} env
   * @param {boolean} [isServerRendering]
   * @memberof InDiv
   */
  public setIndivEnv(env: string, isServerRendering?: boolean): void {
    this.indivEnv = env;
    if (arguments.length === 2) this.isServerRendering = isServerRendering;
  }

  /**
   * get env and isServerRendering for indiv env
   *
   * @readonly
   * @type {{ isServerRendering: boolean; indivEnv: string; }}
   * @memberof InDiv
   */
  public get getIndivEnv(): { isServerRendering: boolean; indivEnv: string; } {
    return { isServerRendering: this.isServerRendering, indivEnv: this.indivEnv };
  }

  /**
   * bootstrap NvModule
   * 
   * if not use Route it will be used
   *
   * @param {Function} Nvmodule
   * @returns {void}
   * @memberof InDiv
   */
  public bootstrapModule(Nvmodule: Function): void {
    if (!Nvmodule) throw new Error('must send a root module');

    this.rootModule = factoryModule(Nvmodule, null, this);
    this.declarations = [...this.rootModule.declarations];
  }

  /**
   * init InDiv and renderModuleBootstrap()
   *
   * @template R
   * @returns {Promise<void>}
   * @memberof InDiv
   */
  public async init<R = Element>(): Promise<IComponent> {
    if (!this.rootModule) throw new Error('must use bootstrapModule to declare a root NvModule before init');
    if (!this.renderer) throw new Error('must use plugin of platform to set a renderer in InDiv!');
    return await this.renderModuleBootstrap<R>();
  }

  /**
   * method of Component's initialization
   * 
   * init component and watch data
   *
   * @template R
   * @param {Function} BootstrapComponent
   * @param {R} nativeElement
   * @param {INvModule} [otherModule]
   * @returns {IComponent}
   * @memberof InDiv
   */
  public initComponent<R = Element>(BootstrapComponent: Function, nativeElement: R, otherModule?: INvModule): IComponent {
    const provideAndInstanceMap = new Map();
    provideAndInstanceMap.set(InDiv, this);
    provideAndInstanceMap.set(ElementRef, new ElementRef<R>(nativeElement));
    provideAndInstanceMap.set(Renderer, this.getRenderer);

    const otherInjector = otherModule ? otherModule.privateInjector : null;
    const component: IComponent = factoryCreator(BootstrapComponent, otherInjector, provideAndInstanceMap);

    component.$indivInstance = this;

    if (otherModule) {
      otherModule.declarations.forEach((findDeclaration: Function) => {
        if (!component.declarationMap.has((findDeclaration as any).selector)) component.declarationMap.set((findDeclaration as any).selector, findDeclaration);
      });
    } else {
      this.rootModule.declarations.forEach((findDeclaration: Function) => {
        if (!component.declarationMap.has((findDeclaration as any).selector)) component.declarationMap.set((findDeclaration as any).selector, findDeclaration);
      });
    }

    // set otherInjector for components from loadModule to be used
    component.otherInjector = otherInjector;

    if (component.nvOnInit) component.nvOnInit();
    if (component.watchData) component.watchData();
    if (!component.template) throw new Error('must decaler this.template in bootstrap()');

    return component;
  }

  /**
   * run renderer of Component by async
   * 
   * will call lifecycle nvBeforeMount, nvHasRender, nvAfterMount
   *
   * @template R
   * @param {IComponent} component
   * @param {R} nativeElement
   * @param {Vnode[]} [initVnode]
   * @returns {Promise<IComponent>}
   * @memberof InDiv
   */
  public async runComponentRenderer<R = Element>(component: IComponent, nativeElement: R, initVnode?: Vnode[]): Promise<IComponent> {
    const template = component.template;
    if (template && typeof template === 'string' && nativeElement) {
      if (component.nvBeforeMount) component.nvBeforeMount();
      await this.render<R>(component, nativeElement, initVnode);

      if (component.nvAfterMount && !this.isServerRendering) component.nvAfterMount();
      return component;

    } else {
      throw new Error('renderBootstrap failed: template or rootDom is not exit');
    }
  }

  /**
   * expose function for render Component
   * 
   * if otherModule don't has use rootModule
   * if has otherModule, build component will use privateInjector from loadModule instead of rootInjector
   * if has initVnode, it will use initVnode for new Component
   *
   * @template R
   * @param {Function} BootstrapComponent
   * @param {R} nativeElement
   * @param {INvModule} [otherModule]
   * @param {Vnode[]} [initVnode]
   * @returns {Promise<IComponent>}
   * @memberof InDiv
   */
  public renderComponent<R = Element>(BootstrapComponent: Function, nativeElement: R, otherModule?: INvModule, initVnode?: Vnode[]): Promise<IComponent> {
    const component = this.initComponent(BootstrapComponent, nativeElement, otherModule);
    return this.runComponentRenderer(component, nativeElement, initVnode);
  }

  /**
   * render NvModule Bootstrap
   *
   * @private
   * @template R
   * @returns {Promise<IComponent>}
   * @memberof InDiv
   */
  private async renderModuleBootstrap<R = Element>(): Promise<IComponent> {
    if (!this.rootModule.bootstrap) throw new Error('need bootstrap for render Module Bootstrap');
    const BootstrapComponent = this.rootModule.bootstrap;
    this.bootstrapComponent = await this.renderComponent<R>(BootstrapComponent, this.rootElement);
    return this.bootstrapComponent;
  }

  /**
   * render adn replace DOM
   *
   * @private
   * @template R
   * @param {IComponent} component
   * @param {R} nativeElement
   * @param {Vnode[]} [initVnode]
   * @returns {Promise<void>}
   * @memberof InDiv
   */
  private async render<R = Element>(component: IComponent, nativeElement: R, initVnode?: Vnode[]): Promise<void> {
    // if has initVnode, assign initVnode for component.saveVnode 
    if (initVnode) component.saveVnode = initVnode;
    component.nativeElement = nativeElement;
    await component.render();
  }
}
