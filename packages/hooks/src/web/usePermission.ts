// import { intersection } from "lodash-es";
// import type { ComputedRef } from "vue";
// import { computed } from "vue";
// import type { RouteRecordRaw } from "vue-router";
// import { useTabs } from "./useTabs";
// import { PermissionModeEnum } from "/@/enums/appEnum";
// import { RoleEnum } from "/@/enums/roleEnum";
// import { resetRouter, router } from "/@/router";
// // import { RootRoute } from '/@/router/routes';
// import projectSetting from "/@/settings/projectSetting";
// import { useAppStore } from "/@/store/modules/app";
// import { useMultipleTabStore } from "/@/store/modules/multipleTab";
// import { usePermissionStore } from "/@/store/modules/permission";
// import { useUserStore } from "/@/store/modules/user";
// import { isArray } from "/@/utils/is";

// type Permission = ComputedRef<{
//   [key: string]: { ifShow: boolean; apiUrl: string };
// }>;

// // User permissions related operations
// export function usePermission() {
//   const userStore = useUserStore();
//   const appStore = useAppStore();
//   const permissionStore = usePermissionStore();
//   const { closeAll } = useTabs(router);

//   /**
//    * Change permission mode
//    */
//   async function togglePermissionMode() {
//     appStore.setProjectConfig({
//       permissionMode:
//         projectSetting.permissionMode === PermissionModeEnum.BACK
//           ? PermissionModeEnum.ROUTE_MAPPING
//           : PermissionModeEnum.BACK
//     });
//     location.reload();
//   }

//   /**
//    * Reset and regain authority resource information
//    * @param id
//    */
//   async function resume() {
//     const tabStore = useMultipleTabStore();
//     tabStore.clearCacheTabs();
//     resetRouter();
//     const routes = await permissionStore.buildRoutesAction();
//     routes.forEach((route) => {
//       router.addRoute(route as unknown as RouteRecordRaw);
//     });
//     permissionStore.setLastBuildMenuTime();
//     closeAll();
//   }

//   /**
//    * Determine whether there is permission
//    */
//   function hasPermission(value?: RoleEnum | RoleEnum[] | string | string[], def = true): boolean {
//     // Visible by default
//     if (!value) {
//       return def;
//     }

//     const permMode = projectSetting.permissionMode;

//     if ([PermissionModeEnum.ROUTE_MAPPING, PermissionModeEnum.ROLE].includes(permMode)) {
//       if (!isArray(value)) {
//         return userStore.getRoleList?.includes(value as RoleEnum);
//       }
//       return (intersection(value, userStore.getRoleList) as RoleEnum[]).length > 0;
//     }

//     if (PermissionModeEnum.BACK === permMode) {
//       const allCodeList = permissionStore.getPermCodeList as string[];
//       if (!isArray(value)) {
//         return allCodeList.includes(value);
//       }
//       return (intersection(value, allCodeList) as string[]).length > 0;
//     }
//     return true;
//   }

//   /**
//    * 根据传入的code判断权限
//    * @param values
//    */
//   function getPermission(values?: string[]): Permission {
//     const defReturn = {};
//     // ifShow by default
//     if (!values || !values.length) {
//       return computed(() => defReturn);
//     }
//     const permMode = projectSetting.permissionMode;

//     if (PermissionModeEnum.BACK === permMode) {
//       const allCodeList = permissionStore.getPermCodeList as string[];
//       const allCodeInfo = permissionStore.getPermCodeInfo as { [key: string]: string };
//       return computed(
//         () =>
//           values?.reduce((result, value) => {
//             const ifShow = allCodeList.includes(value);
//             const apiUrl = allCodeInfo[value];
//             result[value] = {
//               ifShow,
//               apiUrl
//             };
//             return result;
//           }, {}) || {}
//       );
//     }
//     return computed(() => defReturn);
//   }

//   /**
//    * 根据resourcemap获取全部的permissions
//    */
//   function getPermissions(): Permission {
//     const defReturn = {};
//     const permMode = projectSetting.permissionMode;

//     if (PermissionModeEnum.BACK === permMode) {
//       const allCodeList = permissionStore.getPermCodeList as string[];
//       const allCodeInfo = permissionStore.getPermCodeInfo as { [key: string]: string };
//       return computed(
//         () =>
//           Object.keys(allCodeInfo)?.reduce((result, value) => {
//             const ifShow = allCodeList.includes(value);
//             const apiUrl = allCodeInfo[value];
//             result[value] = {
//               ifShow,
//               apiUrl
//             };
//             return result;
//           }, {}) || {}
//       );
//     }
//     return computed(() => defReturn);
//   }

//   /**
//    * Change roles
//    * @param roles
//    */
//   async function changeRole(roles: RoleEnum | RoleEnum[]): Promise<void> {
//     if (projectSetting.permissionMode !== PermissionModeEnum.ROUTE_MAPPING) {
//       throw new Error(
//         "Please switch PermissionModeEnum to ROUTE_MAPPING mode in the configuration to operate!"
//       );
//     }

//     if (!isArray(roles)) {
//       roles = [roles];
//     }
//     userStore.setRoleList(roles);
//     await resume();
//   }

//   /**
//    * refresh menu data
//    */
//   async function refreshMenu() {
//     resume();
//   }

//   return {
//     changeRole,
//     hasPermission,
//     getPermission,
//     getPermissions,
//     togglePermissionMode,
//     refreshMenu
//   };
// }
