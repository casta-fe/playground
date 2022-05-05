<template>
  <div class="AntvG6wrapper">
    <!-- <template v-if="isShow"> -->
    <div ref="AntvG6ContainerRef" class="AntvG6Container"></div>
    <div class="extract">
      <div class="custom-legend">
        <span v-show="useStatusLegend" class="complete">
          <i></i>
          节点配置已完成
        </span>
        <span v-show="useStatusLegend" class="ing">
          <i></i>
          节点配置进行中
        </span>
        <span v-show="useStatusLegend" class="nostart">
          <i></i>
          节点配置未开始
        </span>
        <br />
        <span v-show="useTipLegend" style="font-size: 12px">
          鼠标在当前区域内可进行拖拽，滚轮缩放动作来调整画布的可视大小。✋
        </span>
      </div>
      <!-- <div class="custom-button">终止配置</div> -->
      <slot></slot>
    </div>
    <!-- </template>
    <template v-else>
      <div class="AntvG6Container-mask flex justify-center items-center">
        <p class="ant-spin">抱歉，暂无数据 🤣</p>
      </div>
    </template> -->
  </div>
</template>

<script lang="ts">
  import type { Graph } from "@antv/g6";
  // import G6 from "@antv/g6";
  // ts-ignore
  import G6 from "@antv/g6/dist/g6.min";
  import { useDebounceFn } from "@vueuse/core";
  import { defineComponent, nextTick, PropType, ref, toRaw, unref, watch } from "vue";
  import { useWindowSizeFn } from "@casta-fe-playground/hooks";
  import { addClass, hasClass, removeClass } from "@casta-fe-playground/utils";

  interface AntvG6ContainerData {
    nodes: any[];
    edges?: any[];
  }
  interface AntvG6ContainerOptions {
    container: HTMLDivElement;
    data: AntvG6ContainerData;
  }

  const parseStyle = (style): string => {
    let result = "";
    for (let [k, v] of Object.entries(style)) {
      result += `${k}:${v};`;
    }
    return result;
  };

  const ITEM_WIDTH = 140;
  const ITEM_PADDING = 20;
  const ROW_MARGIN = 120;
  const ITEM_HEIGHT = 40;
  const TEM_ANCHORPOINTS = [
    // 上/下/左/右连接点
    [0.5, 0],
    [0.5, 1],
    [0, 0.5],
    [1, 0.5]
  ];
  const STEP_ITEM_HEIGHT = 68;
  const STEP_ITEM_ANCHORPOINTS = [
    // 上/下/左/右连接点
    [0.5, 0.15],
    [0.5, 1],
    [0, 0.5],
    [1, 0.5]
  ];

  export default defineComponent({
    name: "AntvG6DomNode",
    props: {
      data: {
        type: Object as PropType<{
          nodes: any[];
          edges: any[];
        }>
      },
      defaultSelectedId: String,
      useStatusLegend: {
        type: Boolean,
        default: true
      },
      useTipLegend: {
        type: Boolean,
        default: true
      }
    },
    emits: ["onSelected"],
    setup(props, { attrs, slots, emit }) {
      const AntvG6ContainerRef = ref<HTMLDivElement | null>(null);
      const GraphRef = ref<Graph | null>(null);
      const SelectedId = ref<string | null>(null);

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

          return container.scrollWidth > calcedWidth ? container.scrollWidth : calcedWidth;
        };

        const width = calcWidth();
        const height = container.scrollHeight || 300;
        const graph = new G6.Graph({
          container,
          width,
          height,
          renderer: "svg",
          fitCenter: true,
          modes: {
            default: ["drag-canvas", "zoom-canvas"]
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
          animate: true
        });
        graph.data(data);
        graph.render();

        return graph;
      }

      function setDefaultSelectNode(): void {
        nextTick(() => {
          const { defaultSelectedId } = unref(props);
          const selectedId = SelectedId.value || defaultSelectedId;
          const dom = document.querySelector(`#custom-dom-node__${selectedId}`) as HTMLDivElement;
          addClass(dom, "custom-dom-node--selected");
          dom.click();
        });
      }

      function initAntvG6CustomDomNode(): void {
        /**
         * Register a node type with DOM
         */
        G6.registerNode("custom-dom-node", {
          draw: (cfg: any, group: any) => {
            const shapeMap = {
              circle({ color = "", bgColor }) {
                return {
                  position: "relative",
                  width: "20px",
                  height: "20px",
                  color,
                  "background-color": bgColor,
                  "border-radius": "50%"
                };
              },
              diamond({ color = "", bgColor }) {
                return {
                  position: "absolute",
                  left: "14px",
                  width: "12px",
                  height: "12px",
                  color,
                  "background-color": bgColor,
                  transform: "rotate(45deg)"
                };
              }
            };
            let wrapperHeight = cfg.size[1];
            let topIconStr = ``;
            let leftIconStr = ``;
            if (cfg.topIcon) {
              // wrapperHeight += 26;
              topIconStr = `<div class="top-dom" style=${parseStyle(
                shapeMap[cfg.topIcon.shape](cfg.topIcon)
              )}><i style="position: absolute;top: 50%;left: 50%;transform: translate(-60%,-50%);">${
                cfg.topIcon.label
              }</i></div>`;
            }
            if (cfg.leftIcon) {
              leftIconStr = `<div class="left-dom" style=${parseStyle(
                shapeMap[cfg.leftIcon.shape](cfg.leftIcon)
              )}><i></i></div>`;
            }
            const contentStr = `<div class="custom-dom-node-content">${leftIconStr}<span>${cfg.label}</span></div>`;
            const html = `<div id="custom-dom-node__${cfg.id}" data-id="${
              cfg.id
            }" class="custom-dom-node custom-dom-node--${
              props.useStatusLegend ? cfg.state || "nostart" : "nostart"
            }" style="width: ${
              cfg.size[0]
            }px; height: ${wrapperHeight}px;">${topIconStr}${contentStr}</div>`;
            return group.addShape("dom", {
              attrs: {
                width: cfg.size[0],
                height: cfg.size[1],
                html
              },
              draggable: true
            });
          }
        });
      }

      function initAntvG6Events() {
        const graph = GraphRef.value as Graph;
        // graph.on("node:click", function (event) {});

        const clearSelectedActive = function () {
          const domNodes = [...document.getElementsByClassName("custom-dom-node--selected")];
          domNodes.map((dom) => removeClass(dom, "custom-dom-node--selected"));
        };

        // click listener for dom nodes to response the click by changing stroke color
        const listener = (dom) => {
          SelectedId.value = dom.dataset.id;
          const hasSelectedClass = hasClass(dom, "custom-dom-node--selected");
          if (!hasSelectedClass) {
            clearSelectedActive();
            addClass(dom, "custom-dom-node--selected");
          }
        };

        const bindClickListener = () => {
          setDefaultSelectNode();
          const domNodes = document.getElementsByClassName("custom-dom-node");
          for (let i = 0; i < domNodes.length; i++) {
            const dom = domNodes[i];
            // open the following lines pls!
            dom.addEventListener("click", (e) => {
              e.stopPropagation();
              listener(dom);
              emit("onSelected", dom);
            });
          }
        };

        // after update the item, all the DOMs will be re-rendered
        // so the listeners should be rebinded to the new DOMs
        graph.on("afterupdateitem", () => {
          bindClickListener();
        });
        graph.on("afterrender", () => {
          bindClickListener();
        });
        // if it is TreeGraph and with default animate:true, you should bind the litsener after animation
        // graph.on('afteranimate', (e) => {
        //   bindClickListener();
        // });
        graph.on(
          "canvas:dragend",
          useDebounceFn(() => {
            bindClickListener();
          }, 300)
        );
        graph.on(
          "wheelzoom",
          useDebounceFn(() => {
            bindClickListener();
          }, 300)
        );

        return bindClickListener;
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

      function init(nodes, edges) {
        // const data = {
        //   nodes: [
        //     {
        //       id: "AntvG6_Node-1",
        //       row: 1,
        //       size: [140, 68],
        //       type: "custom-dom-node",
        //       label: "项目pitch",
        //       state: "complete",
        //       anchorPoints: [
        //         // 上/下/左/右连接点
        //         [0.5, 0.15],
        //         [0.5, 1],
        //         [0, 0.5],
        //         [1, 0.5]
        //       ],
        //       topIcon: {
        //         label: "1",
        //         shape: "circle"
        //       },
        //       leftIcon: {
        //         shape: "diamond"
        //       }
        //     },
        //     {
        //       id: "AntvG6_Node-2",
        //       row: 1,
        //       size: [140, 68],
        //       type: "custom-dom-node",
        //       label: "项目立项",
        //       state: "complete",
        //       anchorPoints: [
        //         // 上/下/左/右连接点
        //         [0.5, 0.15],
        //         [0.5, 1],
        //         [0, 0.5],
        //         [1, 0.5]
        //       ],
        //       topIcon: {
        //         label: "2",
        //         shape: "circle"
        //       },
        //       leftIcon: {
        //         shape: "diamond"
        //       }
        //     },
        //     {
        //       id: "AntvG6_Node-3",
        //       row: 1,
        //       size: [140, 68],
        //       type: "custom-dom-node",
        //       label: "合同签署",
        //       state: "ing",
        //       anchorPoints: [
        //         // 上/下/左/右连接点
        //         [0.5, 0.15],
        //         [0.5, 1],
        //         [0, 0.5],
        //         [1, 0.5]
        //       ],
        //       topIcon: {
        //         label: "3",
        //         shape: "circle"
        //       },
        //       leftIcon: {
        //         shape: "diamond"
        //       }
        //     },
        //     {
        //       id: "AntvG6_Node-4",
        //       row: 1,
        //       size: [140, 68],
        //       type: "custom-dom-node",
        //       label: "项目执行",
        //       state: "nostart",
        //       anchorPoints: [
        //         // 上/下/左/右连接点
        //         [0.5, 0.15],
        //         [0.5, 1],
        //         [0, 0.5],
        //         [1, 0.5]
        //       ],
        //       topIcon: {
        //         label: "4",
        //         shape: "circle"
        //       },
        //       leftIcon: {
        //         shape: "diamond"
        //       }
        //     },
        //     {
        //       id: "AntvG6_Node-5",
        //       row: 1,
        //       size: [140, 68],
        //       type: "custom-dom-node",
        //       label: "回款",
        //       state: "nostart",
        //       anchorPoints: [
        //         // 上/下/左/右连接点
        //         [0.5, 0.15],
        //         [0.5, 1],
        //         [0, 0.5],
        //         [1, 0.5]
        //       ],
        //       topIcon: {
        //         label: "5",
        //         shape: "circle"
        //       },
        //       leftIcon: {
        //         shape: "diamond"
        //       }
        //     },
        //     {
        //       id: "AntvG6_Node-6",
        //       row: 1,
        //       size: [140, 68],
        //       type: "custom-dom-node",
        //       label: "结束",
        //       state: "nostart",
        //       anchorPoints: [
        //         // 上/下/左/右连接点
        //         [0.5, 0.15],
        //         [0.5, 1],
        //         [0, 0.5],
        //         [1, 0.5]
        //       ],
        //       topIcon: {
        //         label: "6",
        //         shape: "circle"
        //       },
        //       leftIcon: {
        //         shape: "diamond"
        //       }
        //     },
        //     {
        //       id: "AntvG6_Node-7",
        //       row: 2,
        //       size: [140, 40],
        //       type: "custom-dom-node",
        //       label: "项目启动",
        //       state: "nostart",
        //       anchorPoints: [
        //         // 上/下/左/右连接点
        //         [0.5, 0],
        //         [0.5, 1],
        //         [0, 0.5],
        //         [1, 0.5]
        //       ],
        //       leftIcon: {
        //         shape: "diamond"
        //       }
        //     },
        //     {
        //       id: "AntvG6_Node-8",
        //       row: 2,
        //       size: [140, 40],
        //       type: "custom-dom-node",
        //       label: "材料梳理",
        //       state: "nostart",
        //       anchorPoints: [
        //         // 上/下/左/右连接点
        //         [0.5, 0],
        //         [0.5, 1],
        //         [0, 0.5],
        //         [1, 0.5]
        //       ],
        //       leftIcon: {
        //         shape: "diamond"
        //       }
        //     },
        //     {
        //       id: "AntvG6_Node-9",
        //       row: 2,
        //       size: [140, 40],
        //       type: "custom-dom-node",
        //       label: "潜在投资人",
        //       state: "nostart",
        //       anchorPoints: [
        //         // 上/下/左/右连接点
        //         [0.5, 0],
        //         [0.5, 1],
        //         [0, 0.5],
        //         [1, 0.5]
        //       ],
        //       leftIcon: {
        //         shape: "diamond"
        //       }
        //     },
        //     {
        //       id: "AntvG6_Node-10",
        //       row: 2,
        //       size: [140, 40],
        //       type: "custom-dom-node",
        //       label: "路演执行",
        //       state: "nostart",
        //       anchorPoints: [
        //         // 上/下/左/右连接点
        //         [0.5, 0],
        //         [0.5, 1],
        //         [0, 0.5],
        //         [1, 0.5]
        //       ],
        //       leftIcon: {
        //         shape: "diamond"
        //       }
        //     },
        //     {
        //       id: "AntvG6_Node-11",
        //       row: 2,
        //       size: [140, 40],
        //       type: "custom-dom-node",
        //       label: "NDA签署",
        //       state: "nostart",
        //       anchorPoints: [
        //         // 上/下/左/右连接点
        //         [0.5, 0],
        //         [0.5, 1],
        //         [0, 0.5],
        //         [1, 0.5]
        //       ],
        //       leftIcon: {
        //         shape: "diamond"
        //       }
        //     },
        //     {
        //       id: "AntvG6_Node-12",
        //       row: 2,
        //       size: [140, 40],
        //       type: "custom-dom-node",
        //       label: "Pre-DD",
        //       state: "nostart",
        //       anchorPoints: [
        //         // 上/下/左/右连接点
        //         [0.5, 0],
        //         [0.5, 1],
        //         [0, 0.5],
        //         [1, 0.5]
        //       ],
        //       leftIcon: {
        //         shape: "diamond"
        //       }
        //     },
        //     {
        //       id: "AntvG6_Node-13",
        //       row: 2,
        //       size: [140, 40],
        //       type: "custom-dom-node",
        //       label: "立项",
        //       state: "nostart",
        //       anchorPoints: [
        //         // 上/下/左/右连接点
        //         [0.5, 0],
        //         [0.5, 1],
        //         [0, 0.5],
        //         [1, 0.5]
        //       ],
        //       leftIcon: {
        //         shape: "diamond"
        //       }
        //     },
        //     {
        //       id: "AntvG6_Node-14",
        //       row: 2,
        //       size: [140, 40],
        //       type: "custom-dom-node",
        //       label: "TS",
        //       state: "nostart",
        //       anchorPoints: [
        //         // 上/下/左/右连接点
        //         [0.5, 0],
        //         [0.5, 1],
        //         [0, 0.5],
        //         [1, 0.5]
        //       ],
        //       leftIcon: {
        //         shape: "diamond"
        //       }
        //     }
        //   ],
        //   edges: [
        //     {
        //       source: "AntvG6_Node-1",
        //       target: "AntvG6_Node-2",
        //       type: "line",
        //       style: {
        //         endArrow: true
        //       },
        //       sourceAnchor: 0,
        //       targetAnchor: 0
        //     },
        //     {
        //       source: "AntvG6_Node-2",
        //       target: "AntvG6_Node-3",
        //       type: "line",
        //       style: {
        //         endArrow: true
        //       },
        //       sourceAnchor: 0,
        //       targetAnchor: 0
        //     },
        //     {
        //       source: "AntvG6_Node-3",
        //       target: "AntvG6_Node-4",
        //       type: "line",
        //       style: {
        //         endArrow: true
        //       },
        //       sourceAnchor: 0,
        //       targetAnchor: 0
        //     },
        //     {
        //       source: "AntvG6_Node-4",
        //       target: "AntvG6_Node-5",
        //       type: "line",
        //       style: {
        //         endArrow: true
        //       },
        //       sourceAnchor: 0,
        //       targetAnchor: 0
        //     },
        //     {
        //       source: "AntvG6_Node-5",
        //       target: "AntvG6_Node-6",
        //       type: "line",
        //       style: {
        //         endArrow: true
        //       },
        //       sourceAnchor: 0,
        //       targetAnchor: 0
        //     },
        //     {
        //       source: "AntvG6_Node-4",
        //       target: "AntvG6_Node-7",
        //       type: "polyline",
        //       style: {
        //         endArrow: true,
        //         radius: 4
        //       },
        //       sourceAnchor: 1,
        //       targetAnchor: 0
        //     },
        //     {
        //       source: "AntvG6_Node-7",
        //       target: "AntvG6_Node-8",
        //       type: "line",
        //       style: {
        //         endArrow: true
        //       },
        //       sourceAnchor: 3,
        //       targetAnchor: 2
        //     },
        //     {
        //       source: "AntvG6_Node-8",
        //       target: "AntvG6_Node-9",
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

        initAntvG6CustomDomNode();
        const options: AntvG6ContainerOptions = {
          container: AntvG6ContainerRef.value as HTMLDivElement,
          data
        };
        const graph = initAntvG6Container(options);
        GraphRef.value = graph;
        const bindClickListener = initAntvG6Events();
        bindClickListener();
      }

      watch(
        () => props.data,
        (newVal) => {
          const { nodes, edges } = newVal as any;
          const _nodes = toRaw(nodes);
          const _edges = toRaw(edges);
          if (_nodes.length && _edges.length) {
            init(_nodes, _edges);
          }
        }
      );

      return {
        AntvG6ContainerRef
      };
    }
  });
</script>

<style lang="less" scoped>
  .AntvG6wrapper {
    position: relative;
    width: 100%;
    height: 350px;
    overflow: hidden;

    .AntvG6Container {
      // overflow: auto;
      height: 350px;
      background: #f6f8ff;
      border-radius: 10px;

      svg {
        cursor: grab !important;
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

    .custom-dom-node {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      position: relative;
      cursor: pointer;

      &-content {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 40px;
        background: #fff;
        border-radius: 4px;

        span {
          display: inline-block;
          flex: 0 1 90px;
          margin-left: 30px;
          font-size: 14px;
          font-weight: bold;
          color: #222;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      &--complete {
        .top-dom,
        .left-dom {
          background-color: #2cc8b2;
        }
      }

      &--ing {
        .top-dom,
        .left-dom {
          background-color: #ffc400;
        }
      }

      &--nostart {
        .top-dom,
        .left-dom {
          background-color: #eaeaea;
        }
      }

      &--selected {
        .custom-dom-node-content {
          border: 2px solid #3c69fc;
        }
      }

      .top-dom {
        color: #fff;
      }
    }

    .extract {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      padding: 6px 16px 10px;
      background: #f6f8ff;
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
          background: linear-gradient(90deg, #bff0ff 0%, #2cc8b2 100%);
          box-shadow: 10px 10px 40px rgb(0 0 0 / 10%);
          border-radius: 50%;
        }
      }

      .ing {
        i {
          display: inline-block;
          width: 10px;
          height: 10px;
          background: linear-gradient(90deg, #eed171 0%, #fea22b 100%);
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
