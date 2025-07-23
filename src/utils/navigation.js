// Navigation utility functions and route mappings

export const routes = {
  home: '/',
  analyzer: '/analyzer',
  generator: '/generator',
  compliances: '/compliances',
  assessment: '/assessment'
};

export const getRouteFromPage = (page) => {
  return routes[page] || routes.home;
};

export const getPageFromRoute = (route) => {
  const routeMap = Object.entries(routes).find(([, path]) => path === route);
  return routeMap ? routeMap[0] : 'home';
};
