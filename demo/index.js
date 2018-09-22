import { InDiv, Component, Router, Utils, NvModule, Service, nvHttp } from '../build';

class HeroSearchService1 {
  constructor() {
    console.log('js HeroSearchService1 is comming');
  }

  test() {
    console.log('HeroSearchService !!!1111');
  }
}
Service({
  isSingletonMode: true,
})(HeroSearchService1);


class HeroSearchService2 {
  test() {
    console.log('HeroSearchService !!!2222');
  }
}
Service({
  isSingletonMode: false,
})(HeroSearchService2);

class HeroSearchService {
  constructor(
    heroSearchService1,
  ) {
    console.log('测试 js 依赖注入', heroSearchService1);
    this.hsr = heroSearchService1;
    this.hsr.test();
  }

  test() {
    console.log('HeroSearchService !!!000000000');
  }
}
Service({
  isSingletonMode: false,
})(HeroSearchService);

class RouteChild {
  constructor(heroSearchService2) {
    this.heroSearchService = heroSearchService2;
    this.heroSearchService.test();
    this.state = {
      a: 'a',
      b: null,
      d: [
        {
          z: 111111111111111,
          b: 'a',
        },
        {
          z: 33333333333333,
          b: 'a',
        },
      ],
    };
  }
  nvOnInit() {
    this.setState({
      b: this.props.a,
    });
    console.log(555, 'PCChild nvOnInit props11', this.props);
  }
  nvHasRender() {
    console.log('RouteChild: this.props.a', this.props.a);
  }
  nvReceiveProps(nextProps) {
    console.log(3333, nextProps);
    this.state.b = nextProps.a;
  }
}
Component({
  selector: 'route-child',
  template: (`
    <div>
      <p>子路由的子组件::{{state.b}}</p>
      <pp-childs ax={state.b}></pp-childs>
    </div>`),
})(RouteChild);

class PCChild {
  constructor() {
    this.state = {
      a: 'a',
      b: null,
      d: [
        {
          z: 111111111111111,
          b: 'a',
        },
        {
          z: 33333333333333,
          b: 'a',
        },
      ],
    };
  }
  nvHasRender() {
    console.log('PCChild: this.props.ax', this.props.ax);
  }
  nvOnInit() {
    this.setState({
      b: this.props.ax,
    });
    // this.setState({
    //   c: this.props.ax,
    // });
    console.log(555, 'PCChild nvOnInit props11', this.props);
    // this.props.b(3);
  }

  sendProps(i) {
    // this.props.b(i);
    // this.props.ax = 100;
    console.log('this.props', this.props);
  }

  nvBeforeMount() {
    console.log('PCChild nvBeforeMount props11', this.props.ax);
  }

  nvAfterMount() {
    console.log('PCChild nvAfterMount props11', this.props.ax);
  }

  nvReceiveProps(nextProps) {
    console.log(this.props.ax);
    console.log(4444, nextProps);
    this.state.b = nextProps.ax;
  }
}
Component({
  selector: 'pp-childs',
  template: (`
    <div>
      子组件的子组件<br/>
      <p nv-on:click="@sendProps(3)">PCChild props.ax:: {{state.b}}</p>
      <p nv-repeat="let a in state.d">1232{{a.z}}</p>
    </div>
  `),
})(PCChild);

class PComponent {
  nvOnInit() {
    this.state = {
      a: 'a子组件',
      b: 100,
      c: '<p>1111</p>',
      d: [
        {
          z: 111111111111111,
          b: 'a',
        },
        {
          z: 33333333333333,
          b: 'a',
        },
      ],
      e: true,
      ax: this.props.ax,
    };
    console.log('props11', this.props);
  }
  nvBeforeMount() {
    console.log('nvBeforeMount props11', this.props);
  }

  nvAfterMount() {
    console.log('nvAfterMount props11', this.props);
  }
  nvReceiveProps(nextProps) {
    console.log(1111111111111, nextProps);
    this.state.ax = nextProps.ax;
  }
  componentClick(a) {
    // alert('点击了组件');
    // console.log('this.props.ax', this.props.ax);
    // this.setState({ b: 2 });
    // // this.setProps({ ax: 5 });
    // this.props.b(3);
    // this.a = 1;
    console.log('aa', a);
  }
  sendProps(ax) {
    this.props.b(ax);
    console.log('this', this);
  }
  getProps(a) {
    alert('子组件里 里面传出来了');
    this.setState({ a: a });
    this.props.b(a);
  }

  nvWatchState(oldState) {
    console.log('newData Component:', oldState);
  }
}

Component({
  selector: 'pc-component',
  template: (`
    <div>
      <p nv-if="state.e" nv-class="state.a" nv-repeat="let a in state.d"  nv-on:click="@componentClick(state.d)">你好： {{a.z}}</p>
      state.d: <input nv-repeat="let a in state.d" nv-model="a.z" />
      <p nv-on:click="@sendProps(5)">props from component.state.a: {{state.ax}}</p>
    </div>`),
})(PComponent);


class R1 {
  constructor(heroSearchService) {
    this.heroSearchService = heroSearchService;
    this.heroSearchService.test();
    this.utils = new Utils();
    this.state = {
      a: 'a11',
      b: 2,
      d: [{
        z: 111111111111111,
        b: 'a',
        show: true,
      },
          {
        z: 33333333333333,
        b: 'a',
        show: true,
      }],
      c: 'c',
      e: [{
        z: 232323,
        b: 'a',
        show: true,
      },
          {
        z: 1111,
        b: 'a',
        show: false,
      }],
      f: true,
    };
  }

  nvOnInit() {
    this.utils.setCookie('tutor', {
      name: 'gerry',
      github: 'https://github.com/DimaLiLongJi',
    }, { expires: 7 });
  }
  nvBeforeMount() {
    const cookie = this.utils.getCookie('tutor');
    console.log('cookie is', cookie);
    console.log('is nvBeforeMount');
  }
  nvAfterMount() {
    // console.log('is nvAfterMount');
  }
  nvRouteChange(lastRoute, newRoute) {
    console.log('R1 is nvRouteChange', lastRoute, newRoute);
  }
  nvWatchState(oldState) {
    console.log('oldState Controller:', oldState);
  }
  showAlert(a) {
    this.setLocation('/R1/C1', { a: '1' });
    console.log('this.$location', this.getLocation());
  }
  getProps(a) {
    // alert('里面传出来了');
    console.log('被触发了！', a);
    this.setState({ a: a });
  }
}

Component({
  selector: 'R1',
  template: (`
  <div>
    <pc-component ax="{state.a}" b="{@getProps}"></pc-component>
    下面跟组件没关系<br/>
    <div nv-if="state.f">
      ef
      <input nv-repeat="let a in state.e" nv-model="a.z" />
      <p nv-class="state.c" nv-if="a.show" nv-repeat="let a in state.e" nv-text="a.z" nv-on:click="@showAlert(a.z)"></p>
      <p>111this.state.a：{{state.a}}</p>
      <input nv-model="state.a" />
    </div>
    下面是子路由<br/>
    <router-render></router-render>
  </div>
    `),
})(R1);


class R2 {
  constructor(
    heroSearchService1,
    heroSearchService,
  ) {
    this.heroSearchService1 = heroSearchService1;
    this.heroSearchService1.test();
    this.state = { a: 1 };
  }
  nvOnInit() {
    console.log('this.$location222', this.getLocation());
  }
  nvBeforeMount() {
    // console.log('is nvBeforeMount');
  }
  nvAfterMount() {
    // console.log('is nvAfterMount');
  }
  nvHasRender() {
    console.log('！！father: this.state.a', this.state.a);
  }
  nvRouteChange(lastRoute, newRoute) {
    console.log('R2 is nvRouteChange', lastRoute, newRoute);
  }

  nvWatchState(oldState) {
    console.log('oldState Controller:', oldState);
  }
  showAlert() {
    console.log('this.state.a', this.state.a);
    // alert('我错了 点下控制台看看吧');
    // this.setState(() => ({ a: 2 }));
  }
  bindChange(a) {
    console.log('aaa', a);
  }
  showLocation() {
    this.setLocation('/R1/C1/D1', { b: '1' });
  }
}
Component({
  selector: 'R2',
  template: (`
  <div>
    <p nv-on:click="@showLocation()">点击显示子路由跳转</p>
    <input nv-model="state.a"/>
    <br/>
    <p nv-on:click="@showAlert()">点击显示this.state.a:{{state.a}}</p>
    子组件:<br/>
    <route-child a="{state.a}"></route-child>
    <router-render></router-render>
  </div>
  `),
})(R2);

class TestComponent {
  nvOnInit() {
    this.state = {
      man: this.props.man,
    };
  }

  click() {
    console.log('this.state.man', this.state.man);
    this.state.man = 'fuck!';
  }
}
Component({
  selector: 'test-component',
  template: (`
    <div>
      <p nv-on:click="@click()">测试repeat组件: {{state.man}}</p>
    </div>`),
})(TestComponent);


class Container {
  constructor(
    heroSearchService,
    heroSearchService1,
  ) {
    this.ss = heroSearchService;
    this.ss.test();
    console.log('heroSearchService1', heroSearchService1);
    console.log('nvHttp', nvHttp);
    this.state = {
      a: 1,
      b: 3,
      testArray: [
        {
          name: 'gerry',
          sex: '男',
          job: [
            {
              id: 1,
              name: '程序员',
            },
            {
              id: 2,
              name: '码农',
            },
            {
              id: 3,
              name: '帅',
            },
          ],
        },
        {
          name: 'nina',
          sex: '女',
          // job: ['老师', '英语老师', '美1'],
          job: [
            {
              id: 1,
              name: '老师',
            },
            {
              id: 2,
              name: '英语老师',
            },
            {
              id: 3,
              name: '美',
            },
          ],
        }],
      testArray2: ['程序员3', '码农3', '帅3'],
    };
  }
  nvOnInit() {
    console.log('nvOnInit Container');
  }

  nvAfterMount() {
  }

  go() {
    this.setLocation('/R1', { b: '1' });
    console.log('R1 nvOnInit', this.getLocation());
  }

  show(a, index) {
    console.log('aaaa', a);
    console.log('index', index);
  }

  showInput(event, index) {
    console.log('aaaa', event.target.value);
    const testArray2 = this.state.testArray2;
    testArray2[index] = event.target.value;
    console.log('this.state.testArray2', this.state.testArray2);
    // this.state.testArray2[index] = event.target.value;
  }

  changeInput() {
    this.state.a = 4;
    this.state.testArray = [
      {
        name: 'gerry',
        sex: '男',
        job: [
          {
            id: 1,
            name: '程序员',
          },
          {
            id: 2,
            name: '码农',
          },
          {
            id: 3,
            name: '帅',
          },
        ],
      },
      {
        name: 'gerry2',
        sex: '男2',
        job: [
          {
            id: 1,
            name: '程序员2',
          },
          {
            id: 2,
            name: '码农2',
          },
          {
            id: 3,
            name: '帅2',
          },
        ],
      },
      {
        name: 'nina',
        sex: '女',
        job: [
          {
            id: 1,
            name: '老师',
          },
          {
            id: 2,
            name: '英语老师',
          },
          {
            id: 3,
            name: '美',
          },
        ],
      }];
  }
}

Component({
  selector: 'container-wrap',
  template: (`
    <div>
      <p id="aa" nv-if="state.a" nv-on:click="@changeInput()">{{state.a}}</p>
      <test-component nv-repeat="let man in state.testArray" man="{man.name}" nv-key="man.name" nv-if="state.a"></test-component>
      <p nv-on:click="@go()">container: {{state.a}}</p>
      <input nv-model="state.a" />
      <div nv-repeat="let man in state.testArray" nv-key="man.name">
          <test-component man="{man.name}"></test-component>
          <div nv-on:click="@show(state.testArray2)">姓名：{{man.name}}</div>
          <div>性别：{{man.sex}}</div>
          <a nv-href="man.name">a {{man.sex}}</a>
          <img nv-src="man.name" alt="测试src" />
          <input nv-on:click="@show(b, $index)" nv-repeat="let b in state.testArray2" nv-key="$index" nv-on:input="@showInput($event, $index)" nv-text="b" nv-class="b" />
          <div class="fuck" nv-repeat="let c in man.job" nv-key="c.id">
            <input nv-on:click="@show(c, $index)" nv-model="c.name" nv-class="c.id" />
          </div>
      </div>
      <router-render></router-render>
    </div>
  `),
})(Container);

class M2 {}
NvModule({
  components: [
    R2,
    RouteChild,
    PCChild,
  ],
  providers: [
    HeroSearchService2,
  ],
  exports: [
    R2,
    RouteChild,
  ],
})(M2);

class M1 {}
NvModule({
  imports: [
    M2,
  ],
  components: [
    Container,
    PComponent,
    TestComponent,
    R1,
  ],
  providers: [
    HeroSearchService,
    HeroSearchService1,
  ],
})(M1);

const router = new Router();

const routes = [
  {
    path: '/',
    // redirectTo: '/R1',
    component: 'container-wrap',
    children: [
      {
        path: '/R1',
        component: 'R1',
        // redirectTo: '/R2',
        children: [
          {
            path: '/C1',
            component: 'R2',
            children: [
              {
                path: '/D1',
                redirectTo: '/R2',
              },
            ],
          },
          {
            path: '/C2',
            redirectTo: '/R2',
          },
        ],
      },
      {
        path: '/R2',
        component: 'R2',
        children: [
          {
            path: '/:id',
            component: 'R1',
            children: [
              {
                path: '/D1',
                redirectTo: '/R1/C1',
              },
            ],
          },
        ],
      },
    ],
  },
];
router.setRootPath('/demo');
// router.setRootPath('/');
router.init(routes);
router.routeChange = (old, next) => {
  console.log('routeChange', old, next);
};

const inDiv = new InDiv();
inDiv.bootstrapModule(M1);
inDiv.use(router);
inDiv.init();
