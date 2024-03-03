import { FC } from "react";
import styles from "./index.module.less";
import { Button, Icon, Tabs } from "@douyinfe/semi-ui";
import { IconGithubLogo, IconMoon, IconSun } from "@douyinfe/semi-icons";
import QQ from "@/assets/icons/qq.svg?react";
import { PANELS, Panels, PanelsModel } from "../store/panels";
import { ThemeModel } from "../store/theme";

const Topbar: FC = () => {

  const { panel, setPanel } = PanelsModel();
  const { isDarkMode, setIsDarkMode } = ThemeModel();

  return (
    <div className={styles.topbar}>
      <div className={styles.logo}>
        <h2>Logo</h2>
      </div>
      <Tabs
        className={styles.tabs}
        size="medium"
        tabList={PANELS.map(({ itemKey, text }) => ({ itemKey, tab: text }))}
        activeKey={panel}
        onChange={(key) => setPanel(key as Panels)}
      />
      <div style={{ marginLeft: "auto" }}></div>
      <Button className={styles.item}
        type="tertiary"
        icon={isDarkMode ? <IconMoon /> : <IconSun />}
        onClick={() => {
          setIsDarkMode(!isDarkMode);
        }}
      />
      <a
        className={styles.item}
        href="http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=IXXBCTPy3DJezMRySI96YjcqANuq84Ib&authKey=t%2FoBuzBqERNop2eKkTL1IJoESSXtxZjVpokreV2IESnNAIlw0JK6OcKQcCjFdD6O&noverify=0&group_code=744714518"
        target="_blank"
      >
        <Button type="tertiary" icon={<Icon svg={<QQ style={{ width: 16 }} />} />} />
      </a>
      <a className={styles.item} href="https://github.com/tocque/tileset-editor" target="_blank">
        <Button type="tertiary" icon={<IconGithubLogo />} />
      </a>
    </div>
  );
};

export default Topbar;
