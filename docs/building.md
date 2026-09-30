# 固定版本编译

本仓库在原作者 `w17` 键盘目录上调整默认 Num 键，并适配选定的 Vial-QMK 基线。原作者 `w17_pad.bin` 的构建版本未知；这里建立的是本仓库自己的构建流程，不宣称新文件与原作者二进制相同。

## 构建基线

以 [`firmware/build-lock.json`](../firmware/build-lock.json) 为准：

| 项目 | 固定值 |
| --- | --- |
| Vial-QMK | `42ba6375a6efde2c0190ca5519d48e7e50bdf469`（含 Vial 与 VialRGB 源码） |
| 子模块 | 该提交记录的 ChibiOS、ChibiOS-Contrib 等提交；不跟随最新分支 |
| 系统 / Python | Ubuntu 22.04 / 3.10.14 |
| QMK CLI / MILC | 1.1.2 / 1.6.8 |
| pip / 其他 Python 依赖 | 26.2.1 / `firmware/python-requirements.lock` 全部固定 |
| ARM GCC | 10.3.1，Ubuntu 包 `15:10.3-2021.07-4` |
| 目标 | `make w17:vial -j2` |

源码改动包括：三份键位的 `LT(1,KC_NUM)` 改为 `KC_NUM`；删除旧的 `config_common.h` 引用；将 B13 灯珠引脚宏更新为 `WS2812_DI_PIN`。引脚和矩阵连接未改变。

2026-09-30 首次完整通过的[构建记录](https://github.com/2673465784-dev/stm32-17key-keyboard/actions/runs/36665919761)生成 44,736 字节应用固件，确认 ELF 包含 `vial_handle_cmd`，并通过 STM32F103C8 的应用大小、RAM 栈地址和 Flash 复位入口检查。下载后 SHA-256 与产物校验清单一致：`4d255fe7f9bc87c74c0bded5f0c3e03c652be569fa6603b4c83af505d6b1340b`。完整 Python 锁定表取自该次实际构建。

## GitHub Actions

打开仓库的 **Actions → Build W17 Vial firmware → Run workflow**。`.github/workflows/build-firmware.yml` 保存完整环境安装与构建命令。

成功后下载 `w17-vial-build` Artifact，包含：

- `w17_vial.bin`：新编译的键盘应用固件。
- `w17-vial-corresponding-source.tar.gz`：本次构建的 Vial-QMK 源码、键盘配置及已获取子模块，保留上游许可文件。
- `SHA256SUMS`：固件与对应源码包的哈希。
- `build-lock.json`、`project-commit.txt`、`submodules.txt`、`python-packages.txt`、`toolchain.txt`：源码与环境记录。

Artifact 保留 30 天，可重新运行构建获得。**编译成功只证明构建链通过；新固件尚需按验收表实测。**当前使用的原作者固件不会被 Actions 修改。

## 本地 Linux / WSL

准备 Ubuntu 22.04、Git、make、ARM GCC、libnewlib、dfu-util 和 Python 3.10.14。在仓库根目录运行以下步骤（Windows 用户也可直接使用 Actions）：

```sh
git clone https://github.com/vial-kb/vial-qmk.git build/vial-qmk
git -C build/vial-qmk checkout --detach 42ba6375a6efde2c0190ca5519d48e7e50bdf469
git -C build/vial-qmk submodule update --init --recursive
cp -R firmware/qmk/w17 build/vial-qmk/keyboards/w17
python3 -m venv build/venv
. build/venv/bin/activate
python -m pip install 'pip==26.2.1'
python -m pip install -r firmware/python-requirements.lock
python -m pip check
cd build/vial-qmk
make w17:vial -j2
```

输出位于 `build/vial-qmk/w17_vial.bin`。核心、子模块、Python 依赖和 ARM GCC 版本已固定；Ubuntu runner 及系统其他包仍会更新，因此本流程保证可追溯的构建基线，不宣称二进制逐字节复现。

## 烧录与验证

`w17_vial.bin` 是应用固件，使用 QMK Toolbox 经 Maple Bootloader 烧录；不要当作 Bootloader 写到 `0x08000000`。烧录前先备份设备键位。现有动态配置可能覆盖新固件默认值；不要为测试默认值随意清空 EEPROM。

按[验收清单](test-checklist.md)实测成功并记录后，才适合将新二进制作为“已实测固件”发布。原来的 `v1.0.0` 是源码与文档归档版。
