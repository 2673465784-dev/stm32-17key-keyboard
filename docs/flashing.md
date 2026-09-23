# STM32 17 键小键盘烧录指南

适用于 [morempty 的 STM32F103C8T6 版本 PCB](https://oshwhub.com/morempty/STM32-PAD-17jian-shuo-zi-jian-pa)。首次烧录分两步：先通过 SWD 写入 Bootloader，再通过 Type-C 写入键盘固件。原项目附件中分别提供 `stm32duino_bootloader.bin` 和 `w17_pad.bin`；两者用途不同。

## 所需物品

- ST-Link V2 和四根连接线或四位弹簧探针
- 可传输数据的 Type-C 线
- [STM32CubeProgrammer](https://www.st.com/en/development-tools/stm32cubeprog.html)
- [QMK Toolbox](https://github.com/qmk/qmk_toolbox/releases)
- [原项目附件](https://oshwhub.com/morempty/STM32-PAD-17jian-shuo-zi-jian-pa)中的两个 `.bin` 文件

本次下载并使用的文件可用 SHA-256 核对：

| 文件 | SHA-256 |
| --- | --- |
| `stm32duino_bootloader.bin` | `98218deb9ec4f3abf7b04039269e4b75587a9da5f422c2c13e46f1ab3f5304ea` |
| `w17_pad.bin` | `c0a55c808f018235bd6b3e14a6f4b86fc4bd052b3b5f88dbc1347c27e6ee242e` |

## 1. 连接 SWD 触点

以本次 PCB 的背面照片方向为准：**Type-C 在左侧、复位按钮在右下角**，最右侧竖排四个触点从上到下如下。最上面是方形焊盘，其余是圆形焊盘。

| PCB 触点（从上到下） | 信号 | 本次使用的紫色 ST-Link V2 排针 |
| --- | --- | --- |
| 1：方形 | GND | 6 号 GND |
| 2：圆形 | 3.3V | 8 号 3.3V |
| 3：圆形 | SWCLK | 2 号 SWCLK |
| 4：圆形 | SWDIO | 4 号 SWDIO |

ST-Link V2 克隆版的排针排列可能不同，务必以自己烧录器上的**信号丝印**为准，不要只按针脚编号或杜邦线颜色接。不得将 5V 接到 PCB 的 3.3V 触点。连接 SWD 时不要同时给 PCB 插 Type-C。

本板使用表面触点，排针不能插入。可用四位弹簧探针，或让四根针稳定垂直接触四个焊盘；保持针尖在焊盘中心，避免横向滑动短接相邻触点。接触不稳时先固定连接，再操作软件。

## 2. 用 STM32CubeProgrammer 写入 Bootloader

1. 接好四根线后把 ST-Link 插入电脑。在 STM32CubeProgrammer 右侧选择 `ST-LINK`、`SWD`，将 SWD Frequency 设为约 **400–1000 kHz**。
2. 保持触点稳定，点击 `Connect`。应识别到 STM32F1 中等容量设备，Device ID 为 `0x410`，Flash 为 64 KB；还应核对芯片本体丝印是 `STM32F103C8T6`。仅有目标电压并不表示 SWD 信号已经接通。
3. 进入左侧 `Erasing & Programming`，选择 **`stm32duino_bootloader.bin`**，Start address 填 `0x08000000`，勾选 `Verify programming`。不要勾选 `Skip flash erase before programming` 或 `Full chip erase`。
4. 点击 `Start Programming`。保持触点不动，等待下载完成并显示校验成功，再断开 ST-Link。

如果只看到 `File download complete`，随后连接丢失，而没有 `Verification...OK`，应视为**写入完成但未校验**。本次通过后续出现的 `Maple 003` 验证了 Bootloader 能运行；复刻时仍推荐完成写后校验。

## 3. 用 QMK Toolbox 写入键盘固件

1. 拔掉 ST-Link 并移除 SWD 探针，再用数据 Type-C 线连接 PCB。首次应能看到 `Maple 003`。
2. 若 QMK Toolbox 显示 `NO DRIVER`，以管理员身份打开 QMK Toolbox，运行 `Tools → Install Drivers`。安装完成后重新插拔 Type-C，直到日志显示 `STM32duino device connected (WinUSB): Maple 003`。
3. 在 QMK Toolbox 的 `Local file` 处打开 **`w17_pad.bin`**。`MCU (AVR only)` 不需要设置；不必勾选 `Auto-Flash`。
4. 点击 `Flash`，等待成功日志，再重新插拔 Type-C。键盘应作为 USB 输入设备工作，RGB 灯可点亮。

## 常见问题

| 现象 | 优先检查 |
| --- | --- |
| `No STM32 target found` | 四线顺序、探针接触、SWD 频率及供电；3.3V 正常不代表 SWDIO/SWCLK 接通。 |
| 连接数秒后丢失 | 固定四个触点，降低 SWD 频率；烧录期间保持不动。 |
| `Maple 003` 显示黄色感叹号或 `NO DRIVER` | 用 QMK Toolbox 安装驱动并重新插拔 Type-C。 |
| 烧入固件后 USB 无法识别 | 检查 Type-C 数据线、接口焊点、MCU 的 D+/D− 焊点，以及原设计中的 D+ 1.5 kΩ 上拉电阻。 |
| `Num` 单按行为异常 | 本次固件原键位是 `LT(1,KC_NUM)`；见[键位说明](keymap.md)。 |
