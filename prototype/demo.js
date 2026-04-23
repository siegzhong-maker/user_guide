/**
 * 录制前引导 — 横屏原型场景与聚光灯
 */
(function () {
  const app = document.getElementById("app");
  const sceneSelect = document.getElementById("sceneSelect");
  const hallLayer = document.getElementById("hallLayer");
  const mergeFigure3 = document.getElementById("mergeFigure3");
  const figure3Block = document.getElementById("figure3Block");
  const coachLayer = document.getElementById("coachLayer");
  const coachSpot = document.getElementById("coachSpot");
  const coachBubble = document.getElementById("coachBubble");
  const coachStepLabel = document.getElementById("coachStepLabel");
  const coachText = document.getElementById("coachText");
  const coachNext = document.getElementById("coachNext");
  const coachSkipAll = document.getElementById("coachSkipAll");
  const coachClose = document.getElementById("coachClose");
  const btnTutorial = document.getElementById("btnTutorial");
  const tutorialDrawer = document.getElementById("tutorialDrawer");
  const tutorialBackdrop = document.getElementById("tutorialBackdrop");
  const closeTutorial = document.getElementById("closeTutorial");
  const chapterList = document.getElementById("chapterList");
  const demoFab = document.getElementById("demoFab");
  const demoDock = document.getElementById("demoDock");
  const demoBackdrop = document.getElementById("demoBackdrop");
  const demoDockClose = document.getElementById("demoDockClose");
  const btnEnterRecord = document.getElementById("btnEnterRecord");
  const btnBackHome = document.getElementById("btnBackHome");

  /** 与 CSS 中「大屏 / 手机」断点一致；给 body 加 .force-mobile-preview 可在大屏上强制手机布局 */
  function useMobileSceneUi() {
    if (document.body && document.body.classList.contains("force-mobile-preview")) return true;
    return !window.matchMedia(
      "(min-width: 1024px) and (min-height: 520px) and (hover: hover) and (pointer: fine)"
    ).matches;
  }

  function setAppView(view) {
    if (!app) return;
    const v = view === "record" ? "record" : "home";
    app.setAttribute("data-app-view", v);
    if (document.body) {
      document.body.setAttribute("data-app-view", v);
    }
    const metaTheme = document.getElementById("metaTheme");
    if (metaTheme) {
      metaTheme.setAttribute("content", v === "home" ? "#EEF0F3" : "#050608");
    }
  }

  function setDemoPanelExpanded(expanded) {
    if (!demoDock) return;
    if (!useMobileSceneUi()) {
      demoDock.setAttribute("data-expanded", "true");
      if (demoFab) demoFab.setAttribute("aria-expanded", "true");
      if (demoBackdrop) demoBackdrop.hidden = true;
      return;
    }
    const on = Boolean(expanded);
    demoDock.setAttribute("data-expanded", on ? "true" : "false");
    if (demoFab) demoFab.setAttribute("aria-expanded", on ? "true" : "false");
    if (demoBackdrop) demoBackdrop.hidden = !on;
    if (on) {
      requestAnimationFrame(() => {
        if (sceneSelect) sceneSelect.focus();
      });
    }
  }

  const steps = [
    {
      el: () => document.getElementById("spotSettings"),
      label: "步骤 1 / 3",
      text: "顶栏左侧首枚为「设置」：分辨率、设备与拍摄相关选项多从此进入。",
    },
    {
      el: () => document.getElementById("spotTrack"),
      label: "步骤 2 / 3",
      text: "「目标追踪」在顶栏（第 3 枚）：开启后画面可锁定运动目标，云台配合跟随。",
    },
    {
      el: () => document.getElementById("spotRecord"),
      label: "步骤 3 / 3",
      text: "右侧红色主按钮为「录制」：开始/结束本段录像；旁为拍照与运镜辅助。",
    },
  ];

  let currentCoachIndex = 0;

  function getAppRect() {
    return app.getBoundingClientRect();
  }

  function positionSpot(el) {
    const a = getAppRect();
    const r = el.getBoundingClientRect();
    const pad = 6;
    const top = r.top - a.top - pad;
    const left = r.left - a.left - pad;
    const w = r.width + pad * 2;
    const h = r.height + pad * 2;
    const isCircle = el.classList.contains("record");
    coachSpot.style.top = `${top}px`;
    coachSpot.style.left = `${left}px`;
    coachSpot.style.width = `${w}px`;
    coachSpot.style.height = `${h}px`;
    coachSpot.style.borderRadius = isCircle ? "50%" : "14px";
  }

  function positionBubble() {
    const a = getAppRect();
    const s = coachSpot.getBoundingClientRect();
    const m = 12;
    const bw = Math.min(300, a.width * 0.48);
    coachBubble.style.width = `${bw}px`;
    const spotCenterX = (s.left + s.width / 2 - a.left) / a.width;
    // 控件在画面右 1/3（如录制键）时，气泡优先在聚光灯左侧，少挡中央取景
    let left;
    if (spotCenterX > 0.58) {
      left = s.left - a.left - bw - m;
      if (left < m) {
        left = s.right - a.left + m;
      }
    } else {
      left = s.right - a.left + m;
      if (left + bw > a.width - m) {
        left = s.left - a.left - bw - m;
      }
    }
    left = Math.max(m, Math.min(left, a.width - bw - m));
    let top = s.bottom - a.top + m;
    if (top + coachBubble.offsetHeight > a.height - m) {
      top = s.top - a.top - coachBubble.offsetHeight - m;
    }
    top = Math.max(m, Math.min(top, a.height - 80));
    coachBubble.style.left = `${left}px`;
    coachBubble.style.top = `${top}px`;
  }

  function showCoachStep(index) {
    currentCoachIndex = Math.max(0, Math.min(steps.length - 1, index));
    const step = steps[currentCoachIndex];
    const el = step.el();
    if (!el) return;
    coachLayer.hidden = false;
    coachLayer.setAttribute("aria-hidden", "false");
    coachStepLabel.textContent = step.label;
    coachText.textContent = step.text;
    coachNext.textContent = currentCoachIndex === steps.length - 1 ? "完成" : "下一步";
    requestAnimationFrame(() => {
      positionSpot(el);
      positionBubble();
    });
  }

  function clearCoach() {
    coachLayer.hidden = true;
    coachLayer.setAttribute("aria-hidden", "true");
  }

  function setScene(scene) {
    if (scene === "app-home") {
      setAppView("home");
      app.setAttribute("data-scene", "app-home");
      if (sceneSelect && sceneSelect.value !== "app-home") {
        sceneSelect.value = "app-home";
      }
      clearCoach();
      hallLayer.hidden = true;
      setTutorialOpen(false);
      if (mergeFigure3) mergeFigure3.checked = false;
      if (figure3Block) figure3Block.hidden = true;
      return;
    }

    setAppView("record");
    app.setAttribute("data-scene", scene);
    if (sceneSelect && sceneSelect.value !== scene) {
      sceneSelect.value = scene;
    }
    clearCoach();
    hallLayer.hidden = true;
    setTutorialOpen(false);
    if (mergeFigure3) mergeFigure3.checked = false;
    if (figure3Block) figure3Block.hidden = true;

    if (scene === "hall") {
      hallLayer.hidden = false;
    } else if (scene === "coach-1") {
      showCoachStep(0);
    } else if (scene === "coach-2") {
      showCoachStep(1);
    } else if (scene === "coach-3") {
      showCoachStep(2);
    } else if (scene === "tutorial") {
      setTutorialOpen(true);
    } else if (scene === "post") {
      // 仅作示意
    } else {
      // main
    }
  }

  function setTutorialOpen(open) {
    const on = Boolean(open);
    app.setAttribute("data-tutorial-open", on ? "true" : "false");
    tutorialDrawer.hidden = !on;
    tutorialBackdrop.hidden = !on;
    if (on && sceneSelect) {
      sceneSelect.value = "tutorial";
    }
  }

  if (mergeFigure3 && figure3Block) {
    mergeFigure3.addEventListener("change", () => {
      figure3Block.hidden = !mergeFigure3.checked;
    });
  }

  document.querySelectorAll("[data-close-hall]").forEach((b) => {
    b.addEventListener("click", () => {
      hallLayer.hidden = true;
      if (sceneSelect && sceneSelect.value === "hall") {
        setScene("main");
      }
    });
  });

  if (sceneSelect) {
    sceneSelect.addEventListener("change", (e) => {
      setScene(e.target.value);
      if (useMobileSceneUi()) setDemoPanelExpanded(false);
    });
  }

  if (demoFab) {
    demoFab.addEventListener("click", () => {
      const open = demoDock.getAttribute("data-expanded") !== "true";
      setDemoPanelExpanded(open);
    });
  }
  if (demoBackdrop) {
    demoBackdrop.addEventListener("click", () => setDemoPanelExpanded(false));
  }
  if (demoDockClose) {
    demoDockClose.addEventListener("click", () => setDemoPanelExpanded(false));
  }

  document.querySelectorAll('input[name="anchor"]').forEach((r) => {
    r.addEventListener("change", (e) => {
      if (e.target.checked) {
        app.setAttribute("data-tutorial-anchor", e.target.value);
        requestAnimationFrame(() => {
          if (!coachLayer.hidden) positionBubble();
        });
      }
    });
  });

  if (btnEnterRecord) {
    btnEnterRecord.addEventListener("click", () => {
      setScene("main");
    });
  }
  if (btnBackHome) {
    btnBackHome.addEventListener("click", () => {
      setScene("app-home");
    });
  }

  if (btnTutorial) {
    btnTutorial.addEventListener("click", () => {
      setScene("tutorial");
    });
  }
  if (closeTutorial) {
    closeTutorial.addEventListener("click", () => {
      setScene("main");
    });
  }
  if (tutorialBackdrop) {
    tutorialBackdrop.addEventListener("click", () => {
      setScene("main");
    });
  }

  if (chapterList) {
    chapterList.addEventListener("click", (e) => {
      const btn = e.target.closest(".chapter-item");
      if (!btn) return;
      document.querySelectorAll(".chapter-item").forEach((x) => x.classList.remove("is-active"));
      btn.classList.add("is-active");
    });
  }

  if (coachNext) {
    coachNext.addEventListener("click", () => {
      if (currentCoachIndex >= steps.length - 1) {
        clearCoach();
        if (sceneSelect) {
          sceneSelect.value = "main";
          app.setAttribute("data-scene", "main");
        }
        return;
      }
      showCoachStep(currentCoachIndex + 1);
    });
  }
  if (coachSkipAll) {
    coachSkipAll.addEventListener("click", () => {
      clearCoach();
      if (sceneSelect) {
        const v = sceneSelect.value;
        if (v && v.startsWith("coach-")) {
          sceneSelect.value = "main";
          app.setAttribute("data-scene", "main");
        }
      }
    });
  }
  if (coachClose) {
    coachClose.addEventListener("click", () => {
      clearCoach();
      if (sceneSelect) {
        if (sceneSelect.value && sceneSelect.value.startsWith("coach-")) {
          sceneSelect.value = "main";
          app.setAttribute("data-scene", "main");
        }
      }
    });
  }

  window.addEventListener("resize", () => {
    if (!coachLayer.hidden) {
      const step = steps[currentCoachIndex];
      const el = step && step.el();
      if (el) {
        positionSpot(el);
        positionBubble();
      }
    }
  });

  // 键盘（外接键盘或桌面调试）
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && useMobileSceneUi() && demoDock && demoDock.getAttribute("data-expanded") === "true") {
      e.preventDefault();
      setDemoPanelExpanded(false);
      return;
    }
    if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "SELECT" || e.target.tagName === "TEXTAREA")) {
      return;
    }
    const k = e.key;
    if (k === "1") setScene("coach-1");
    else if (k === "2") setScene("coach-2");
    else if (k === "3") setScene("coach-3");
    else if (k === "h" || k === "H") setScene("hall");
    else if (k === "t" || k === "T") setScene("tutorial");
    else if (k === "r" || k === "R") setScene("main");
    else if (k === "0") setScene("app-home");
  });

  // 初次布局：从横屏·应用首页进入，点「拍摄」再进录制主界面
  setScene("app-home");
  setDemoPanelExpanded(false);

  window
    .matchMedia("(min-width: 1024px) and (min-height: 520px) and (hover: hover) and (pointer: fine)")
    .addEventListener("change", () => {
      setDemoPanelExpanded(useMobileSceneUi() ? false : true);
    });
})();
