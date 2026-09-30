# Vial 键位备份

`w17-keymap-2026-09-30.vil` 于 2026-09-30 从实际 W17PAD 读取，包含 4 层、5×4 矩阵的键位；两次完整读取相同，第 0 层 `(0,0)` 为 `0x0053`（普通 Num Lock）。设备 UID 与仓库的 Vial 定义匹配。

这是 **仅键位备份**，可以由 Vial 导入；不包含 RGB、宏、Tap Dance、Combo 或 QMK 设置的完整快照。需要完整备份时，在 Vial 中执行 `File → Save current layout...`，并另外记录灯光设置。

数字键与 RGB 层使用 Vial 的符号键码保存，避免协议 5/6 的 RGB 数字编码变化造成误映射；`_backup.raw_layout` 同时保留原始读取值。脚本无法识别的自定义键码按十六进制保留，跨版本恢复时需另行核对。

## 恢复

1. 用 Type-C 连接键盘，打开 Vial 并选中 W17PAD。
2. 先用 `File → Save current layout...` 保存当前配置。
3. 执行 `File → Load saved layout...`，选择本目录的 `.vil` 文件。导入会覆盖文件内各层的有效键位。
4. 检查第 0 层左上角显示 `Num Lock`，再测试数字输入。保持 USB 连接直到导入完成。

## 再次备份

安装 Node.js 后，在仓库根目录执行：

```sh
npm ci --prefix tools
node tools/backup-keymap.cjs config/vial/w17-keymap-new.vil
```

备份脚本只读取 HID 配置，不发送改键、重置或解锁指令。它检查 VID/PID、Raw HID 用途和 UID，只接受一块匹配键盘；拒绝覆盖已有文件。先关闭 Vial，避免同时读取设备造成响应交错。
