export type HeaderNavItem = {
    title: string;
    link: string;
    target: '_self' | '_blank';
  };
  
  export const CB_HEADER_NAVS: HeaderNavItem[] = [
    {
      title: 'My Agents',
      link: '/agents',
      target: '_self',
    },
  ];