import { AntvG6CanvasNode, AntvG6DomNode } from "@casta-fe-playground/components/AntvG6";
import { BasicArrow, BasicHelp, BasicTitle } from "@casta-fe-playground/components/Basic";
import {
  Button,
  GroupButton,
  ModalButton,
  PopConfirmButton
} from "@casta-fe-playground/components/Button";
import { TaButtonGroup } from "@casta-fe-playground/components/ButtonGroup";
// import { CardList } from "@casta-fe-playground/components/CardList";
import { ClickOutSide } from "@casta-fe-playground/components/ClickOutSide";
import {
  CollapseContainer,
  LazyContainer,
  ScrollContainer
} from "@casta-fe-playground/components/Container";
import { CountButton, CountdownInput } from "@casta-fe-playground/components/CountDown";
import { CountTo } from "@casta-fe-playground/components/CountTo";
import { CropperAvatar, CropperImage } from "@casta-fe-playground/components/Cropper";
// import { DateInterval } from "@casta-fe-playground/components/DateInterval";
import { Description } from "@casta-fe-playground/components/Description";
import { BasicDrawer } from "@casta-fe-playground/components/Drawer";
import { Dropdown } from "@casta-fe-playground/components/Dropdown";
// import { ExpExcelModal, ImpExcel } from "@casta-fe-playground/components/Excel";
import { FixedMenu } from "@casta-fe-playground/components/FixedMenu";
import {
  ApiCascader,
  ApiRadioGroup,
  ApiSelect,
  ApiTreeSelect,
  BasicForm,
  RadioButtonGroup
} from "@casta-fe-playground/components/Form";
import { Icon, IconPicker, SvgIcon } from "@casta-fe-playground/components/Icon";
import {
  TaInput,
  TaInputGroup,
  TaInputNumber,
  TaInputPassword,
  TaInputSearch,
  TaInputTextArea
} from "@casta-fe-playground/components/Input";
import { InputNumberRange } from "@casta-fe-playground/components/InputNumberRange";
import { Loading } from "@casta-fe-playground/components/Loading";
import { MemberSelect } from "@casta-fe-playground/components/MemberSelect";
import { Meta } from "@casta-fe-playground/components/Meta";
import { BasicModal } from "@casta-fe-playground/components/Modal";
import { QrCode } from "@casta-fe-playground/components/Qrcode";
import { Scrollbar } from "@casta-fe-playground/components/Scrollbar";
import {
  SkeletonDetailPage,
  SkeletonForm,
  SkeletonModalForm,
  SkeletonSection
} from "@casta-fe-playground/components/Skeleton";
import { StrengthMeter } from "@casta-fe-playground/components/StrengthMeter";
import { BasicTable, TableAction, TableImg } from "@casta-fe-playground/components/Table";
import { TaTableTags } from "@casta-fe-playground/components/TableTags";
// import { TaUpload } from "@casta-fe-playground/components/TaUpload";
import { Time } from "@casta-fe-playground/components/Time";
import { TimeLine } from "@casta-fe-playground/components/TimeLine";
import { BasicTree } from "@casta-fe-playground/components/Tree";
import { BasicUpload } from "@casta-fe-playground/components/Upload";
import type { App } from "vue";

const components = [
  AntvG6CanvasNode,
  AntvG6DomNode,
  BasicModal,
  ApiCascader,
  ApiRadioGroup,
  ApiSelect,
  ApiTreeSelect,
  BasicForm,
  RadioButtonGroup,
  TableAction,
  TableImg,
  BasicTable,
  BasicArrow,
  BasicHelp,
  BasicTitle,
  Button,
  GroupButton,
  ModalButton,
  PopConfirmButton,
  TaButtonGroup,
  ClickOutSide,
  // CardList,
  CollapseContainer,
  LazyContainer,
  ScrollContainer,
  CountButton,
  CountdownInput,
  CountTo,
  CropperAvatar,
  CropperImage,
  // DateInterval,
  Description,
  BasicDrawer,
  Dropdown,
  Icon,
  IconPicker,
  SvgIcon,
  // ImpExcel,
  // ExpExcelModal,
  FixedMenu,
  TaInput,
  TaInputGroup,
  TaInputNumber,
  TaInputPassword,
  TaInputSearch,
  TaInputTextArea,
  InputNumberRange,
  Loading,
  MemberSelect,
  Meta,
  QrCode,
  Scrollbar,
  SkeletonDetailPage,
  SkeletonForm,
  SkeletonModalForm,
  SkeletonSection,
  StrengthMeter,
  TaTableTags,
  Time,
  TimeLine,
  BasicTree,
  BasicUpload
];

const install = (app: App, options: any) => {
  // ???????????????????????????????????????install??????

  // ??????????????????????????????????????? xxx.install = () => { app.directive() }
  // components.forEach((component) => app.use(component));
  console.log(options);

  Object.entries(components).forEach(([name, component]) => {
    app.component(name, component);
  });
};

// app.use(WPlus)w
export default {
  install
};

// import { WIcon } from 'casta-fe-playground
export * from "@casta-fe-playground/components";
