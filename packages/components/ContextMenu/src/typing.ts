export interface ContextMenuAxis {
  x: number;
  y: number;
}

export interface ContextMenuItem {
  label: string;
  icon?: string;
  disabled?: boolean;
  handler?: Fn;
  divider?: boolean;
  children?: ContextMenuItem[];
}
export interface CreateContextOptions {
  event: MouseEvent;
  icon?: string;
  styles?: any;
  items?: ContextMenuItem[];
}

export interface ContextMenuProps {
  event?: MouseEvent;
  styles?: any;
  items: ContextMenuItem[];
  customEvent?: MouseEvent;
  axis?: ContextMenuAxis;
  width?: number;
  showIcon?: boolean;
}

export interface ContextMenuItemContentProps {
  showIcon: boolean | undefined;
  item: ContextMenuItem;
  handler: Fn;
}
