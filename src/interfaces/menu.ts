export interface MenuItem {
  title: string;
  icon: React.ReactElement;
  path: string;
  children?: MenuItem[];
  action?: () => void;
}

export interface NavGroup {
  group: string;
}

export type NavEntry = MenuItem | NavGroup;
