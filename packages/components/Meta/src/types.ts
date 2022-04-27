interface Tag {
  label?: string;
  color?: string;
  tooltip?: string;
}

export interface Info {
  img?: string;
  name: string;
  tags?: Tag[];
  describe?: string;
}

export interface Follow {
  visible: boolean;
  active: boolean;
  loading: boolean;
  followClick: () => void;
}

export interface Jumper {
  visible: boolean;
  loading: boolean;
  prevClick: () => void;
  nextClick: () => void;
}
