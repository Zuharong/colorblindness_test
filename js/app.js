document.body.dataset.screen = "start";
(() => {
  const $ = id => document.getElementById(id);
  const screens = { start: $("screen-start"), question: $("screen-question"), end: $("screen-end") };
  const stage = $("stage"), overlay = $("overlay");
  let index, correctCount, results, selected, timeLeft, timer, qStart;

  const show = name => { document.body.dataset.screen = name; Object.entries(screens).forEach(([k, el]) => el.classList.toggle("active", k === name)); };
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const isSingle = q => q.type === "match" || q.type === "odd";
  const el = (tag, cls, bg) => { const e = document.createElement(tag); e.className = cls; if (bg) e.style.background = bg; return e; };
  const fmt = s => `00:${String(s).padStart(2, "0")}`;

  function start() { index = 0; correctCount = 0; results = []; updateScore(); loadQuestion(); }

  function updateScore() {
    const pct = Math.round(correctCount / QUESTIONS.length * 100);
    $("hud-score").textContent = pct + "%";
    $("score-fill").style.width = pct + "%";
  }

  function loadQuestion() {
    const q = QUESTIONS[index];
    selected = new Set();
    $("q-prompt").innerHTML = q.prompt;
    $("hud-progress").textContent = `Question ${index + 1} of ${QUESTIONS.length}`;
    stage.innerHTML = "";
    stage.style.setProperty("--f", `url(#${q.filter})`);

    const order = shuffle(q.items.map((_, i) => i));
    const pick = (btn, i) => {
      if (isSingle(q)) { selected.clear(); stage.querySelectorAll(".selected").forEach(n => n.classList.remove("selected")); }
      const on = !selected.has(i);
      on ? selected.add(i) : selected.delete(i);
      btn.classList.toggle("selected", on);
      btn.setAttribute("aria-pressed", on);
    };

    if (q.type === "match") {
      stage.append(el("div", "ref swatch", q.reference));
      const label = el("p", "label"); label.textContent = "Select one answer";
      const opts = el("div", "options");
      order.forEach((i, pos) => {
        const b = el("button", "opt"); b.setAttribute("aria-pressed", "false");
        const letter = el("span", ""); letter.textContent = "ABCD"[pos];
        b.append(el("span", "dot swatch", q.items[i][0]), letter);
        b.onclick = () => pick(b, i); opts.append(b);
      });
      stage.append(label, opts);
    } else {
      const grid = el("div", "grid"); grid.style.gridTemplateColumns = `repeat(${q.cols},1fr)`;
      order.forEach(i => {
        const circles = q.type === "circles";
        const b = el("button", "tile swatch", circles ? q.bg : q.items[i][0]);
        b.setAttribute("aria-pressed", "false"); b.setAttribute("aria-label", "Color tile");
        if (circles) b.append(el("span", "dot", q.items[i][0]));
        b.onclick = () => pick(b, i); grid.append(b);
      });
      stage.append(grid);
    }
    show("question");
    startTimer(q.time);
  }

  function startTimer(seconds) {
    clearInterval(timer);
    timeLeft = seconds; qStart = Date.now();
    $("hud-time").textContent = fmt(timeLeft);
    timer = setInterval(() => {
      $("hud-time").textContent = fmt(--timeLeft);
      if (timeLeft <= 0) finish(true);
    }, 1000);
  }

  function finish(timedOut) {
    clearInterval(timer);
    const q = QUESTIONS[index];
    const spent = Math.min(q.time, (Date.now() - qStart) / 1000);
    const targets = q.items.map((t, i) => t[1] ? i : -1).filter(i => i >= 0);
    const correct = !timedOut && targets.length === selected.size && targets.every(i => selected.has(i));
    if (correct) correctCount++;
    results.push({ correct, timedOut, spent, variant: VARIANTS[q.filter].name });
    updateScore();

    const v = VARIANTS[q.filter];
    const state = correct ? "good" : timedOut ? "time" : "bad";
    overlay.querySelector(".modal").className = "modal " + state;
    $("ov-verdict").textContent = { good: "✓ Correct", time: "⏱ Time's up", bad: "✕ Incorrect" }[state];
    $("ov-why").textContent = {
      good: "You found the right answer despite the filter. Many people with this condition need extra cues besides color.",
      time: "You ran out of time. Telling similar colors apart can take much longer with color blindness.",
      bad: "The colors were too similar to distinguish easily, showing how relying on color alone can make websites difficult to use."
    }[state];
    $("ov-name").textContent = v.name;
    $("ov-sub").textContent = v.sub;
    $("ov-fact").textContent = v.fact;
    $("ov-meaning").textContent = v.meaning;
    $("ov-list").innerHTML = v.hard.map(t => `<li>${t}</li>`).join("");
    $("btn-next").textContent = index === QUESTIONS.length - 1 ? "See results →" : "Continue →";
    overlay.hidden = false;
    $("btn-next").focus();
  }

  function next() {
    overlay.hidden = true;
    if (++index < QUESTIONS.length) return loadQuestion();
    const total = Math.round(results.reduce((s, r) => s + r.spent, 0));
    $("final-accuracy").textContent = Math.round(correctCount / QUESTIONS.length * 100) + "%";
    $("final-time").textContent = `${String(total / 60 | 0).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
    show("end");
  }

  $("btn-start").onclick = start;
  $("btn-restart").onclick = start;
  $("btn-home").onclick = () => show("start");
  $("btn-check").onclick = () => finish(false);
  $("btn-next").onclick = next;
})();