# 实物与测试记录

本记录汇总本次复刻的烧录截图、设备识别结果、用户操作反馈及完工照片。没有保存逐键自动化测试日志，因此下表只列已明确观察到的结果。

| 检查项 | 结果与依据 |
| --- | --- |
| SWD 连接 | STM32CubeProgrammer 识别到 Device ID `0x410`、64 KB Flash；连接时目标电压约 3.28 V。`0x410` 是 STM32F1 中等容量系列的设备 ID，不能单凭它区分 F101/F102/F103 的具体型号。 |
| Bootloader | 写入 `stm32duino_bootloader.bin` 后，Windows 设备管理器出现 `Maple 003`。 |
| USB 驱动 | QMK Toolbox 安装 STM32duino/WinUSB 驱动后，能够识别 `Maple 003`。 |
| 键盘固件 | 通过 QMK Toolbox 写入 `w17_pad.bin`；用户确认烧录成功、PCB 灯亮。 |
| `9` 键 | 原记录显示对应二极管虚焊，补焊后恢复。 |
| `Num` 键 | Vial 动态键位从 `0x4153` 改为 `0x0053`，读回验证为普通 Num Lock。 |
| 完工装配 | [正面](../assets/photos/finished-front.webp)可见键帽、灯光和白色外壳；[背面](../assets/photos/finished-back.webp)可见外壳背面和脚垫。 |

## 当前状态

PCB、固件、按键与外壳装配已完成，键盘可通过 Type-C 使用。固件构建时使用的完整 QMK/Vial 环境版本和逐键测试原始日志尚未归档；本仓库不把这两项写成可复现验证结果。
