# 键位与灯效

原项目固件的第 0 层是标准 17 键数字小键盘：

```text
Num   /   *   -
 7    8   9   +
 4    5   6   │
 1    2   3  Enter
   0      .   │
```

`+`、`Enter` 各占两行，`0` 占两列。数字键是否输入数字还取决于电脑的 Num Lock 状态。

## 本次实物的 `Num` 键

原作者固件与 `v1.0.0` 源码将左上角设为 `LT(1,KC_NUM)`：点按 Num Lock，按住进入第 1 层以控制 RGB。本次实物通过 Vial 改成普通 Num Lock，2026-09-30 再次读回 `0x0053`，确认配置保留。

2026-09-30 起，本仓库的 `default`、`via`、`vial` 三份 [键位源码](../firmware/qmk/w17/keymaps/vial/keymap.c) 均改为 `KC_NUM`，和实物的 Num 行为一致；其他键位及灯效层保留。新构建源码的默认值已修改，但现有动态键位可能继续覆盖源码默认值。若再次刷入原作者 `.bin` 后出现旧行为，可导入[实物键位备份](../config/vial/README.md)。

## 在 Vial 中设置普通 Num Lock

1. 通过 Type-C 将已烧好 QMK/Vial 固件的键盘连接电脑，打开 [Vial](https://get.vial.today/download/)。
2. 选择键盘，切到第 `0` 层，点击左上角的 `Num` 键。
3. 在下方键码中选择 **Num Lock**（`KC_NUMLOCK`）。Vial 会立即将修改写入键盘；无需 ST-Link，也无需重新烧录 Bootloader。
4. 重新选中该键，确认显示为 `Num Lock`，再用记事本或键盘测试器检查单按行为。

第 1 层的 RGB 键位仍保存在固件中，但当前没有通过左上角 `Num` 键进入它。固件启用了 VialRGB，可在 Vial 的灯光界面继续调整；以后也可以为其他键分配灯效层入口。
