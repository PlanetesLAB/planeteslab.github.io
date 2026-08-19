'use strict';

var obsidian = require('obsidian');

var VIEW_TYPE_DASHBOARD = 'vault-publish-dashboard-view';

function normalizeStatus(str) {
  if (str === null || str === undefined) return '';
  return String(str).toLowerCase().replace(/['"\-_ ]/g, '').trim();
}

var DEFAULT_STAGES = [
  { id: 'transient', label: 'TRANSIENT', progress: 0, isPublished: false, isTransient: true, aliases: ['transient', 'rough', 'scratch', 'temp', 'temporary'] },
  { id: 'draft', label: 'DRAFT', progress: 0, isPublished: false, isTransient: false, aliases: ['draft', 'backlog', 'unstarted', 'todo'] },
  { id: 'writing', label: 'WRITING', progress: 33, isPublished: false, isTransient: false, aliases: ['writing', 'inprogress', 'in-progress', 'in_progress', 'wip', 'doing'] },
  { id: 'review', label: 'REVIEW', progress: 66, isPublished: false, isTransient: false, aliases: ['review', 'inreview', 'in-review', 'in_review', 'revising', 'polish'] },
  { id: 'published', label: 'PUBLISHED', progress: 100, isPublished: true, isTransient: false, aliases: ['published', 'done', 'complete', 'completed'] }
];

var DEFAULT_SETTINGS = {
  stages: DEFAULT_STAGES,
  defaultStage: 'draft',
  statusProperty: 'status',
  publishProperty: 'publish',
  excludedFolders: '.obsidian, templates, private, archive, images',
  defaultView: 'board',
  showStatusBar: true
};

function getRelativeTimeString(timestamp) {
  var diff = Date.now() - timestamp;
  var seconds = Math.floor(diff / 1000);
  if (seconds < 60) return 'just now';
  var minutes = Math.floor(seconds / 60);
  if (minutes < 60) return minutes + 'm ago';
  var hours = Math.floor(minutes / 60);
  if (hours < 24) return hours + 'h ago';
  var days = Math.floor(days / 24);
  if (days < 30) return days + 'd ago';
  var months = Math.floor(days / 30);
  return months + 'mo ago';
}

class PublishDashboardView extends obsidian.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.searchQuery = '';
    this.selectedFolder = 'all';
    this.selectedStage = 'all';
    this.sortBy = 'mtime_desc';
    this.currentView = this.plugin.settings.defaultView || 'board';
    this.notesData = [];
  }

  getViewType() {
    return VIEW_TYPE_DASHBOARD;
  }

  getDisplayText() {
    return 'Publish Dashboard';
  }

  getIcon() {
    return 'layout-dashboard';
  }

  async onOpen() {
    this.render();
  }

  async onClose() {
    // cleanup
  }

  refreshData() {
    this.notesData = this.plugin.collectNotesData();
  }

  render() {
    this.refreshData();
    var container = this.containerEl.children[1];
    container.empty();
    container.addClass('vpd-container');

    // 1. Header & Metric Progress Strip
    this.renderHeader(container);

    // 2. Controls Toolbar (Search, Filter, Sort, View Toggle)
    this.renderToolbar(container);

    // 3. Main Content (Board or Table)
    var contentEl = container.createDiv({ cls: 'vpd-content' });
    if (this.currentView === 'board') {
      this.renderBoardView(contentEl);
    } else {
      this.renderTableView(contentEl);
    }
  }

  renderHeader(container) {
    var headerEl = container.createDiv({ cls: 'vpd-header' });

    var topRow = headerEl.createDiv({ cls: 'vpd-header-top' });
    var titleGroup = topRow.createDiv({ cls: 'vpd-title-group' });
    titleGroup.createEl('h2', { text: 'PUBLISH DASHBOARD', cls: 'vpd-title' });

    var totalNotes = this.notesData.length;
    var publishableNotes = this.notesData.filter(n => !n.stage.isTransient).length;
    var publishedNotes = this.notesData.filter(n => n.stage.isPublished).length;
    var progressPercent = publishableNotes > 0 ? ((publishedNotes / publishableNotes) * 100).toFixed(1) : '0.0';

    var actionsGroup = topRow.createDiv({ cls: 'vpd-header-actions' });

    var jumpBtn = actionsGroup.createEl('button', {
      text: 'NEXT UNFINISHED NOTE',
      cls: 'vpd-btn vpd-btn-primary'
    });
    jumpBtn.addEventListener('click', () => {
      this.plugin.openNextUnfinishedNote();
    });

    var randomBtn = actionsGroup.createEl('button', {
      text: 'RANDOM NOTE',
      cls: 'vpd-btn'
    });
    randomBtn.addEventListener('click', () => {
      this.plugin.openRandomNote();
    });

    var refreshBtn = actionsGroup.createEl('button', {
      text: 'REFRESH',
      cls: 'vpd-btn'
    });
    refreshBtn.addEventListener('click', () => {
      this.render();
    });

    // Metric summary line
    var statsStrip = headerEl.createDiv({ cls: 'vpd-stats-strip' });

    var statOverall = statsStrip.createDiv({ cls: 'vpd-stat-box vpd-stat-main' });
    statOverall.createDiv({ cls: 'vpd-stat-label', text: 'CURRENT STATUS' });
    statOverall.createDiv({ cls: 'vpd-stat-value', text: progressPercent + '%' });
    statOverall.createDiv({ cls: 'vpd-stat-sub', text: publishedNotes + ' OF ' + publishableNotes + ' PUBLISHED' });

    this.plugin.settings.stages.forEach(stage => {
      var count = this.notesData.filter(n => n.stage.id === stage.id).length;
      var pct = totalNotes > 0 ? ((count / totalNotes) * 100).toFixed(0) : '0';
      var box = statsStrip.createDiv({ cls: 'vpd-stat-box ' + (stage.isTransient ? 'vpd-stat-transient' : '') });
      box.createDiv({ cls: 'vpd-stat-label', text: stage.label });
      box.createDiv({ cls: 'vpd-stat-value', text: String(count) });
      box.createDiv({ cls: 'vpd-stat-sub', text: pct + '% OF VAULT' });
    });

    // Segmented Progress Bar
    var progressBarEl = headerEl.createDiv({ cls: 'vpd-progress-bar' });
    this.plugin.settings.stages.forEach((stage) => {
      var count = this.notesData.filter(n => n.stage.id === stage.id).length;
      var pct = totalNotes > 0 ? (count / totalNotes) * 100 : 0;
      if (pct > 0) {
        var seg = progressBarEl.createDiv({
          cls: 'vpd-progress-segment vpd-stage-bg-' + stage.id
        });
        seg.style.width = pct + '%';
        seg.title = stage.label + ': ' + count + ' notes (' + pct.toFixed(1) + '%)';
      }
    });
  }

  renderToolbar(container) {
    var toolbar = container.createDiv({ cls: 'vpd-toolbar' });

    // Search Input
    var searchContainer = toolbar.createDiv({ cls: 'vpd-search-container' });
    var searchInput = searchContainer.createEl('input', {
      type: 'text',
      cls: 'vpd-search-input',
      value: this.searchQuery
    });
    searchInput.placeholder = 'Search by note title or path...';
    searchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.toLowerCase();
      this.renderMainContent();
    });

    // Folder Filter
    var folderSelect = toolbar.createEl('select', { cls: 'vpd-select' });
    folderSelect.createEl('option', { value: 'all', text: 'ALL FOLDERS' });
    var folders = this.getUniqueFolders();
    folders.forEach(f => {
      folderSelect.createEl('option', { value: f, text: f.toUpperCase() });
    });
    folderSelect.value = this.selectedFolder;
    folderSelect.addEventListener('change', (e) => {
      this.selectedFolder = e.target.value;
      this.renderMainContent();
    });

    // Stage Filter
    var stageSelect = toolbar.createEl('select', { cls: 'vpd-select' });
    stageSelect.createEl('option', { value: 'all', text: 'ALL STAGES' });
    this.plugin.settings.stages.forEach(s => {
      stageSelect.createEl('option', { value: s.id, text: s.label });
    });
    stageSelect.value = this.selectedStage;
    stageSelect.addEventListener('change', (e) => {
      this.selectedStage = e.target.value;
      this.renderMainContent();
    });

    // Sort Order
    var sortSelect = toolbar.createEl('select', { cls: 'vpd-select' });
    sortSelect.createEl('option', { value: 'mtime_desc', text: 'SORT: RECENTLY MODIFIED' });
    sortSelect.createEl('option', { value: 'mtime_asc', text: 'SORT: OLDEST MODIFIED' });
    sortSelect.createEl('option', { value: 'title_asc', text: 'SORT: TITLE A-Z' });
    sortSelect.createEl('option', { value: 'title_desc', text: 'SORT: TITLE Z-A' });
    sortSelect.value = this.sortBy;
    sortSelect.addEventListener('change', (e) => {
      this.sortBy = e.target.value;
      this.renderMainContent();
    });

    // View Switcher (Board / Table)
    var viewToggleGroup = toolbar.createDiv({ cls: 'vpd-view-toggle' });

    var boardBtn = viewToggleGroup.createEl('button', {
      text: 'BOARD',
      cls: 'vpd-toggle-btn ' + (this.currentView === 'board' ? 'vpd-active' : '')
    });
    boardBtn.addEventListener('click', () => {
      this.currentView = 'board';
      boardBtn.addClass('vpd-active');
      tableBtn.removeClass('vpd-active');
      this.renderMainContent();
    });

    var tableBtn = viewToggleGroup.createEl('button', {
      text: 'TABLE',
      cls: 'vpd-toggle-btn ' + (this.currentView === 'table' ? 'vpd-active' : '')
    });
    tableBtn.addEventListener('click', () => {
      this.currentView = 'table';
      tableBtn.addClass('vpd-active');
      boardBtn.removeClass('vpd-active');
      this.renderMainContent();
    });
  }

  getUniqueFolders() {
    var set = new Set();
    this.notesData.forEach(n => {
      var parts = n.file.path.split('/');
      if (parts.length > 1) {
        set.add(parts.slice(0, -1).join('/'));
      } else {
        set.add('(root)');
      }
    });
    return Array.from(set).sort();
  }

  getFilteredNotes() {
    var notes = this.notesData.slice();

    // Query filter
    if (this.searchQuery) {
      notes = notes.filter(n => {
        return n.file.basename.toLowerCase().includes(this.searchQuery) ||
          n.file.path.toLowerCase().includes(this.searchQuery);
      });
    }

    // Folder filter
    if (this.selectedFolder !== 'all') {
      notes = notes.filter(n => {
        var folder = n.file.path.includes('/') ? n.file.path.substring(0, n.file.path.lastIndexOf('/')) : '(root)';
        return folder === this.selectedFolder;
      });
    }

    // Stage filter
    if (this.selectedStage !== 'all') {
      notes = notes.filter(n => n.stage.id === this.selectedStage);
    }

    // Sorting
    notes.sort((a, b) => {
      if (this.sortBy === 'mtime_desc') return b.file.stat.mtime - a.file.stat.mtime;
      if (this.sortBy === 'mtime_asc') return a.file.stat.mtime - b.file.stat.mtime;
      if (this.sortBy === 'title_asc') return a.file.basename.localeCompare(b.file.basename);
      if (this.sortBy === 'title_desc') return b.file.basename.localeCompare(a.file.basename);
      return 0;
    });

    return notes;
  }

  renderMainContent() {
    var contentEl = this.containerEl.querySelector('.vpd-content');
    if (!contentEl) return;
    contentEl.empty();

    if (this.currentView === 'board') {
      this.renderBoardView(contentEl);
    } else {
      this.renderTableView(contentEl);
    }
  }

  renderBoardView(contentEl) {
    var boardContainer = contentEl.createDiv({ cls: 'vpd-board-container' });
    var filteredNotes = this.getFilteredNotes();

    this.plugin.settings.stages.forEach(stage => {
      var stageNotes = filteredNotes.filter(n => n.stage.id === stage.id);

      var column = boardContainer.createDiv({ cls: 'vpd-column ' + (stage.isTransient ? 'vpd-column-transient' : '') });

      var colHeader = column.createDiv({ cls: 'vpd-col-header' });
      var colTitle = colHeader.createDiv({ cls: 'vpd-col-title' });
      colTitle.createSpan({ cls: 'vpd-col-name', text: stage.label });
      colTitle.createSpan({ cls: 'vpd-col-count', text: String(stageNotes.length) });

      var cardsContainer = column.createDiv({ cls: 'vpd-cards-container' });

      if (stageNotes.length === 0) {
        cardsContainer.createDiv({ cls: 'vpd-empty-col', text: 'NO NOTES' });
      } else {
        stageNotes.forEach(noteData => {
          this.renderNoteCard(cardsContainer, noteData);
        });
      }
    });
  }

  renderNoteCard(container, noteData) {
    var card = container.createDiv({ cls: 'vpd-card ' + (noteData.stage.isTransient ? 'vpd-card-transient' : '') });

    var cardHeader = card.createDiv({ cls: 'vpd-card-header' });
    var titleEl = cardHeader.createEl('div', { cls: 'vpd-card-title', text: noteData.file.basename });
    titleEl.addEventListener('click', () => {
      this.plugin.openFile(noteData.file);
    });

    var folderPath = noteData.file.path.includes('/') ? noteData.file.path.substring(0, noteData.file.path.lastIndexOf('/')) : '';
    if (folderPath) {
      card.createDiv({ cls: 'vpd-card-path', text: folderPath });
    }

    var cardFooter = card.createDiv({ cls: 'vpd-card-footer' });
    var timeEl = cardFooter.createSpan({ cls: 'vpd-card-time', text: getRelativeTimeString(noteData.file.stat.mtime) });

    var actionsGroup = cardFooter.createDiv({ cls: 'vpd-card-actions' });

    var stageIdx = this.plugin.getStageIndex(noteData.stage.id);

    if (stageIdx > 0) {
      var prevBtn = actionsGroup.createEl('button', { cls: 'vpd-btn-icon', text: '<' });
      prevBtn.title = 'Move to ' + this.plugin.settings.stages[stageIdx - 1].label;
      prevBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        await this.plugin.setNoteStage(noteData.file, this.plugin.settings.stages[stageIdx - 1].id);
        this.render();
      });
    }

    if (stageIdx < this.plugin.settings.stages.length - 1) {
      var nextBtn = actionsGroup.createEl('button', { cls: 'vpd-btn-icon vpd-btn-advance', text: '>' });
      nextBtn.title = 'Move to ' + this.plugin.settings.stages[stageIdx + 1].label;
      nextBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        await this.plugin.setNoteStage(noteData.file, this.plugin.settings.stages[stageIdx + 1].id);
        this.render();
      });
    }
  }

  renderTableView(contentEl) {
    var filteredNotes = this.getFilteredNotes();
    var tableWrapper = contentEl.createDiv({ cls: 'vpd-table-wrapper' });

    var table = tableWrapper.createEl('table', { cls: 'vpd-table' });
    var thead = table.createEl('thead');
    var headerRow = thead.createEl('tr');
    headerRow.createEl('th', { text: 'NOTE' });
    headerRow.createEl('th', { text: 'DIRECTORY' });
    headerRow.createEl('th', { text: 'STATUS' });
    headerRow.createEl('th', { text: 'MODIFIED' });
    headerRow.createEl('th', { text: 'QUICK ACTIONS' });

    var tbody = table.createEl('tbody');

    if (filteredNotes.length === 0) {
      var emptyRow = tbody.createEl('tr');
      var td = emptyRow.createEl('td', { cls: 'vpd-table-empty' });
      td.colSpan = 5;
      td.setText('No notes match the current filters.');
      return;
    }

    filteredNotes.forEach(noteData => {
      var row = tbody.createEl('tr', { cls: 'vpd-table-row ' + (noteData.stage.isTransient ? 'vpd-row-transient' : '') });

      // Title
      var tdTitle = row.createEl('td', { cls: 'vpd-td-title' });
      var link = tdTitle.createEl('a', { text: noteData.file.basename, cls: 'vpd-title-link' });
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.plugin.openFile(noteData.file);
      });

      // Folder
      var folderPath = noteData.file.path.includes('/') ? noteData.file.path.substring(0, noteData.file.path.lastIndexOf('/')) : '(root)';
      row.createEl('td', { cls: 'vpd-td-folder', text: folderPath });

      // Status selector
      var tdStatus = row.createEl('td', { cls: 'vpd-td-status' });
      var select = tdStatus.createEl('select', { cls: 'vpd-status-select vpd-status-pill-' + noteData.stage.id });
      this.plugin.settings.stages.forEach(s => {
        select.createEl('option', { value: s.id, text: s.label });
      });
      select.value = noteData.stage.id;
      select.addEventListener('change', async (e) => {
        await this.plugin.setNoteStage(noteData.file, e.target.value);
        this.render();
      });

      // Modified
      row.createEl('td', { cls: 'vpd-td-mtime', text: getRelativeTimeString(noteData.file.stat.mtime) });

      // Actions
      var tdActions = row.createEl('td', { cls: 'vpd-td-actions' });
      var stageIdx = this.plugin.getStageIndex(noteData.stage.id);

      if (stageIdx < this.plugin.settings.stages.length - 1) {
        var advBtn = tdActions.createEl('button', {
          cls: 'vpd-btn vpd-btn-small vpd-btn-advance',
          text: 'ADVANCE ->'
        });
        advBtn.addEventListener('click', async () => {
          await this.plugin.setNoteStage(noteData.file, this.plugin.settings.stages[stageIdx + 1].id);
          this.render();
        });
      } else {
        tdActions.createSpan({ cls: 'vpd-badge-published', text: 'PUBLISHED' });
      }
    });
  }
}

class PublishDashboardSettingTab extends obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    var containerEl = this.containerEl;
    containerEl.empty();

    containerEl.createEl('h2', { text: 'PUBLISH DASHBOARD SETTINGS' });

    new obsidian.Setting(containerEl)
      .setName('Status Property Name')
      .setDesc('Frontmatter YAML property key used to track the note stage (default: "status").')
      .addText(text => text
        .setValue(this.plugin.settings.statusProperty)
        .onChange(async (value) => {
          this.plugin.settings.statusProperty = value.trim() || 'status';
          await this.plugin.saveSettings();
        }));

    new obsidian.Setting(containerEl)
      .setName('Quartz Publish Property')
      .setDesc('Frontmatter YAML property key used by Quartz (default: "publish").')
      .addText(text => text
        .setValue(this.plugin.settings.publishProperty)
        .onChange(async (value) => {
          this.plugin.settings.publishProperty = value.trim() || 'publish';
          await this.plugin.saveSettings();
        }));

    new obsidian.Setting(containerEl)
      .setName('Excluded Folders')
      .setDesc('Comma-separated list of folder names to exclude from dashboard tracking.')
      .addText(text => text
        .setValue(this.plugin.settings.excludedFolders)
        .onChange(async (value) => {
          this.plugin.settings.excludedFolders = value;
          await this.plugin.saveSettings();
          this.plugin.updateStatusBar();
        }));

    new obsidian.Setting(containerEl)
      .setName('Show Status Bar Metric')
      .setDesc('Display live vault publishing completion percentage in the bottom status bar.')
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.showStatusBar)
        .onChange(async (value) => {
          this.plugin.settings.showStatusBar = value;
          await this.plugin.saveSettings();
          this.plugin.updateStatusBar();
        }));
  }
}

class StatusSuggestModal extends obsidian.FuzzySuggestModal {
  constructor(app, plugin, file) {
    super(app);
    this.plugin = plugin;
    this.file = file;
  }

  getItems() {
    return this.plugin.settings.stages;
  }

  getItemText(stage) {
    return stage.label + (stage.isTransient ? ' [TRANSIENT ROUGH NOTE]' : '');
  }

  async onChooseItem(stage, evt) {
    await this.plugin.setNoteStage(this.file, stage.id);
    new obsidian.Notice('Set status to ' + stage.label + ' for ' + this.file.basename);
  }
}

class VaultPublishDashboardPlugin extends obsidian.Plugin {
  async onload() {
    await this.loadSettings();

    this.registerView(
      VIEW_TYPE_DASHBOARD,
      (leaf) => new PublishDashboardView(leaf, this)
    );

    // Ribbon icon
    this.addRibbonIcon('layout-dashboard', 'Open Publish Dashboard', () => {
      this.activateView();
    });

    // Status bar item
    this.statusBarItem = this.addStatusBarItem();
    this.statusBarItem.addClass('vpd-status-bar-item');
    this.statusBarItem.addEventListener('click', () => {
      this.activateView();
    });

    // Register Commands
    this.addCommand({
      id: 'open-publish-dashboard',
      name: 'Open Publish Dashboard',
      callback: () => {
        this.activateView();
      }
    });

    this.addCommand({
      id: 'advance-active-note-status',
      name: 'Advance status of active note',
      checkCallback: (checking) => {
        var file = this.app.workspace.getActiveFile();
        if (file && file.extension === 'md') {
          if (!checking) {
            this.advanceActiveNoteStage(file);
          }
          return true;
        }
        return false;
      }
    });

    this.addCommand({
      id: 'revert-active-note-status',
      name: 'Revert status of active note',
      checkCallback: (checking) => {
        var file = this.app.workspace.getActiveFile();
        if (file && file.extension === 'md') {
          if (!checking) {
            this.revertActiveNoteStage(file);
          }
          return true;
        }
        return false;
      }
    });

    this.addCommand({
      id: 'set-active-note-transient',
      name: 'Mark active note as Transient / Scratch',
      checkCallback: (checking) => {
        var file = this.app.workspace.getActiveFile();
        if (file && file.extension === 'md') {
          if (!checking) {
            this.setNoteStage(file, 'transient');
            new obsidian.Notice('Marked ' + file.basename + ' as TRANSIENT');
          }
          return true;
        }
        return false;
      }
    });

    this.addCommand({
      id: 'set-active-note-status',
      name: 'Set status of active note...',
      checkCallback: (checking) => {
        var file = this.app.workspace.getActiveFile();
        if (file && file.extension === 'md') {
          if (!checking) {
            new StatusSuggestModal(this.app, this, file).open();
          }
          return true;
        }
        return false;
      }
    });

    this.addCommand({
      id: 'open-next-unfinished-note',
      name: 'Open next unfinished note',
      callback: () => {
        this.openNextUnfinishedNote();
      }
    });

    this.addSettingTab(new PublishDashboardSettingTab(this.app, this));

    // Register Vault & Metadata Events with Debounce
    var debouncedUpdate = obsidian.debounce(() => {
      this.updateStatusBar();
      this.refreshActiveDashboardViews();
    }, 500, true);

    this.registerEvent(this.app.vault.on('create', debouncedUpdate));
    this.registerEvent(this.app.vault.on('delete', debouncedUpdate));
    this.registerEvent(this.app.vault.on('rename', debouncedUpdate));
    this.registerEvent(this.app.metadataCache.on('changed', debouncedUpdate));
    this.registerEvent(this.app.metadataCache.on('resolve', debouncedUpdate));

    // Initial status bar calculation
    this.app.workspace.onLayoutReady(() => {
      this.updateStatusBar();
    });
  }

  async onunload() {
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_DASHBOARD);
  }

  async loadSettings() {
    var loaded = await this.loadData();
    this.settings = Object.assign({}, DEFAULT_SETTINGS, loaded);
    this.settings.stages = DEFAULT_STAGES;
  }

  async saveSettings() {
    await this.saveData(this.settings);
    this.refreshActiveDashboardViews();
  }

  getStageIndex(stageId) {
    return this.settings.stages.findIndex(s => s.id === stageId);
  }

  isExcluded(path) {
    var excluded = this.settings.excludedFolders.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    var parts = path.toLowerCase().split('/');
    return parts.some(part => excluded.includes(part));
  }

  collectNotesData() {
    var files = this.app.vault.getMarkdownFiles();
    var data = [];

    files.forEach(file => {
      if (this.isExcluded(file.path)) return;

      var cache = this.app.metadataCache.getFileCache(file);
      var fm = (cache && cache.frontmatter) ? cache.frontmatter : {};

      var currentStatus = fm[this.settings.statusProperty];
      var isPub = fm[this.settings.publishProperty];

      var matchedStage = null;

      // 1. If publish: true is set, it is PUBLISHED
      if (isPub === true || isPub === 'true') {
        matchedStage = this.settings.stages.find(s => s.isPublished);
      }

      // 2. Otherwise check explicit status field (supports aliases like writing/in_progress, case-insensitive, ignores hyphens/underscores)
      if (!matchedStage && currentStatus !== undefined && currentStatus !== null) {
        var norm = normalizeStatus(currentStatus);
        matchedStage = this.settings.stages.find(s => {
          if (normalizeStatus(s.id) === norm || normalizeStatus(s.label) === norm) return true;
          if (s.aliases && s.aliases.map(normalizeStatus).includes(norm)) return true;
          return false;
        });
      }

      // 3. Fallback to default stage (DRAFT)
      if (!matchedStage) {
        matchedStage = this.settings.stages.find(s => s.id === this.settings.defaultStage) || this.settings.stages[1] || this.settings.stages[0];
      }

      data.push({
        file: file,
        frontmatter: fm,
        stage: matchedStage
      });
    });

    return data;
  }

  updateStatusBar() {
    if (!this.statusBarItem) return;
    if (!this.settings.showStatusBar) {
      this.statusBarItem.setText('');
      this.statusBarItem.style.display = 'none';
      return;
    }
    this.statusBarItem.style.display = '';

    var data = this.collectNotesData();
    var publishable = data.filter(d => !d.stage.isTransient);
    var total = publishable.length;
    var published = publishable.filter(d => d.stage.isPublished).length;
    var pct = total > 0 ? ((published / total) * 100).toFixed(0) : '0';

    this.statusBarItem.setText('VAULT: ' + published + '/' + total + ' [' + pct + '%]');
    this.statusBarItem.setAttribute('aria-label', 'Publish Goal: ' + published + ' of ' + total + ' publishable notes (' + pct + '%)');
  }

  refreshActiveDashboardViews() {
    var leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_DASHBOARD);
    leaves.forEach(leaf => {
      if (leaf.view instanceof PublishDashboardView) {
        leaf.view.render();
      }
    });
  }

  async setNoteStage(file, stageId) {
    var targetStage = this.settings.stages.find(s => s.id === stageId);
    if (!targetStage) return;

    await this.app.fileManager.processFrontMatter(file, (fm) => {
      if (targetStage.isPublished) {
        // Published notes only need publish: true (removes redundant status)
        fm[this.settings.publishProperty] = true;
        delete fm[this.settings.statusProperty];
      } else {
        // For non-published notes, remove publish: true
        delete fm[this.settings.publishProperty];
        if (targetStage.id === 'draft') {
          // Draft is the default state: clean up frontmatter or set draft
          delete fm[this.settings.statusProperty];
        } else {
          // Set status: writing | review | transient
          fm[this.settings.statusProperty] = targetStage.id;
        }
      }
    });

    this.updateStatusBar();
    this.refreshActiveDashboardViews();
  }

  async advanceActiveNoteStage(file) {
    var data = this.collectNotesData().find(d => d.file.path === file.path);
    if (!data) return;

    var currentIdx = this.getStageIndex(data.stage.id);
    if (currentIdx < this.settings.stages.length - 1) {
      var nextStage = this.settings.stages[currentIdx + 1];
      await this.setNoteStage(file, nextStage.id);
      new obsidian.Notice('Moved ' + file.basename + ' -> ' + nextStage.label);
    } else {
      new obsidian.Notice(file.basename + ' is already at final stage: ' + data.stage.label);
    }
  }

  async revertActiveNoteStage(file) {
    var data = this.collectNotesData().find(d => d.file.path === file.path);
    if (!data) return;

    var currentIdx = this.getStageIndex(data.stage.id);
    if (currentIdx > 0) {
      var prevStage = this.settings.stages[currentIdx - 1];
      await this.setNoteStage(file, prevStage.id);
      new obsidian.Notice('Moved ' + file.basename + ' -> ' + prevStage.label);
    } else {
      new obsidian.Notice(file.basename + ' is already at initial stage: ' + data.stage.label);
    }
  }

  openNextUnfinishedNote() {
    var data = this.collectNotesData();
    // Exclude transient and published notes
    var unfinished = data.filter(d => !d.stage.isPublished && !d.stage.isTransient);
    if (unfinished.length === 0) {
      new obsidian.Notice('All publishable notes in vault are completed.');
      return;
    }

    // Sort unfinished notes: writing first, then review, then draft, sorted by mtime desc
    var stageOrder = { writing: 0, review: 1, draft: 2 };
    unfinished.sort((a, b) => {
      var orderA = stageOrder[a.stage.id] !== undefined ? stageOrder[a.stage.id] : 3;
      var orderB = stageOrder[b.stage.id] !== undefined ? stageOrder[b.stage.id] : 3;
      if (orderA !== orderB) return orderA - orderB;
      return b.file.stat.mtime - a.file.stat.mtime;
    });

    var target = unfinished[0];
    this.openFile(target.file);
    new obsidian.Notice('Focused: ' + target.file.basename + ' [' + target.stage.label + ']');
  }

  openRandomNote() {
    var data = this.collectNotesData();
    if (data.length === 0) return;
    var randomIndex = Math.floor(Math.random() * data.length);
    var target = data[randomIndex];
    this.openFile(target.file);
  }

  openFile(file) {
    var leaf = this.app.workspace.getMostRecentLeaf();
    if (leaf && leaf.view.getViewType() !== VIEW_TYPE_DASHBOARD) {
      leaf.openFile(file);
    } else {
      var newLeaf = this.app.workspace.getLeaf(false);
      newLeaf.openFile(file);
    }
  }

  async activateView() {
    var leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_DASHBOARD);
    if (leaves.length > 0) {
      this.app.workspace.revealLeaf(leaves[0]);
    } else {
      var leaf = this.app.workspace.getLeaf('tab');
      await leaf.setViewState({
        type: VIEW_TYPE_DASHBOARD,
        active: true
      });
      this.app.workspace.revealLeaf(leaf);
    }
  }
}

module.exports = VaultPublishDashboardPlugin;
