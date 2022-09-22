const CARET = '^';
const COLON = ':';
const UNDERSCORE = '_';
const DEFAULT_LAYOUT = 'AppLayoutDefault';
const NOT_FOUND_PAGE = 'NotFound';

const importAll = r => r.keys()
  .map(key => key.slice(2)
    .replace('.vue', '').split('/'));

const pages = importAll(require.context('../views', true, /\.vue$/));

const generateRoute = path => {
  if (path[0].toLowerCase().startsWith('index') && path.length > 1) {
    path.shift();
  }

  // Note: handle root routes
  if (path.length === 1) {
    const shortcut = path[0].toLowerCase();

    return shortcut.startsWith('index')
      ? ''
      : shortcut.startsWith(UNDERSCORE)
        ? shortcut.replace(UNDERSCORE, COLON)
        : shortcut;
  }

  // Note: handle other routes
  const lastElement = path[path.length - 1];

  if (lastElement.toLowerCase().startsWith('index')) {
    path.pop();
  } else if (lastElement.startsWith(UNDERSCORE)) {
    path[path.length - 1] = lastElement.replace(UNDERSCORE, COLON);
  }

  return path.map(p => p.toLowerCase()).join('/');
};

const childrenFilter = p => ~p.indexOf(CARET);

const getChildrenByPath = pages
  .filter(path => path.some(childrenFilter))
  .map(path => {
    // Note: copy path and remove special char ^
    const copy = [...path];
    copy[copy.length - 1] = copy[copy.length - 1].slice(1);
    const key = `/${generateRoute(copy.slice(0, copy.length - 1))}`;

    return {
      path,
      route: `/${generateRoute(copy)}`,
      key
    };
  })
  .reduce((acc, cur) => {
    const key = cur.key;

    delete cur.key;

    if (acc[key]) {
      acc[key].push(cur);
    } else {
      acc[key] = [cur];
    }

    return acc;
  }, {});

const handleNotFoundPage = async () => {
  const module = await import(`../views/${NOT_FOUND_PAGE}.vue`);
  const component = await module.default;

  return {
    path: '*',
    component
  };
};

export default pages
  .filter(path => !path.some(childrenFilter))
  .map(async path => {
    if (path.includes(NOT_FOUND_PAGE)) {
      return await handleNotFoundPage();
    }

    const { default: component } = await import(`../views/${path.join('/')}`);
    const { layout, middlewares, name } = component;
    const route = `/${generateRoute([...path])}`;

    let children = [];

    if (getChildrenByPath[route]) {
      const promises = getChildrenByPath[route].map(async ({ path, route }) => {
        const { default: childComponent } =
          await import(`../views/${path.join('/')}`);

        return {
          path: route,
          name: childComponent.name,
          component: childComponent,
          meta: {
            layout: childComponent.layout || DEFAULT_LAYOUT,
            middlewares: childComponent.middlewares || {}
          }
        };
      });

      children = await Promise.all(promises);
    }

    return {
      path: route,
      name,
      component,
      meta: {
        layout: layout || DEFAULT_LAYOUT,
        middlewares: middlewares || {}
      },
      children
    };
  });
