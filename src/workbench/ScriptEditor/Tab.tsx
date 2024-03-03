import { IconClose, IconStop } from "@douyinfe/semi-icons";
import { Button, Modal } from "@douyinfe/semi-ui";
import { FC } from "react";
import styles from './index.module.less';

interface ITabProps {
  title: string;
  unsave: boolean;
  onClose: () => void;
}

const Tab: FC<ITabProps> = (props) => {

  const { title, unsave, onClose } = props;

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
            Modal.confirm({
              content: `是否想保存对 ${title} 的更改？`,
              footer: (
                <div>
                  
                </div>
              )
            })
          }
          onClose();
        }}
      >
        {unsave ? (
          <IconStop className="semi-tabs-tab-icon-close" />
        ) : (
          <IconClose className="semi-tabs-tab-icon-close" />
        )}
      </Button>
    </div>
  )
}

export default Tab;
