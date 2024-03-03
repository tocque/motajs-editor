import { IconClose, IconStop } from "@douyinfe/semi-icons";
import { Button, Modal } from "@douyinfe/semi-ui";
import { FC } from "react";
import styles from "./index.module.less";
import { useHover } from "react-use";
import { OpenedScriptFile, ScriptEditorModel } from "../store/scriptEditor";

interface ITabProps {
  data: OpenedScriptFile;
}

const Tab: FC<ITabProps> = (props) => {
  const { saveFile, closeFile } = ScriptEditorModel();

  const { data } = props;
  const title = data.path.split("/").at(-1)!;
  const onSave = () => {
    if (data) {
      saveFile(data.path);
      onClose();
    }
  };
  const onClose = () => {
    closeFile(data.path);
  };
  const unsave = data.version !== data.saveVersion;
  const [hoverable] = useHover((hovered) => (
    <div>
      {!hovered ? (
        <IconStop className="semi-tabs-tab-icon-close" />
      ) : (
        <IconClose className="semi-tabs-tab-icon-close" />
      )}
    </div>
  ));

  return (
    <div className={styles.tab}>
      <span>{title}</span>
      <Button
        size="small"
        type="tertiary"
        theme="borderless"
        className={styles.closeButton}
        onClick={(e) => {
          // 防止触发tab点击事件
          e.stopPropagation();
          if (unsave) {
            const model = Modal.confirm({
              content: `是否想保存对 ${title} 的更改？`,
              footer: (
                <div>
                  <Button type="tertiary" onClick={() => model.destroy()}>
                    取消
                  </Button>
                  <Button
                    type="danger"
                    onClick={() => {
                      onClose();
                      model.destroy();
                    }}
                  >
                    不保存
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      onSave();
                      model.destroy();
                    }}
                  >
                    保存
                  </Button>
                </div>
              ),
            });
          } else onClose();
        }}
      >
        {unsave ? hoverable : <IconClose className="semi-tabs-tab-icon-close" />}
      </Button>
    </div>
  );
};

export default Tab;
