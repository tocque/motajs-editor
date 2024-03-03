import { IconFolderOpen, IconAlignBottom, IconMoon, IconSun } from "@douyinfe/semi-icons";
import { Button, Typography } from "@douyinfe/semi-ui";
import { FC } from "react";
import { ProjectModel } from "../store/project";
import styles from "./index.module.less";
import { ThemeModel } from "../store/theme";

const BlankPage: FC = () => {
  const { setProject } = ProjectModel();
  const { isDarkMode, setIsDarkMode } = ThemeModel();
  const { Text } = Typography;

  const openProject = async () => {
    const dirHandle = await window.showDirectoryPicker();
    setProject(dirHandle);
  };

  return (
    <div className={styles.blankPage}>
      <div className={styles.topbar}>
        <Button
          className={styles.item}
          type="tertiary"
          icon={isDarkMode ? <IconMoon /> : <IconSun />}
          onClick={() => {
            setIsDarkMode(!isDarkMode);
          }}
        />
      </div>

      <div className={styles.logoArea}>
        <div className={styles.logo}>LOGO</div>
        <div className={styles.slogan}>H5编辑器，飞一样的感觉</div>
      </div>

      <div className={styles.container}>
        <div className={styles.left}>
          <Button onClick={openProject} icon={<IconFolderOpen />}>
            打开工程
          </Button>
          <Button
            onClick={() => {
              location.href = "https://h5mota.com/games/template/H5mota_template.zip";
            }}
            icon={<IconAlignBottom />}
          >
            下载样板
          </Button>
        </div>
        <div className={styles.line}></div>
        <div className={styles.right}>
          <Text link={{ href: "https://jq.qq.com/?_wv=1027&k=vYiZNxL6" }}>H5魔塔交流群</Text>
          <Text link={{ href: "https://space.bilibili.com/494596570" }}>b站官方号</Text>
          <Text link={{ href: "https://h5mota.com" }}>H5mota主站</Text>
        </div>
      </div>

      <div className={styles.foot}>Copyright © 2022 h5mota.com 陕ICP备18008020号-1</div>
    </div>
  );
};

export default BlankPage;
