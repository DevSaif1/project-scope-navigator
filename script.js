/* ==========================================================
   Project Scope & Logic Navigator — script.js
   ========================================================== */
(() => {
  'use strict';

  /* ---------------------------------------------------------
     1) البيانات الثابتة
  --------------------------------------------------------- */
  const STORAGE_KEY = 'psln.state.v1';
  const THEME_KEY = 'psln.theme.v1';

  const PHASES = [
    { id: 'analysis', name: 'التحليل', icon: 'fa-magnifying-glass-chart', color: 'var(--c-analysis)', hex: '#7b86ff' },
    { id: 'design', name: 'التصميم', icon: 'fa-pen-ruler', color: 'var(--c-design)', hex: '#c084fc' },
    { id: 'development', name: 'التطوير', icon: 'fa-code', color: 'var(--c-development)', hex: '#2dd4bf' },
    { id: 'testing', name: 'الاختبار', icon: 'fa-vial-circle-check', color: 'var(--c-testing)', hex: '#fbbf24' }
  ];
  const PHASE_IDS = PHASES.map(p => p.id);

  // مهام مشتركة لكل مشروع: [أول المرحلة، آخر المرحلة]
  const COMMON_TASKS = [
    ['تحديد المشكلة وأهداف المشروع ونطاقه', 'جمع المتطلبات من أصحاب المصلحة وتوثيقها'],
    ['رسم مخططات النظام (حالات الاستخدام وتدفق البيانات)', 'تصميم النماذج الأولية للواجهات ومراجعتها مع الفريق'],
    ['إعداد بيئة العمل ونظام إدارة النسخ', 'تنفيذ الوحدات الأساسية وربطها ببعضها'],
    ['اختبار الوحدات والتكامل وتسجيل الأخطاء', 'إعداد التقرير النهائي وتجهيز العرض التقديمي']
  ];

  // النسب الأساسية [تحليل، تصميم، تطوير، اختبار] ومهام خاصة بكل تخصص لكل مرحلة
  const FIELDS = {
    webdev: {
      label: 'تطوير نظم وتطبيقات الويب',
      split: [18, 22, 40, 20],
      tasks: [
        'تحليل احتياجات المستخدمين وتحديد الصفحات الرئيسية',
        'تصميم قاعدة البيانات وهيكلة واجهة المستخدم',
        'برمجة الواجهة الأمامية والخلفية وربطها بقاعدة البيانات',
        'اختبار التوافق مع المتصفحات والأجهزة المختلفة'
      ]
    },
    database_bi: {
      label: 'قواعد البيانات وذكاء الأعمال',
      split: [25, 20, 35, 20],
      tasks: [
        'تحديد مصادر البيانات ومؤشرات الأداء المطلوبة',
        'تصميم نموذج البيانات (ERD) ومستودع البيانات',
        'بناء عمليات استخراج البيانات وتحويلها وتحميلها ولوحات المعلومات',
        'التحقق من دقة البيانات وسرعة الاستعلامات'
      ]
    },
    systems_analysis: {
      label: 'تحليل وتصميم نظم المعلومات',
      split: [35, 30, 20, 15],
      tasks: [
        'دراسة النظام الحالي وتحديد جوانب القصور فيه',
        'إعداد مخططات UML ومخططات تدفق البيانات التفصيلية',
        'بناء نموذج أولي قابل للتشغيل لإثبات التصميم',
        'مراجعة المتطلبات مقابل النموذج وتقييم الجدوى'
      ]
    },
    erp: {
      label: 'أنظمة تخطيط موارد المؤسسة (ERP)',
      split: [30, 20, 30, 20],
      tasks: [
        'تحليل العمليات الإدارية في الأقسام المعنية',
        'ربط العمليات بوحدات النظام وتصميم التقارير',
        'ضبط الوحدات وإدخال البيانات التجريبية',
        'اختبار سيناريوهات العمل بين الأقسام'
      ]
    },
    ecommerce: {
      label: 'التجارة الإلكترونية',
      split: [20, 25, 35, 20],
      tasks: [
        'دراسة السوق والمنافسين وتحديد الشريحة المستهدفة',
        'تصميم رحلة الشراء وطرق الدفع',
        'تطوير المتجر وسلة الشراء وإدارة الطلبات',
        'اختبار عملية الشراء والدفع من البداية إلى النهاية'
      ]
    },
    infosec: {
      label: 'أمن المعلومات',
      split: [25, 20, 25, 30],
      tasks: [
        'حصر الأصول المعلوماتية وتقييم المخاطر',
        'تصميم ضوابط الحماية وسياسات الوصول',
        'تطبيق ضوابط الحماية وإعداد المراقبة والتنبيهات',
        'فحص الثغرات ومعالجتها ومراجعة النتائج'
      ]
    },
    general: {
      label: 'مشروع عام في نظم المعلومات الإدارية',
      split: [25, 25, 30, 20],
      tasks: [
        'تحديد الفكرة وجدواها وتوزيع المسؤوليات',
        'وضع تصور الحل وخطة التنفيذ التفصيلية',
        'تنفيذ الحل وفق الخطة ومتابعة التقدم',
        'مراجعة النتائج مقابل الأهداف المحددة'
      ]
    }
  };

  const ROLES = [
    'قائد المشروع ومنسّق الجدول',
    'محلل الأعمال ومتطلبات النظام',
    'مصمم الواجهات وتجربة المستخدم',
    'مطور الواجهة الأمامية',
    'مطور الواجهة الخلفية وقاعدة البيانات',
    'مسؤول الاختبار وضمان الجودة',
    'كاتب التوثيق والتقرير',
    'مسؤول العرض التقديمي',
    'مراجع الجودة والتسليم',
    'محلل البيانات',
    'مسؤول الأمن والصلاحيات',
    'مسؤول النشر والتكامل'
  ];

  /* ---------------------------------------------------------
     2) أدوات مساعدة
  --------------------------------------------------------- */
  const $ = id => document.getElementById(id);

  const esc = value => String(value).replace(/[&<>"']/g, ch => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
  ));

  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  function clampInt(value, min, max, fallback) {
    const n = parseInt(value, 10);
    if (Number.isNaN(n)) return fallback;
    return Math.min(max, Math.max(min, n));
  }

  function teamLabel(n) {
    if (n === 1) return 'فرد واحد';
    if (n === 2) return 'فردان';
    if (n <= 10) return n + ' أفراد';
    return n + ' فرداً';
  }

  function weeksLabel(n) {
    if (n === 1) return 'أسبوع واحد';
    if (n === 2) return 'أسبوعان';
    if (n <= 10) return n + ' أسابيع';
    return n + ' أسبوعاً';
  }

  function weekRange(start, end) {
    return start === end ? 'الأسبوع ' + start : 'الأسابيع ' + start + ' إلى ' + end;
  }

  const prefersReducedMotion = () =>
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     3) الحالة والحفظ التلقائي (LocalStorage)
  --------------------------------------------------------- */
  const defaultState = () => ({
    draft: { name: '', field: 'webdev', team: 4, weeks: 12 },
    planInput: null,
    tasks: []
  });

  function sanitizeInput(o, fallbackName) {
    const src = o && typeof o === 'object' ? o : {};
    return {
      name: typeof src.name === 'string' ? src.name.slice(0, 80) : fallbackName,
      field: FIELDS[src.field] ? src.field : 'general',
      team: clampInt(src.team, 1, 12, 4),
      weeks: clampInt(src.weeks, 4, 52, 12)
    };
  }

  function sanitizeState(parsed) {
    const base = defaultState();
    if (!parsed || typeof parsed !== 'object') return base;

    const draft = sanitizeInput(parsed.draft, '');
    if (!parsed.draft || !FIELDS[parsed.draft.field]) draft.field = base.draft.field;

    let planInput = null;
    if (parsed.planInput && typeof parsed.planInput.name === 'string' && parsed.planInput.name.trim()) {
      planInput = sanitizeInput(parsed.planInput, '');
    }

    const tasks = Array.isArray(parsed.tasks)
      ? parsed.tasks
          .filter(t => t && typeof t.text === 'string' && PHASE_IDS.includes(t.phase))
          .map(t => ({ id: String(t.id || uid()), text: t.text.slice(0, 160), phase: t.phase, done: !!t.done }))
      : [];

    return { draft, planInput, tasks };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? sanitizeState(JSON.parse(raw)) : defaultState();
    } catch (err) {
      return defaultState();
    }
  }

  let state = loadState();
  let statusTimer = null;

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      flashSaved('تم الحفظ تلقائياً');
    } catch (err) {
      flashSaved('تعذّر الحفظ: المتصفح يمنع التخزين المحلي');
    }
  }

  function flashSaved(text) {
    if (!els.saveStatus || !els.saveText) return;
    els.saveText.textContent = text;
    els.saveStatus.classList.add('flash');
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => {
      els.saveStatus.classList.remove('flash');
      els.saveText.textContent = 'يُحفظ عملك تلقائياً في هذا المتصفح';
    }, 1800);
  }

  /* ---------------------------------------------------------
     4) عناصر الصفحة
  --------------------------------------------------------- */
  const els = {
    form: $('projectForm'),
    name: $('projectName'),
    field: $('projectField'),
    team: $('teamSize'),
    weeks: $('weeks'),
    error: $('formError'),
    reset: $('resetBtn'),
    saveStatus: $('saveStatus'),
    saveText: $('saveStatusText'),
    plan: $('planSection'),
    print: $('printBtn'),
    download: $('downloadBtn'),
    printArea: $('printReport'),
    theme: $('themeToggle'),
    themeIcon: $('themeIcon'),
    importTasks: $('importTasksBtn'),
    clearDone: $('clearDoneBtn'),
    progressPct: $('progressPct'),
    progressCount: $('progressCount'),
    progressBar: $('progressBar'),
    progressFill: $('progressFill'),
    taskForm: $('taskForm'),
    taskText: $('taskText'),
    taskPhase: $('taskPhase'),
    groups: $('taskGroups'),
    toast: $('toast')
  };

  let toastTimer = null;
  function toast(message) {
    if (!els.toast) return;
    els.toast.textContent = message;
    els.toast.classList.add('show', 'visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => els.toast.classList.remove('show', 'visible'), 3200);
  }

  /* ---------------------------------------------------------
     5) منطق توليد الخطة
  --------------------------------------------------------- */
  function normalize(values, total = 100, min = 10) {
    const clamped = values.map(v => Math.max(v, min));
    const sum = clamped.reduce((a, b) => a + b, 0);
    const raw = clamped.map(v => (v / sum) * total);
    const floors = raw.map(Math.floor);
    const remainder = total - floors.reduce((a, b) => a + b, 0);
    const order = raw
      .map((v, i) => ({ i, frac: v - floors[i] }))
      .sort((a, b) => b.frac - a.frac);
    for (let k = 0; k < remainder; k++) floors[order[k].i] += 1;
    return floors;
  }

  function getRoles(team) {
    if (team === 1) return ['عضو واحد يتولى جميع الأدوار بالتناوب بين المراحل'];
    const roles = [];
    for (let i = 0; i < team; i++) roles.push(ROLES[i % ROLES.length]);
    return roles;
  }

  function buildPlan(input) {
    const field = FIELDS[input.field] || FIELDS.general;
    let split = field.split.slice();
    const notes = [];

    const shift = delta => { split = split.map((v, i) => v + delta[i]); };

    if (input.team <= 2) {
      shift([-1, -2, 3, 0]);
      notes.push('فريقك صغير، فقلّ وقت التنسيق وزادت حصة التطوير لأن كل عضو سيبرمج أكثر.');
    } else if (input.team >= 6) {
      shift([2, 2, -2, -2]);
      notes.push('فريقك كبير، فزادت حصة التحليل والتصميم لضمان اتفاق الجميع على نفس التصور قبل التنفيذ.');
    } else {
      notes.push('حجم فريقك متوسط، لذلك بقيت النسب الأساسية للتخصص كما هي دون تعديل.');
    }

    if (input.weeks <= 6) {
      shift([-3, -2, 3, 2]);
      notes.push('المدة قصيرة، فاختُصرت مرحلتا التحليل والتصميم وزاد وقت التنفيذ والاختبار.');
    } else if (input.weeks >= 16) {
      shift([2, 1, -1, -2]);
      notes.push('المدة طويلة، فأُعطي التحليل والتصميم وقتاً إضافياً لتقليل التعديلات المكلفة لاحقاً.');
    }

    const percents = normalize(split);

    // توزيع الأسابيع: كل مرحلة أسبوع واحد على الأقل
    const total = input.weeks;
    let prevEnd = 0;
    let acc = 0;
    const phases = PHASES.map((phase, i) => {
      acc += percents[i];
      let end = Math.round((acc / 100) * total);
      end = Math.max(end, prevEnd + 1);
      end = Math.min(end, total - (PHASES.length - 1 - i));
      if (i === PHASES.length - 1) end = total;
      const start = prevEnd + 1;
      prevEnd = end;
      return {
        ...phase,
        percent: percents[i],
        startWeek: start,
        endWeek: end,
        duration: end - start + 1,
        tasks: [COMMON_TASKS[i][0], field.tasks[i], COMMON_TASKS[i][1]]
      };
    });

    return { input, fieldLabel: field.label, phases, roles: getRoles(input.team), notes };
  }

  /* ---------------------------------------------------------
     6) عرض الخطة
  --------------------------------------------------------- */
  const EMPTY_PLAN_HTML = `
    <div class="empty">
      <div class="empty-icon" aria-hidden="true"><i class="fa-solid fa-route"></i></div>
      <h2>خطتك تبدأ من هنا</h2>
      <p>أدخل اسم المشروع وتخصصك وعدد أفراد الفريق والمدة، ثم اضغط «توليد خطة العمل» لتحصل على مراحل المشروع الأربع ونسبة الجهد لكل مرحلة.</p>
    </div>`;

  function renderPlan(animate) {
    if (!state.planInput) {
      els.plan.classList.remove('reveal');
      els.plan.innerHTML = EMPTY_PLAN_HTML;
      return;
    }

    const plan = buildPlan(state.planInput);
    const { input } = plan;

    const segments = plan.phases.map((p, i) => `
      <div class="seg" style="--seg:${p.color}; --i:${i}; flex:${p.percent} 1 0" title="${p.name}: ${p.percent}%">
        <strong class="num">${p.percent}%</strong>
        <span>${p.name}</span>
      </div>`).join('');

    const cards = plan.phases.map(p => `
      <article class="phase-card" style="--phase:${p.color}">
        <header>
          <span class="phase-icon" aria-hidden="true"><i class="fa-solid ${p.icon}"></i></span>
          <div class="phase-title">
            <h3>${p.name}</h3>
            <p class="muted">${weekRange(p.startWeek, p.endWeek)}<br>${weeksLabel(p.duration)}</p>
          </div>
          <strong class="phase-percent num">${p.percent}%</strong>
        </header>
        <ul class="phase-tasks">${p.tasks.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
        <div class="meter" aria-hidden="true"><span data-fill="${p.id}"></span></div>
        <p class="meter-label" data-count="${p.id}"></p>
      </article>`).join('');

    const roles = plan.roles.map(r => `<li><i class="fa-solid fa-user-check" aria-hidden="true"></i>${esc(r)}</li>`).join('');
    const notes = plan.notes.map(n => `<li><i class="fa-solid fa-circle-info" aria-hidden="true"></i><span>${esc(n)}</span></li>`).join('');

    els.plan.classList.toggle('reveal', !!animate);
    els.plan.innerHTML = `
      <div class="panel plan-head">
        <div class="plan-head-top">
          <div>
            <h2>${esc(input.name)}</h2>
            <p class="muted">${esc(plan.fieldLabel)}</p>
          </div>
          <ul class="chips">
            <li><i class="fa-solid fa-users" aria-hidden="true"></i>${teamLabel(input.team)}</li>
            <li><i class="fa-regular fa-calendar" aria-hidden="true"></i>${weeksLabel(input.weeks)}</li>
          </ul>
        </div>
        <div class="timeline" role="img" aria-label="توزيع الجهد: ${plan.phases.map(p => p.name + ' ' + p.percent + '%').join('، ')}">${segments}</div>
        <div class="timeline-axis"><span>الأسبوع 1</span><span>الأسبوع ${input.weeks}</span></div>
      </div>
      <div class="phase-grid">${cards}</div>
      <div class="panel">
        <h3 class="sub-title"><i class="fa-solid fa-people-group" aria-hidden="true"></i>توزيع الأدوار المقترح</h3>
        <ul class="role-list">${roles}</ul>
      </div>
      <div class="panel">
        <h3 class="sub-title"><i class="fa-solid fa-diagram-project" aria-hidden="true"></i>كيف وُزّعت النسب؟</h3>
        <ul class="note-list">${notes}</ul>
      </div>`;

    updateProgress();
  }

  /* ---------------------------------------------------------
     7) قائمة المهام وشريط التقدم
  --------------------------------------------------------- */
  function taskItemHTML(t) {
    return `
      <li class="task${t.done ? ' is-done' : ''}" data-id="${esc(t.id)}">
        <label class="check">
          <input type="checkbox" ${t.done ? 'checked' : ''}>
          <span class="box" aria-hidden="true"><i class="fa-solid fa-check"></i></span>
          <span class="task-text">${esc(t.text)}</span>
        </label>
        <button type="button" class="icon-btn small" data-action="delete" aria-label="حذف المهمة: ${esc(t.text)}">
          <i class="fa-regular fa-trash-can" aria-hidden="true"></i>
        </button>
      </li>`;
  }

  function renderTasks() {
    if (!state.tasks.length) {
      els.groups.innerHTML = `
        <div class="tasks-empty">
          <i class="fa-regular fa-clipboard" aria-hidden="true"></i>
          <p>لا توجد مهام بعد. أضف مهمتك الأولى بالأعلى، أو ولّد خطة لتُضاف مهام المراحل تلقائياً.</p>
        </div>`;
      updateProgress();
      return;
    }

    els.groups.innerHTML = PHASES.map(p => {
      const list = state.tasks.filter(t => t.phase === p.id);
      if (!list.length) return '';
      return `
        <section class="task-group" style="--phase:${p.color}">
          <h3><span class="dot" aria-hidden="true"></span>${p.name}<small class="num" data-group-count="${p.id}"></small></h3>
          <ul>${list.map(taskItemHTML).join('')}</ul>
        </section>`;
    }).join('');

    updateProgress();
  }

  function updateProgress() {
    const total = state.tasks.length;
    const done = state.tasks.filter(t => t.done).length;
    const pct = total ? Math.round((done / total) * 100) : 0;

    if (els.progressFill) els.progressFill.style.width = pct + '%';
    if (els.progressBar) els.progressBar.setAttribute('aria-valuenow', String(pct));
    if (els.progressPct) els.progressPct.textContent = pct + '%';
    if (els.progressCount) {
      els.progressCount.textContent = total
        ? done + ' من ' + total + ' مهمة مكتملة'
        : 'لا توجد مهام بعد';
    }

    PHASES.forEach(p => {
      const list = state.tasks.filter(t => t.phase === p.id);
      const d = list.filter(t => t.done).length;
      const phasePct = list.length ? (d / list.length) * 100 : 0;

      const fill = document.querySelector('[data-fill="' + p.id + '"]');
      if (fill) fill.style.width = phasePct + '%';

      const label = document.querySelector('[data-count="' + p.id + '"]');
      if (label) label.textContent = list.length ? d + ' من ' + list.length + ' مهام منجزة' : 'لا توجد مهام في هذه المرحلة';

      const groupCount = document.querySelector('[data-group-count="' + p.id + '"]');
      if (groupCount) groupCount.textContent = d + '/' + list.length;
    });

    return pct;
  }

  function importPlanTasks() {
    if (!state.planInput) return 0;
    const plan = buildPlan(state.planInput);
    const existing = new Set(state.tasks.map(t => t.phase + '|' + t.text));
    let added = 0;
    plan.phases.forEach(p => {
      p.tasks.forEach(text => {
        if (existing.has(p.id + '|' + text)) return;
        state.tasks.push({ id: uid(), text, phase: p.id, done: false });
        added += 1;
      });
    });
    return added;
  }

  /* ---------------------------------------------------------
     8) النموذج
  --------------------------------------------------------- */
  function populateSelects() {
    if (els.field) {
      els.field.innerHTML = Object.keys(FIELDS)
        .map(key => `<option value="${key}">${esc(FIELDS[key].label)}</option>`).join('');
    }
    if (els.taskPhase) {
      els.taskPhase.innerHTML = PHASES
        .map(p => `<option value="${p.id}">${p.name}</option>`).join('');
    }
  }

  function fillForm() {
    if (els.name) els.name.value = state.draft.name;
    if (els.field) els.field.value = state.draft.field;
    if (els.team) els.team.value = state.draft.team;
    if (els.weeks) els.weeks.value = state.draft.weeks;
  }

  function syncDraftFromForm() {
    state.draft = {
      name: els.name ? els.name.value.slice(0, 80) : '',
      field: els.field && FIELDS[els.field.value] ? els.field.value : 'general',
      team: clampInt(els.team ? els.team.value : 4, 1, 12, state.draft.team),
      weeks: clampInt(els.weeks ? els.weeks.value : 12, 4, 52, state.draft.weeks)
    };
  }

  function showError(message, input) {
    if (!els.error) return;
    els.error.textContent = message;
    els.error.hidden = false;
    if (input) {
      input.setAttribute('aria-invalid', 'true');
      input.focus();
    }
  }

  function hideError() {
    if (!els.error) return;
    els.error.hidden = true;
    if (els.name) els.name.removeAttribute('aria-invalid');
  }

  if (els.form) {
    els.form.addEventListener('input', () => {
      syncDraftFromForm();
      if (els.name && els.name.value.trim()) hideError();
      saveState();
    });

    els.form.addEventListener('submit', event => {
      event.preventDefault();
      syncDraftFromForm();
      if (els.team) els.team.value = state.draft.team;
      if (els.weeks) els.weeks.value = state.draft.weeks;

      if (!state.draft.name.trim()) {
        showError('يرجى كتابة اسم المشروع أولاً لحساب الخطة.', els.name);
        return;
      }
      hideError();

      state.planInput = { ...state.draft, name: state.draft.name.trim() };

      let seeded = 0;
      if (state.tasks.length === 0) seeded = importPlanTasks();

      renderPlan(true);
      renderTasks();
      saveState();

      toast(seeded
        ? 'تم توليد الخطة وإضافة ' + seeded + ' مهمة إلى القائمة'
        : 'تم توليد خطة العمل بنجاح!');

      if (els.plan) {
        els.plan.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
      }
    });
  }

  ['team', 'weeks'].forEach(key => {
    if (els[key]) {
      els[key].addEventListener('change', () => {
        syncDraftFromForm();
        if (els.team) els.team.value = state.draft.team;
        if (els.weeks) els.weeks.value = state.draft.weeks;
        saveState();
      });
    }
  });

  document.querySelectorAll('.step-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = $(btn.dataset.step);
      if (!input) return;
      const min = parseInt(input.min, 10);
      const max = parseInt(input.max, 10);
      const current = clampInt(input.value, min, max, min);
      input.value = Math.min(max, Math.max(min, current + parseInt(btn.dataset.delta, 10)));
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
  });

  if (els.reset) {
    els.reset.addEventListener('click', () => {
      if (!window.confirm('سيتم حذف بيانات المشروع والخطة وكل المهام. هل تريد المتابعة؟')) return;
      state = defaultState();
      try { localStorage.removeItem(STORAGE_KEY); } catch (err) { /* تجاهل */ }
      hideError();
      fillForm();
      renderPlan(false);
      renderTasks();
      toast('تمت إعادة ضبط التطبيق.');
    });
  }

  /* ---------------------------------------------------------
     9) أحداث المهام وخيار إضافة مهام الخطة
  --------------------------------------------------------- */
  if (els.taskForm) {
    els.taskForm.addEventListener('submit', event => {
      event.preventDefault();
      const text = els.taskText ? els.taskText.value.trim() : '';
      if (!text) {
        if (els.taskText) els.taskText.focus();
        toast('اكتب نص المهمة أولاً');
        return;
      }
      const phase = (els.taskPhase && PHASE_IDS.includes(els.taskPhase.value)) ? els.taskPhase.value : PHASE_IDS[0];
      state.tasks.push({ id: uid(), text: text.slice(0, 160), phase, done: false });
      if (els.taskText) els.taskText.value = '';
      renderTasks();
      saveState();
      if (els.taskText) els.taskText.focus();
    });
  }

  if (els.groups) {
    els.groups.addEventListener('change', event => {
      const checkbox = event.target.closest('input[type="checkbox"]');
      if (!checkbox) return;
      const item = checkbox.closest('.task');
      if (!item) return;
      const task = state.tasks.find(t => t.id === item.dataset.id);
      if (!task) return;

      task.done = checkbox.checked;
      item.classList.toggle('is-done', task.done);
      const pct = updateProgress();
      saveState();
      if (task.done && pct === 100) toast('أنجزت جميع المهام. عمل ممتاز!');
    });

    els.groups.addEventListener('click', event => {
      const btn = event.target.closest('[data-action="delete"]');
      if (!btn) return;
      const item = btn.closest('.task');
      if (!item) return;
      const id = item.dataset.id;
      state.tasks = state.tasks.filter(t => t.id !== id);
      renderTasks();
      saveState();
      toast('تم حذف المهمة.');
    });
  }

  // زر إضافة مهام الخطة المحدث بالتنبيه المطلوبة
  if (els.importTasks) {
    els.importTasks.addEventListener('click', () => {
      if (!state.planInput) {
        toast('يرجى توليد خطة العمل أولاً لتتمكن من إضافة المهام تلقائياً');
        return;
      }
      const added = importPlanTasks();
      if (!added) {
        toast('جميع مهام الخطة موجودة في القائمة بالفعل');
        return;
      }
      renderTasks();
      saveState();
      toast('تمت إضافة ' + added + ' مهام مقسمة على مراحل الخطة بنجاح!');
    });
  }

  if (els.clearDone) {
    els.clearDone.addEventListener('click', () => {
      const doneCount = state.tasks.filter(t => t.done).length;
      if (!doneCount) {
        toast('لا توجد مهام منجزة لحذفها');
        return;
      }
      if (!window.confirm('سيتم حذف ' + doneCount + ' مهمة منجزة. هل تريد المتابعة؟')) return;
      state.tasks = state.tasks.filter(t => !t.done);
      renderTasks();
      saveState();
      toast('تم حذف المهام المنجزة.');
    });
  }

  /* ---------------------------------------------------------
     10) التقرير: الطباعة والتنزيل
  --------------------------------------------------------- */
  const REPORT_CSS = `
    .rpt { font-family: 'Tajawal', 'Cairo', Tahoma, Arial, sans-serif; color: #141933; line-height: 1.8; max-width: 800px; margin: 0 auto; padding: 8px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .rpt h1 { font-size: 26px; margin: 0 0 4px; }
    .rpt h2 { font-size: 18px; margin: 28px 0 10px; padding-bottom: 6px; border-bottom: 2px solid #e3e7f5; }
    .rpt h3 { font-size: 15px; margin: 16px 0 6px; }
    .rpt p { margin: 0; }
    .rpt .rpt-muted { color: #586088; font-size: 13px; }
    .rpt .rpt-meta { display: flex; flex-wrap: wrap; gap: 8px 24px; margin-top: 12px; font-size: 14px; }
    .rpt .rpt-line { display: flex; height: 38px; gap: 4px; margin: 14px 0 6px; }
    .rpt .rpt-line span { display: flex; align-items: center; justify-content: center; border-radius: 8px; font-weight: 700; font-size: 14px; color: #0a0e1c; }
    .rpt table { width: 100%; border-collapse: collapse; font-size: 14px; }
    .rpt th, .rpt td { text-align: right; padding: 8px 10px; border-bottom: 1px solid #e3e7f5; }
    .rpt th { background: #f1f3fb; font-weight: 700; }
    .rpt ul { margin: 0; padding: 0; list-style: none; }
    .rpt li { padding: 3px 0; font-size: 14px; }
    .rpt .mark { display: inline-block; width: 20px; }
    .rpt li.done { color: #586088; text-decoration: line-through; }
    .rpt .rpt-bar { height: 12px; background: #e3e7f5; border-radius: 99px; overflow: hidden; margin-top: 8px; }
    .rpt .rpt-bar span { display: block; height: 100%; background: #5b6bff; }
    .rpt .rpt-foot { margin-top: 32px; font-size: 12px; color: #586088; text-align: center; }
    .rpt table, .rpt li, .rpt h3 { break-inside: avoid; }
  `;

  function todayLabel() {
    try {
      return new Date().toLocaleDateString('ar-u-nu-latn', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (err) {
      return new Date().toLocaleDateString();
    }
  }

  function reportMarkup() {
    const plan = buildPlan(state.planInput);
    const { input } = plan;
    const total = state.tasks.length;
    const done = state.tasks.filter(t => t.done).length;
    const pct = total ? Math.round((done / total) * 100) : 0;

    const line = plan.phases
      .map(p => `<span style="background:${p.hex}; flex:${p.percent} 1 0">${p.percent}%</span>`).join('');

    const rows = plan.phases.map(p => `
      <tr>
        <td>${p.name}</td>
        <td>${p.percent}%</td>
        <td>${weekRange(p.startWeek, p.endWeek)}</td>
        <td>${weeksLabel(p.duration)}</td>
      </tr>`).join('');

    const roles = plan.roles.map(r => `<li>&bull; ${esc(r)}</li>`).join('');

    const taskSections = plan.phases.map(p => {
      const list = state.tasks.filter(t => t.phase === p.id);
      const body = list.length
        ? `<ul>${list.map(t => `<li class="${t.done ? 'done' : ''}"><span class="mark">${t.done ? '&#9745;' : '&#9744;'}</span>${esc(t.text)}</li>`).join('')}</ul>`
        : '<p class="rpt-muted">لا توجد مهام في هذه المرحلة.</p>';
      return `<h3>${p.name}</h3>${body}`;
    }).join('');

    return `
      <style>${REPORT_CSS}</style>
      <article class="rpt">
        <h1>${esc(input.name)}</h1>
        <p class="rpt-muted">تقرير خطة المشروع &mdash; ${todayLabel()}</p>
        <div class="rpt-meta">
          <span><strong>التخصص:</strong> ${esc(plan.fieldLabel)}</span>
          <span><strong>الفريق:</strong> ${teamLabel(input.team)}</span>
          <span><strong>المدة:</strong> ${weeksLabel(input.weeks)}</span>
        </div>

        <h2>توزيع مراحل المشروع</h2>
        <div class="rpt-line">${line}</div>
        <table>
          <thead><tr><th>المرحلة</th><th>النسبة</th><th>الفترة</th><th>المدة</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>

        <h2>الأدوار المقترحة</h2>
        <ul>${roles}</ul>

        <h2>المهام ونسبة الإنجاز</h2>
        <p><strong>${pct}%</strong> &mdash; ${total ? done + ' من ' + total + ' مهمة مكتملة' : 'لا توجد مهام مسجلة'}</p>
        <div class="rpt-bar"><span style="width:${pct}%"></span></div>
        ${taskSections}

        <p class="rpt-foot">أُنشئ بواسطة Project Scope &amp; Logic Navigator</p>
      </article>`;
  }

  function fillPrintArea() {
    if (!els.printArea) return;
    els.printArea.innerHTML = state.planInput
      ? reportMarkup()
      : '<p style="padding:24px;text-align:center">لم يتم توليد خطة بعد. ولّد خطة العمل ثم أعد الطباعة.</p>';
  }

  if (els.print) {
    els.print.addEventListener('click', () => {
      if (!state.planInput) {
        toast('يرجى توليد خطة العمل أولاً ثم طباعة التقرير');
        return;
      }
      fillPrintArea();
      window.print();
    });
  }

  window.addEventListener('beforeprint', fillPrintArea);

  if (els.download) {
    els.download.addEventListener('click', () => {
      if (!state.planInput) {
        toast('يرجى توليد خطة العمل أولاً ثم تنزيل التقرير');
        return;
      }
      const title = state.planInput.name;
      const html = '<!DOCTYPE html>\n<html lang="ar" dir="rtl">\n<head>\n<meta charset="UTF-8">\n' +
        '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
        '<title>تقرير: ' + esc(title) + '</title>\n' +
        '<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet">\n' +
        '</head>\n<body style="margin:0;padding:24px;background:#fff">\n' + reportMarkup() + '\n</body>\n</html>';

      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const slug = title.replace(/[\\/:*?"<>|\s]+/g, '-').replace(/^-+|-+$/g, '') || 'project';
      link.href = url;
      link.download = 'تقرير-' + slug + '.html';
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast('تم تنزيل التقرير. افتحه ثم احفظه PDF من قائمة الطباعة إن أردت');
    });
  }

  /* ---------------------------------------------------------
     11) الوضع الداكن والفاتح
  --------------------------------------------------------- */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (els.themeIcon) {
      els.themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
    if (els.theme) {
      els.theme.setAttribute('aria-label', theme === 'dark' ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن');
    }
  }

  function loadTheme() {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      return saved === 'light' ? 'light' : 'dark';
    } catch (err) {
      return 'dark';
    }
  }

  if (els.theme) {
    els.theme.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (err) { /* تجاهل */ }
    });
  }

  /* ---------------------------------------------------------
     12) التشغيل
  --------------------------------------------------------- */
  function init() {
    applyTheme(loadTheme());
    populateSelects();
    fillForm();
    renderPlan(false);
    renderTasks();
  }

  init();
})();