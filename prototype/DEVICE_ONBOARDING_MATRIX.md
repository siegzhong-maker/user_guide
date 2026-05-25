# Falcon vs 变色龙：录制前引导对照表（评审用）

本文档与原型中的存储键、分支逻辑一致，便于评审与验收对齐。

## 总览

| 维度 | Falcon | 变色龙（Chameleon） |
|------|--------|----------------------|
| 产品定位 | 霍尔校准 + 首发视频（首次上手，校准后弹出）+ 架设说明 + 界面引导轮播（直播/计分牌图文并茂） | 线性多页「录制前说明」；**无内置视频教程** |
| 必经（默认不因「不再提示」关闭） | **每次进入取景原型演示**：霍尔校准弹窗；真机语义为每次使用前完成霍尔校准 | 无独立霍尔校准步骤时，整套更接近纯教育内容 |
| 「不再提示」粒度 | **一条键**：UI 引导**最后一步**勾选，控制架设引导 + UI 蒙层均不再自动播放（**霍尔校准仍独立且必经**） | **一条键**：整段四步引导不再自动播放 |
| 常驻入口 | Tutorial Center（`?`），含视频条目见下表 | 同上入口保留；设置内无视频预览区与教程列表条目 |

## Falcon：步骤顺序与存储键

**首次上手（`tw_proto_onboarding_done_v1` 尚未为 `1`）默认顺序**：**霍尔校准**（进入拍摄页即开始）→ 校准完成后全屏首发视频（`falcon-intro`）→ 关闭播放器并写入已看后 → 架设引导（Hall guide）→ **界面引导轮播**（直播 / 计分牌，与变色龙同款图文并茂）。

**再次进入（上手已完成）**：不再强制首发视频；仍先走霍尔校准（原型为每次刷新即弹出），再按「不再展示」标志决定是否自动播放架设引导与 UI 蒙层。

| 步骤 | 自动弹出条件 | localStorage 键（原型） | 「不再自动展示」是否适用 |
|------|----------------|---------------------------|----------------------------|
| 首发视频（仅 Falcon） | 首次上手、校准完成后且尚未标记「已关闭首发播放器」 | `tw_proto_falcon_intro_video_seen_v1`（关闭全屏播放器后写 `1`） | **不适用**（与霍尔、指引区分） |
| 霍尔校准 | 原型：每次加载 Falcon 分支即演示；完成后写入 `tw_proto_hall_v1`（`LS_CAL`）供状态同步 | `tw_proto_hall_v1` | **不适用** |
| 架设引导（Hall guide） | 校准完成后，且未勾选「不再展示整套引导」 | 包含在 `LS_FALCON_SKIP_AUTO_GUIDES` 中 | **适用**（与 UI 蒙层同一开关，仅在末步勾选） |
| 界面引导轮播（live / 计分牌） | 架设流程结束后，且未完成或已勾选末步；全屏卡片 + 示意图，非箭头指向 HUD | 同上 `tw_proto_falcon_skip_auto_guides_v1` | **适用** |

**霍尔校准弹窗 — 用户可见英文（`#calibration-modal`）**

- 标题：`Getting ready`（无副标题）
- 不可跳过；约 2s 进度条（内部仍为霍尔校准流程）

**架设引导 — 用户可见英文**

| 步 | 标签/标题 | 说明 |
|----|-----------|------|
| 1 | `All set` · `Align with the center line first` | `Rotate the gimbal to line up with the center line, then hold it steady.` |
| 2 | — · `Set your mounting height` | `About 2.5 m works well for midfield coverage and stable tracking.` |

**界面引导轮播（Falcon UI，2 步）**

| 步 | 标题 | 说明 |
|----|------|------|
| 1 | `Start live streaming` | `Tap Live on the left to go live. You can keep recording while you stream.` |
| 2 | `Show the scoreboard` | `Tap SC on the left to show live scores on your stream or recording.` |

**教程目录（仅 Falcon 可见）**：`falcon-intro`（`afterCalibration`，仅新用户；自动播放排在霍尔校准之后）、`hall-setup` 条目标题 **Setup and alignment**（`afterCalibration`，全员可从 Tutorial Center 打开）。变色龙侧 `getVisibleTutorials()` 固定为空数组。

兼容：历史 `tw_proto_never_v1`、旧版 `tw_proto_falcon_skip_setup_tips_v1` / `tw_proto_falcon_skip_ui_hints_v1` 会迁移为统一的 `tw_proto_falcon_skip_auto_guides_v1`。

**演示说明**：设置里 **Replay pre-capture guides** 触发的 `replayAllGuidesWithoutCalibration` 会跳过校准仅重播架设 + UI，便于对照评审；**真机流程仍以每次霍尔校准为先**。

## 变色龙：步骤与存储键

| 步骤 | 用户可见英文（概要） | 存储 |
|------|----------------------|------|
| 1 | `Line up with the center line for full court coverage.` | 整套是否不再自动播放：`tw_proto_chameleon_carousel_skip_v1`（末页勾选后为 `1`） |
| 2 | `Mount on a tripod at least 2.2 m high. Check your framing before you record.` | 同上 |
| 3～4 | 与 Falcon 轮播相同：Live / SC（图文并茂） | 同上 |
| 视频教程 | **无**；设置页 Tutorial **不展示**视频预览区；**无**拍摄页 `?` 浮窗及浮窗开关（仅保留 **Replay shooting guide**），完成轮播后**不会**自动弹出空教程列表 | — |
| Skip | 任意页可跳过整段 | 关闭层叠，不写入跳过标志（与产品策略一致时可改为写入） |

设备分支：`tw_proto_device_family_v1` 值为 `falcon` 或 `chameleon`。

## 验收对照（摘要）

- **Falcon**：首次上手进入拍摄页先霍尔校准（仅 **Getting ready** + 进度条），校准结束后再弹全屏首发视频，关闭后走架设引导 → 界面引导轮播（直播、计分牌）。末步勾选「不再展示」后，下次仍走霍尔校准，但不再自动播放架设引导与界面轮播。
- **变色龙**：无视频教程、无 `?` 浮窗；勾选末页「不再展示」后，进入取景不再自动播四步流程；可在设置 → Tutorial Center 重播拍摄引导。
- **Falcon**：`?` 打开教程中心快捷菜单（关闭浮窗 / 打开 Tutorial Center）；不再自动弹出教程列表（避免与首发全屏视频抢焦点）。
