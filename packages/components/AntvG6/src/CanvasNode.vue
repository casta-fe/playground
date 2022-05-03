<template>
  <div class="AntvG6wrapper" :style="{ height: isCustomLegendShow ? '350px' : '300px' }">
    <div ref="AntvG6ContainerRef" class="AntvG6Container"></div>
    <div v-if="isCustomLegendShow" class="extract">
      <div class="custom-legend">
        <div v-show="useStatusLegend">
          <span class="complete">
            <i></i>
            {{ getStatusLegendText("已完成") }}
          </span>
          <span class="ing">
            <i></i>
            {{ getStatusLegendText("进行中") }}
          </span>
          <span class="nostart">
            <i></i>
            {{ getStatusLegendText("未开始") }}
          </span>
        </div>
        <span v-show="useTipLegend" style="font-size: 12px">
          <!-- 鼠标在当前区域内可进行拖拽，滚轮缩放动作来调整画布的可视大小。✋ -->
          提示：按下鼠标后在当前区域内可进行拖拽 🤔
        </span>
      </div>
      <!-- <div class="custom-button">终止配置</div> -->
      <slot></slot>
    </div>
    <template v-if="useSync.tooltip && useSync.visible">
      <Tooltip :title="useSync.tooltip" placement="topRight">
        <div class="tooltip-trigger sync">
          <Button
            preIcon="fluent:arrow-sync-circle-24-filled"
            preIconColor="#276DFF"
            :loading="useSync.loading"
            :iconSize="16"
            :disabled="useSync.disabled"
            @click="useSync.onClick"
            style="min-width: auto; width: auto"
          />
        </div>
      </Tooltip>
    </template>
    <template v-else>
      <Button
        v-if="useSync.visible"
        class="sync"
        preIcon="fluent:arrow-sync-circle-24-filled"
        preIconColor="#276DFF"
        :loading="useSync.loading"
        :iconSize="16"
        :disabled="useSync.disabled"
        @click="useSync.onClick"
      />
    </template>
  </div>
</template>

<script lang="ts">
  import type { Graph } from "@antv/g6";
  // import G6 from "@antv/g6";
  // ts-ignore
  import G6 from "@antv/g6/dist/g6.min";
  import { useDebounceFn } from "@vueuse/core";
  import { Tooltip } from "ant-design-vue";
  import { cloneDeep } from "lodash-es";
  import type { PropType } from "vue";
  import { computed, defineComponent, nextTick, ref, unref, watch } from "vue";
  import { NodeStatus } from "./types";
  import { Button } from "/@/components/Button";
  import { useWindowSizeFn } from "/@/hooks/event/useWindowSizeFn";

  interface AntvG6ContainerData {
    nodes: any[];
    edges?: any[];
  }
  interface AntvG6ContainerOptions {
    container: HTMLDivElement;
    data: AntvG6ContainerData;
  }
  interface UseSync {
    // 继承button类型
    visible: boolean;
    loading: boolean;
    onClick: () => void;
    tooltip: string;
    disabled?: boolean;
  }

  // 布局
  const ITEM_WIDTH = 140;
  const ITEM_PADDING = 20;
  let ROW_MARGIN = 140;
  // 图标
  const DEFAULT_FONT_SIZE = 12;
  // 字体
  const FONT_OFFSET = 2; // 因为行高的原因，需要设置适当的偏移才能在正中显示
  // 颜色默认值
  const DEFAULT_COLOR = "#222222";
  const DEFAULT_BG_COLOR = "#ffffff";
  // 阴影样式
  const DEFAULT_SHADOW_BOX = {
    shadowColor: "#6C7FD5",
    shadowOffsetX: 0,
    shadowOffsetY: 4,
    shadowBlur: 10
  };
  // 终止颜色
  const TERMINATED_COLOR = "#FF3B3B";

  const props = {
    data: {
      type: Object as PropType<{
        nodes: any[];
        edges: any[];
      }>
    },
    defaultSelectedId: {
      type: String,
      default: ""
    },
    useStatusLegend: {
      type: Boolean,
      default: true
    },
    isNodeConfig: {
      // 是否被包含在详情页中与节点配置一起出现
      type: Boolean,
      default: false
    },
    isTerminated: {
      type: Boolean,
      default: false
    },
    useTipLegend: {
      type: Boolean,
      default: true
    },
    useSync: {
      type: Object as PropType<Partial<UseSync>>,
      default() {
        return {
          visible: true,
          loading: false,
          disabled: false
        };
      }
    }
  };

  export default defineComponent({
    name: "AntvG6CanvasNode",
    components: { Button, Tooltip },
    props,
    emits: ["onSelected"],
    setup(props, { slots, emit }) {
      const AntvG6ContainerRef = ref<HTMLDivElement | null>(null);
      const GraphRef = ref<Graph | null>(null);
      const SelectedId = ref<string | null>(null);
      const isCustomLegendShow = computed(
        () => props.useStatusLegend || props.useTipLegend || !!slots.default
      );

      const getStatusLegendText = computed(() => (text) => {
        if (props.isNodeConfig) {
          // return `节点配置${text}`;
          return `${text}`;
        }
        return text;
      });

      function initAntvG6Container(options: AntvG6ContainerOptions): Graph {
        const { container, data } = options;

        const calcWidth = (): number => {
          const groupByRow = data.nodes.reduce((result, cur) => {
            if (result[cur.row]) {
              result[cur.row].push(cur);
            } else {
              result[cur.row] = [];
            }
            return result;
          }, {});

          const hasMostItemRow = Object.keys(groupByRow).reduce((result, cur) => {
            if (groupByRow[cur].length > result.length) result = groupByRow[cur];
            return result;
          }, []);

          const calcedWidth = hasMostItemRow.length * (ITEM_WIDTH + 120);

          // return container.scrollWidth > calcedWidth ? container.scrollWidth : calcedWidth;

          const content = document.querySelector(".ta-layout-content") as HTMLElement;
          return content.scrollWidth > calcedWidth ? content.scrollWidth : calcedWidth;
        };

        const width = calcWidth();
        const height = container.scrollHeight || 300;
        const graph = new G6.Graph({
          container,
          width,
          height,
          fitView: true,
          fitCenter: true,
          // renderer: "svg",
          modes: {
            // default: ["drag-canvas", "zoom-canvas", "click-select"]
            default: ["drag-canvas", "click-select"]
          },
          layout: {
            pipes: [
              {
                type: "grid",
                nodesFilter: (node) => {
                  return node.row === 1;
                },
                begin: [0, 0],
                width,
                height,
                sortBy: "row",
                preventOverlap: true,
                preventOverlapPdding: ITEM_PADDING,
                nodeSize: ITEM_WIDTH
              },
              {
                type: "grid",
                nodesFilter: (node) => {
                  return node.row === 2;
                },
                begin: [0, ROW_MARGIN],
                width,
                height,
                sortBy: "row",
                preventOverlap: true,
                preventOverlapPdding: ITEM_PADDING,
                nodeSize: ITEM_WIDTH
              }
            ]
          },
          animate: true,
          nodeStateStyles: {
            active: {
              "custom-node-wrapper": {
                lineWidth: 0,
                fillOpacity: 0
              },
              "custom-node-content": {
                ...DEFAULT_SHADOW_BOX,
                shadowColor: props.isTerminated ? TERMINATED_COLOR : DEFAULT_SHADOW_BOX.shadowColor
              }
            },
            selected: {
              "custom-node-wrapper": {
                lineWidth: 0,
                fillOpacity: 0
              },
              "custom-node-content": {
                stroke: props.isTerminated ? TERMINATED_COLOR : "#3C69FC",
                lineWidth: 2,
                ...DEFAULT_SHADOW_BOX,
                shadowColor: props.isTerminated ? TERMINATED_COLOR : DEFAULT_SHADOW_BOX.shadowColor
              }
            }
          }
        });
        graph.data(data);
        graph.render();

        return graph;
      }

      function drawShape(group, shape, options) {
        const {
          attrs: { width = 0, height = 0 }
        } = options;
        // g6 内置图形：https://g6.antv.vision/zh/docs/api/shapeProperties
        const G6InnerShapes = [
          "circle",
          "rect",
          "ellipse",
          "polygon",
          "image",
          "marker",
          "path",
          "text",
          "dom(svg)"
        ]; // "marker", "path", "text", "dom(svg)" 均需自己定义 path 才能绘制出图形
        const G6ExtendShapes = [
          // g6 marker内置图形：https://g6.antv.vision/zh/docs/api/shapeProperties#%E6%A0%87%E8%AE%B0%E5%9B%BE%E5%BD%A2-marker
          {
            name: "diamond",
            symbol: "diamond"
          },
          {
            name: "triangle",
            symbol: "triangle"
          },
          {
            name: "triangle-down",
            symbol: "triangle-down"
          }
          // 除以上图形外，可以自己使用marker来画图形，具体参考：https://www.yuque.com/antv/g6/self-node#h3RgF
        ];

        if (G6InnerShapes.includes(shape)) {
          return group.addShape(shape, options);
        } else {
          const extendShape = G6ExtendShapes.find((extendShape) => extendShape.name === shape);
          if (extendShape) {
            const _options = cloneDeep(options);
            _options.attrs.symbol = extendShape.symbol;
            return group.addShape("marker", _options);
          } else {
            console.warn(`Antv G6 不支持 ${shape} 图形`);
            return;
          }
        }
      }

      function initAntvG6CustomCanvasNode(): void {
        G6.registerNode(
          "custom-node",
          {
            // 绘制节点
            drawShape(cfg: any, group: any) {
              const {
                nodeName: label,
                color = DEFAULT_COLOR,
                bgColor = DEFAULT_BG_COLOR,
                size,
                topIcon,
                leftIcon,
                nodeStatus
              } = cfg;
              const state = nodeStatus || 1;
              const [width, height] = size;

              let topIconMargin = 0;
              let topIconHeight = 0;
              let leftIconMargin = 10;
              let leftIconWidth = leftIcon?.size[0] ?? 0;

              // 构造节点 wrapper
              // 以这个返回的shape左上角作为 (0,0) 节点
              const nodeWrapper = drawShape(group, "rect", {
                attrs: {
                  x: 0,
                  y: 0,
                  width,
                  height,
                  stroke: "transparent",
                  radius: 4
                },
                name: "custom-node-wrapper",
                draggable: true
              });

              // 顶部 icon
              if (topIcon) {
                const {
                  size: topIconSize = [],
                  nodeName: topIconLabel = "",
                  shape: topIconShape = "",
                  color: topIconColor = ""
                  // bgColor: topIconBgColor = NodeStatus[state]
                } = topIcon;
                const topIconBgColor = NodeStatus[state];
                const [topIconWidth, _topIconHeight] = topIconSize;
                topIconHeight = _topIconHeight;
                !!topIconShape &&
                  drawShape(group, topIconShape, {
                    attrs: {
                      x: width / 2,
                      y: topIconHeight / 2,
                      r: topIconHeight / 2,
                      width: topIconWidth,
                      height: topIconHeight,
                      fill: topIconBgColor
                    },
                    name: "custome-canvas-node-top-icon",
                    draggable: true
                  });
                !!topIconLabel &&
                  drawShape(group, "text", {
                    attrs: {
                      x: width / 2 - DEFAULT_FONT_SIZE / 2 + FONT_OFFSET,
                      y: topIconHeight / 2 + DEFAULT_FONT_SIZE / 2,
                      text: topIconLabel,
                      fill: topIconColor
                    },
                    name: "custome-canvas-node-top-icon-text",
                    draggable: true
                  });

                topIconMargin += 8;
              } else {
                topIconMargin = 0;
                topIconHeight = 0;
              }

              // 正文内容
              const contentHeight = height - topIconHeight - topIconMargin;
              let contentAttrs: any = {
                x: 0,
                y: topIconHeight + topIconMargin,
                width,
                height: contentHeight,
                fill: bgColor,
                radius: 4
              };
              // 如果当前节点状态为已完成则添加阴影
              if (state === 3)
                contentAttrs = {
                  ...contentAttrs,
                  ...DEFAULT_SHADOW_BOX
                };
              drawShape(group, "rect", {
                attrs: contentAttrs,
                name: "custom-node-content",
                draggable: true
              });
              const Content_Font_Size = 14;
              !!label &&
                drawShape(group, "text", {
                  attrs: {
                    x: leftIconMargin * 3 + leftIconWidth,
                    y: topIconHeight + topIconMargin + contentHeight / 2 + Content_Font_Size / 2,
                    text: label,
                    fill: color,
                    fontSize: Content_Font_Size,
                    fontWeight: 700
                  },
                  name: "custom-node-content-text",
                  draggable: true
                });

              // 左侧图标
              if (leftIcon) {
                const {
                  size: leftIconSize = [],
                  nodeName: leftIconLabel = "",
                  shape: leftIconShape = "",
                  color: leftIconColor = ""
                  // bgColor: leftIconBgColor = NodeStatus[state]
                } = leftIcon;
                const leftIconBgColor = NodeStatus[state];
                const [leftIconWidth, leftIconHeight] = leftIconSize;
                !!leftIconShape &&
                  drawShape(group, leftIconShape, {
                    attrs: {
                      x: leftIconMargin + leftIconWidth / 2,
                      y: topIconHeight + topIconMargin + contentHeight / 2,
                      r: (leftIconWidth + leftIconHeight) / 4,
                      fill: leftIconBgColor
                    },
                    name: "custome-canvas-node-left-icon",
                    draggable: true
                  });
                !!leftIconLabel &&
                  drawShape(group, "text", {
                    attrs: {
                      x: leftIconMargin + leftIconWidth / 2 - DEFAULT_FONT_SIZE / 2 + FONT_OFFSET,
                      y:
                        topIconHeight +
                        topIconMargin +
                        contentHeight / 2 +
                        DEFAULT_FONT_SIZE / 2 +
                        FONT_OFFSET,
                      text: leftIconLabel,
                      fill: leftIconColor
                    },
                    name: "custome-canvas-node-left-icon-text",
                    draggable: true
                  });
              }

              return nodeWrapper;
            }
          },
          "single-node"
        );
      }

      function setDefaultSelectNode(): void {
        nextTick(() => {
          const { defaultSelectedId } = unref(props);
          const selectedId = SelectedId.value || defaultSelectedId;
          const graph = GraphRef.value as Graph;
          graph.setItemState(graph.findById(selectedId), "selected", true);
        });
      }

      function initAntvG6Events(): void {
        const graph = GraphRef.value as Graph;
        graph.on("node:click", (e) => {
          const item: any = e.item;
          graph.setItemState(item, "selected", true);
          emit("onSelected", item.getModel());
        });
        graph.on("node:mouseenter", (e) => {
          const item: any = e.item;
          graph.setItemState(item, "active", true);
        });

        graph.on("node:mouseleave", (e) => {
          const item: any = e.item;
          graph.setItemState(item, "active", false);
        });
      }

      function fixAntvG6ContainerPos(): void {
        const graph = GraphRef.value;
        const container = AntvG6ContainerRef.value;
        if (!graph || graph.get("destroyed")) return;
        if (!container || !container.scrollWidth || !container.scrollHeight) return;
        graph.changeSize(container.scrollWidth, container.scrollHeight);
      }
      // 窗口大小改变修正宽度
      const debounceFixAntvG6ContainerPos = useDebounceFn(fixAntvG6ContainerPos, 100);
      useWindowSizeFn(debounceFixAntvG6ContainerPos);

      async function init(nodes, edges) {
        // const data = {
        //   nodes: [
        //     {
        //       id: "node1",
        //       row: 1,
        //       size: [140, 68],
        //       type: "custom-node",
        //       label: "项目pitch",
        //       state: 1,
        //       anchorPoints: [
        //         // 上/下/左/右连接点
        //         [0.5, 0.15],
        //         [0.5, 1],
        //         [0, 0.5],
        //         [1, 0.5]
        //       ],
        //       topIcon: {
        //         size: [20, 20],
        //         label: "1",
        //         shape: "circle",
        //         color: "#ffffff",
        //         bgColor: "#EAEAEA"
        //       },
        //       leftIcon: {
        //         size: [16, 16],
        //         label: "23",
        //         shape: "diamond",
        //         color: "",
        //         bgColor: "#EAEAEA"
        //       }
        //     },
        //     {
        //       id: "node2",
        //       row: 1,
        //       size: [140, 68],
        //       type: "custom-node",
        //       label: "项目立项",
        //       state: 2,
        //       anchorPoints: [
        //         // 上/下/左/右连接点
        //         [0.5, 0.15],
        //         [0.5, 1],
        //         [0, 0.5],
        //         [1, 0.5]
        //       ],
        //       topIcon: {
        //         size: [20, 20],
        //         label: "2",
        //         shape: "circle",
        //         color: "#ffffff",
        //         bgColor: "#EAEAEA"
        //       },
        //       leftIcon: {
        //         size: [16, 16],
        //         label: "",
        //         shape: "diamond",
        //         color: "",
        //         bgColor: "#EAEAEA"
        //       }
        //     },
        //     {
        //       id: "node3",
        //       row: 1,
        //       size: [140, 68],
        //       type: "custom-node",
        //       label: "合同签署",
        //       state: 3,
        //       anchorPoints: [
        //         // 上/下/左/右连接点
        //         [0.5, 0.15],
        //         [0.5, 1],
        //         [0, 0.5],
        //         [1, 0.5]
        //       ],
        //       topIcon: {
        //         size: [20, 20],
        //         label: "3",
        //         shape: "circle",
        //         color: "#ffffff",
        //         bgColor: "#EAEAEA"
        //       },
        //       leftIcon: {
        //         size: [16, 16],
        //         label: "",
        //         shape: "diamond",
        //         color: "",
        //         bgColor: "#EAEAEA"
        //       }
        //     },
        //     {
        //       id: "node4",
        //       row: 1,
        //       size: [140, 68],
        //       type: "custom-node",
        //       label: "项目执行",
        //       anchorPoints: [
        //         // 上/下/左/右连接点
        //         [0.5, 0.15],
        //         [0.5, 1],
        //         [0, 0.5],
        //         [1, 0.5]
        //       ],
        //       topIcon: {
        //         size: [20, 20],
        //         label: "4",
        //         shape: "circle",
        //         color: "#ffffff",
        //         bgColor: "#EAEAEA"
        //       },
        //       leftIcon: {
        //         size: [16, 16],
        //         label: "",
        //         shape: "diamond",
        //         color: "",
        //         bgColor: "#EAEAEA"
        //       }
        //     },
        //     {
        //       id: "node5",
        //       row: 1,
        //       size: [140, 68],
        //       type: "custom-node",
        //       label: "回款",
        //       anchorPoints: [
        //         // 上/下/左/右连接点
        //         [0.5, 0.15],
        //         [0.5, 1],
        //         [0, 0.5],
        //         [1, 0.5]
        //       ],
        //       topIcon: {
        //         size: [20, 20],
        //         label: "5",
        //         shape: "circle",
        //         color: "#ffffff",
        //         bgColor: "#EAEAEA"
        //       },
        //       leftIcon: {
        //         size: [16, 16],
        //         label: "",
        //         shape: "diamond",
        //         color: "",
        //         bgColor: "#EAEAEA"
        //       }
        //     },
        //     {
        //       id: "node6",
        //       row: 1,
        //       size: [140, 68],
        //       type: "custom-node",
        //       label: "结束",
        //       anchorPoints: [
        //         // 上/下/左/右连接点
        //         [0.5, 0.15],
        //         [0.5, 1],
        //         [0, 0.5],
        //         [1, 0.5]
        //       ],
        //       topIcon: {
        //         size: [20, 20],
        //         label: "6",
        //         shape: "circle",
        //         color: "#ffffff",
        //         bgColor: "#EAEAEA"
        //       },
        //       leftIcon: {
        //         size: [16, 16],
        //         label: "",
        //         shape: "diamond",
        //         color: "",
        //         bgColor: "#EAEAEA"
        //       }
        //     },
        //     {
        //       id: "node7",
        //       row: 2,
        //       size: [140, 40],
        //       type: "custom-node",
        //       label: "项目启动",
        //       anchorPoints: [
        //         // 上/下/左/右连接点
        //         [0.5, 0],
        //         [0.5, 1],
        //         [0, 0.5],
        //         [1, 0.5]
        //       ],
        //       leftIcon: {
        //         size: [16, 16],
        //         label: "",
        //         shape: "diamond",
        //         color: "",
        //         bgColor: "#EAEAEA"
        //       }
        //     },
        //     {
        //       id: "node8",
        //       row: 2,
        //       size: [140, 40],
        //       type: "custom-node",
        //       label: "材料梳理",
        //       anchorPoints: [
        //         // 上/下/左/右连接点
        //         [0.5, 0],
        //         [0.5, 1],
        //         [0, 0.5],
        //         [1, 0.5]
        //       ],
        //       leftIcon: {
        //         size: [16, 16],
        //         label: "",
        //         shape: "diamond",
        //         color: "",
        //         bgColor: "#EAEAEA"
        //       }
        //     },
        //     {
        //       id: "node9",
        //       row: 2,
        //       size: [140, 40],
        //       type: "custom-node",
        //       label: "潜在投资人",
        //       anchorPoints: [
        //         // 上/下/左/右连接点
        //         [0.5, 0],
        //         [0.5, 1],
        //         [0, 0.5],
        //         [1, 0.5]
        //       ],
        //       leftIcon: {
        //         size: [16, 16],
        //         label: "",
        //         shape: "diamond",
        //         color: "",
        //         bgColor: "#EAEAEA"
        //       }
        //     },
        //     {
        //       id: "node10",
        //       row: 2,
        //       size: [140, 40],
        //       type: "custom-node",
        //       label: "路演执行",
        //       anchorPoints: [
        //         // 上/下/左/右连接点
        //         [0.5, 0],
        //         [0.5, 1],
        //         [0, 0.5],
        //         [1, 0.5]
        //       ],
        //       leftIcon: {
        //         size: [16, 16],
        //         label: "",
        //         shape: "diamond",
        //         color: "",
        //         bgColor: "#EAEAEA"
        //       }
        //     },
        //     {
        //       id: "node11",
        //       row: 2,
        //       size: [140, 40],
        //       type: "custom-node",
        //       label: "NDA签署",
        //       anchorPoints: [
        //         // 上/下/左/右连接点
        //         [0.5, 0],
        //         [0.5, 1],
        //         [0, 0.5],
        //         [1, 0.5]
        //       ],
        //       leftIcon: {
        //         size: [16, 16],
        //         label: "",
        //         shape: "diamond",
        //         color: "",
        //         bgColor: "#EAEAEA"
        //       }
        //     },
        //     {
        //       id: "node12",
        //       row: 2,
        //       size: [140, 40],
        //       type: "custom-node",
        //       label: "Pre-DD",
        //       anchorPoints: [
        //         // 上/下/左/右连接点
        //         [0.5, 0],
        //         [0.5, 1],
        //         [0, 0.5],
        //         [1, 0.5]
        //       ],
        //       leftIcon: {
        //         size: [16, 16],
        //         label: "",
        //         shape: "diamond",
        //         color: "",
        //         bgColor: "#EAEAEA"
        //       }
        //     },
        //     {
        //       id: "node13",
        //       row: 2,
        //       size: [140, 40],
        //       type: "custom-node",
        //       label: "立项",
        //       anchorPoints: [
        //         // 上/下/左/右连接点
        //         [0.5, 0],
        //         [0.5, 1],
        //         [0, 0.5],
        //         [1, 0.5]
        //       ],
        //       leftIcon: {
        //         size: [16, 16],
        //         label: "",
        //         shape: "diamond",
        //         color: "",
        //         bgColor: "#EAEAEA"
        //       }
        //     },
        //     {
        //       id: "node14",
        //       row: 2,
        //       size: [140, 40],
        //       type: "custom-node",
        //       label: "TS",
        //       anchorPoints: [
        //         // 上/下/左/右连接点
        //         [0.5, 0],
        //         [0.5, 1],
        //         [0, 0.5],
        //         [1, 0.5]
        //       ],
        //       leftIcon: {
        //         size: [16, 16],
        //         label: "",
        //         shape: "diamond",
        //         color: "",
        //         bgColor: "#EAEAEA"
        //       }
        //     }
        //   ],
        //   edges: [
        //     {
        //       source: "node1",
        //       target: "node2",
        //       type: "line",
        //       style: {
        //         endArrow: true
        //       },
        //       sourceAnchor: 0,
        //       targetAnchor: 0
        //     },
        //     {
        //       source: "node2",
        //       target: "node3",
        //       type: "line",
        //       style: {
        //         endArrow: true
        //       },
        //       sourceAnchor: 0,
        //       targetAnchor: 0
        //     },
        //     {
        //       source: "node3",
        //       target: "node4",
        //       type: "line",
        //       style: {
        //         endArrow: true
        //       },
        //       sourceAnchor: 0,
        //       targetAnchor: 0
        //     },
        //     {
        //       source: "node4",
        //       target: "node5",
        //       type: "line",
        //       style: {
        //         endArrow: true
        //       },
        //       sourceAnchor: 0,
        //       targetAnchor: 0
        //     },
        //     {
        //       source: "node5",
        //       target: "node6",
        //       type: "line",
        //       style: {
        //         endArrow: true
        //       },
        //       sourceAnchor: 0,
        //       targetAnchor: 0
        //     },
        //     {
        //       source: "node4",
        //       target: "node7",
        //       type: "polyline",
        //       style: {
        //         endArrow: true
        //       },
        //       sourceAnchor: 1,
        //       targetAnchor: 0
        //     },
        //     {
        //       source: "node7",
        //       target: "node8",
        //       type: "line",
        //       style: {
        //         endArrow: true
        //       },
        //       sourceAnchor: 3,
        //       targetAnchor: 2
        //     },
        //     {
        //       source: "node8",
        //       target: "node9",
        //       type: "line",
        //       style: {
        //         endArrow: true
        //       },
        //       sourceAnchor: 3,
        //       targetAnchor: 2
        //     }
        //   ]
        // };

        const data = { nodes, edges } as AntvG6ContainerData;
        initAntvG6CustomCanvasNode();
        await nextTick();
        const options: AntvG6ContainerOptions = {
          container: AntvG6ContainerRef.value as HTMLDivElement,
          data
        };
        const graph = initAntvG6Container(options);
        GraphRef.value = graph;
        initAntvG6Events();
        setDefaultSelectNode();
      }

      watch(
        () => JSON.stringify(props.data),
        (newVal, oldVal) => {
          const { nodes, edges } = JSON.parse(newVal) as any;
          const _nodes = nodes;
          const _edges = edges;
          if (newVal !== oldVal && _nodes.length > 0 && _edges.length > 0) {
            if (unref(GraphRef)) {
              // 更新，先清空
              unref(GraphRef)?.destroy();
              GraphRef.value = null;
            }
            // hack 二级节点只有一个antvg6计算错误，手动把竖向间隔变大
            if (_nodes.filter((node) => node.row === 2).length === 1) {
              ROW_MARGIN = 140 * 2;
            } else {
              ROW_MARGIN = 140;
            }

            init(_nodes, _edges);
          }
        },
        { immediate: true }
      );

      return {
        AntvG6ContainerRef,
        getStatusLegendText,
        isCustomLegendShow
      };
    }
  });
</script>

<style lang="less">
  .AntvG6wrapper {
    position: relative;
    width: 100%;
    height: 350px;
    overflow: hidden;
    background: #f6f8ff;
    border-radius: 10px;

    .sync {
      position: absolute;
      top: 16px;
      right: 16px;
      min-width: auto;
      width: auto;
    }

    .AntvG6Container {
      // height: 350px;
      // background: #f6f8ff;

      canvas {
        // cursor: grab !important;
      }

      &-mask {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgb(240 242 245 / 40%);
      }
    }

    .extract {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      padding: 6px 16px 10px;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .custom-button {
      width: 100px;
      height: 30px;
      background: #ffffff;
      border-radius: 4px;
      color: #276dff;
      text-align: center;
      line-height: 30px;
      border: 1px solid transparent;
      cursor: pointer;

      &:hover {
        color: #4f8dff;
        border: 1px solid #4f8dff;
      }
    }

    .custom-legend {
      span {
        display: inline-block;
        margin-right: 10px;
      }

      i {
        margin-right: 6px;
      }

      .complete {
        i {
          display: inline-block;
          width: 10px;
          height: 10px;
          background: #2cc8b2;
          box-shadow: 10px 10px 40px rgb(0 0 0 / 10%);
          border-radius: 50%;
        }
      }

      .ing {
        i {
          display: inline-block;
          width: 10px;
          height: 10px;
          background: #ffc400;
          box-shadow: 0 0 20px rgb(0 0 0 / 10%);
          border-radius: 50%;
        }
      }

      .nostart {
        i {
          display: inline-block;
          width: 10px;
          height: 10px;
          background: #eeedf2;
          box-shadow: 10px 10px 40px rgb(0 0 0 / 10%);
          border-radius: 50%;
        }
      }
    }
  }
</style>
