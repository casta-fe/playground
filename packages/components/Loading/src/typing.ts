import { SizeEnum } from "@casta-fe-playground/enums";

export interface LoadingProps {
  tip: string;
  size: SizeEnum;
  absolute: boolean;
  loading: boolean;
  background: string;
  theme: "dark" | "light";
}
