<!--
 * @Author: huyb
 * @Descripttion: Think & Action
 * @Date: 2021-12-09 14:13:36
-->
<template>
  <Modal
    v-model:visible="showModal"
    :destroyOnClose="true"
    :footer="null"
    width="100%"
    :afterClose="afterCloseHandle"
    wrapClassName="file-view-modal"
  >
    <template #title>
      <!-- <div class="file-view-action">
        <Button type="text" @click="downloadFile">下载</Button>
      </div>
      <span class="file-view-num">{{ index + 1 }}/{{ list.length }}</span> -->
      <span class="file-view-title"
        >{{ filePath }}{{ currentFile.name + "." + currentFile.suffix }}</span
      >
    </template>
    <template v-if="list.length > 1">
      <div class="file-view-modal-prev" @click="goPrev">
        <a href="javascript:;"><LeftOutlined /></a>
      </div>
      <div class="file-view-modal-next" @click="goNext">
        <a href="javascript:;"><RightOutlined /></a>
      </div>
    </template>
    <Spin :spinning="pageLoading" size="default" tip="文件请求中，请稍后">
      <div class="file-view-content">
        <template v-if="fileType == 'office'">
          <iframe :src="filePath" frameborder="0" id="fileIframe"></iframe>
        </template>
        <template v-if="fileType == 'audio'">
          <audio :src="filePath"></audio>
        </template>
        <template v-if="fileType == 'video'">
          <video :src="filePath"></video>
        </template>
        <template v-if="fileType == 'mpeg'">
          <iframe :src="filePath" frameborder="0" id="fileIframe"></iframe>
        </template>
        <template v-if="fileType == 'pic'">
          <img :src="filePath" alt="" />
        </template>
        <template v-if="fileType == 'text'">
          <div class="text-page">
            <iframe :src="filePath" frameborder="0" id="fileIframe"></iframe>
          </div>
        </template>
        <template v-if="fileType == ''">
          <div class="empty">暂不支持该格式预览 {{ fileType }}</div>
        </template>
      </div>
    </Spin>
  </Modal>
</template>

<script lang="ts">
  import { LeftOutlined, RightOutlined } from "@ant-design/icons-vue";
  import { Modal, Spin } from "ant-design-vue";
  import { computed, defineComponent, nextTick, reactive, toRefs, watch } from "vue";
  import props from "./props";
  import { Button } from "@casta-fe-playground/components/Button";
  import download from "@casta-fe-playground/utils/src/file/TaDownload";
  import { useMessage } from "@casta-fe-playground/hooks/index";
  export default defineComponent({
    components: {
      Modal,
      Spin,
      LeftOutlined,
      RightOutlined,
      Button
    },
    props,
    emits: ["update:show"],
    setup(props, { emit }) {
      const { createMessage } = useMessage();
      const state = reactive({
        index: props.index,
        filePath: "",
        showModal: props.show,
        pageLoading: false
      });
      const ignoreList = ["zip", "tar", "7z"];
      let loadFileTypes = {
        office: ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "pdf"],
        audio: ["mp3", "mp3", "wav", "rm", "rpm"],
        pic: ["gif", "jpeg", "jpg", "png"],
        video: ["mpeg", "mpg", "avi", "movie"],
        text: ["txt"]
      };
      const currentFile = computed((): FileItemType => props.list[state.index] || {});
      const fileType = computed(() => {
        let type = "";
        let suffix = currentFile.value?.suffix;
        if (suffix) {
          for (let item in loadFileTypes) {
            if (loadFileTypes[item].some((v) => suffix == v)) {
              type = item;
              break;
            }
          }
        }
        return type;
      });
      const getFile = () => {
        // 防止多次请求
        let id = currentFile.value?.fileId || currentFile.value?.id;
        if (state.pageLoading || !id || fileType.value == "") {
          return;
        }
        state.filePath = "";
        state.pageLoading = true;
        props
          .fileApi(id)
          .then((res) => {
            state.pageLoading = false;
            state.filePath = res.data;
            loadIframeHandle();
          })
          .catch((err) => {
            console.log(err);
            state.pageLoading = false;
            setTimeout(afterCloseHandle, 1000);
            // state.pageLoading = false;
          });
      };
      const loadIframeHandle = () => {
        let iframeEle = window.document.getElementById("fileIframe");
        if (iframeEle) {
          // iframeEle.onload = (data) => {
          //   let iframeWindow = iframeEle.contentWindow;
          //   let removeNode = iframeWindow.document.getElementById("HeaderTopBars");
          //   console.log(iframeWindow);
          //   console.log(removeNode);
          // };
        }
      };
      const afterCloseHandle = () => {
        emit("update:show", false);
      };
      const goPrev = () => {
        if (state.index > 0) {
          state.index--;
          nextTick(() => {
            getFile();
          });
        }
      };
      const goNext = () => {
        if (state.index < props.list.length - 1) {
          state.index++;
          nextTick(() => {
            getFile();
          });
        }
      };
      const downloadFile = () => {
        download(currentFile.value);
      };
      watch(
        () => props.show,
        (newData) => {
          // if (ignoreList.includes(currentFile.value.suffix)) {
          //   createMessage.warning("暂不支持该文件预览");
          //   return;
          // }
          state.showModal = newData;
          state.index = props.index;
          if (newData) {
            nextTick(() => {
              getFile();
            });
          } else {
            state.filePath = "";
          }
        }
      );
      watch(
        () => currentFile.value,
        () => {
          nextTick(() => {
            getFile();
          });
          console.log("文件改变");
        }
      );
      return {
        ...toRefs(state),
        currentFile,
        fileType,
        downloadFile,
        goPrev,
        goNext,
        afterCloseHandle
      };
    }
  });
</script>

<style lang="less">
  .file-view-modal {
    .ant-modal {
      top: 0;
      padding: 0;
    }

    &-next,
    &-prev {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      font-size: 24px;
      width: 50px;
      height: 50px;
      padding: 10px;
      text-align: center;
      background: rgba(#000);
      border-radius: 50%;
      line-height: 1.2;
      opacity: 0.4;
      z-index: 99;
      transition: all ease 0.3s;

      a {
        color: #fff;
      }

      &:hover {
        opacity: 0.8;
      }
    }

    &-prev {
      left: 20px;
    }

    &-next {
      right: 20px;
    }

    .ant-modal-content {
      height: 100vh;
      border-radius: 0;
      display: flex;
      flex-direction: column;
      background: rgba(#000, 0.65);

      .ant-modal-header {
        border-radius: 0;
        // background: rgba(@primaryColor, 1);
        border-bottom: none;

        .ant-modal-title {
          color: #fff;
          line-height: 30px;
          font-size: 14px;
          font-weight: normal;
        }
      }

      .ant-modal-close-x {
        color: #fff;
      }

      .file-view-num {
        margin-right: 20px;
        opacity: 0.8;
      }

      .file-view-action {
        margin-right: 20px;
        float: right;

        .ant-btn-text {
          color: #fff;
        }
      }

      .ant-modal-body {
        flex: 1;
        // padding: 0 10%;
        max-height: 100%;
        overflow: hidden;

        .ant-spin {
          height: 100%;
          width: 100%;
          max-height: 100%;
          color: #fff;

          .ant-spin-text {
            text-shadow: none;
          }

          .ant-spin-dot-item {
            background: #fff;
          }
        }

        .ant-spin-container {
          width: 100%;
          height: 90%;
        }

        .file-view-content {
          // background: #fff;
          height: calc(100vh - 50px);
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;

          img {
            max-width: 80%;
            max-height: 80%;
          }

          audio,
          video {
            width: 640px;
            height: 368px;
          }
          .text-page {
            background: #fff;
            height: 100%;
            width: 800px;
          }
        }

        iframe {
          border: none;
          width: 100%;
          height: 100%;
        }

        .empty {
          color: #fff;
        }
      }
    }
  }
</style>
