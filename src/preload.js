'use strict';

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  listGames: () => ipcRenderer.invoke('games:list'),
  saveGame: (game) => ipcRenderer.invoke('games:save', game),
  deleteGame: (id) => ipcRenderer.invoke('games:delete', id),
  steamPing: () => ipcRenderer.invoke('steam:ping'),
  searchSteam: (query) => ipcRenderer.invoke('steam:search', query),
  steamDetails: (appid) => ipcRenderer.invoke('steam:details', appid),
  hltbSearch: (title) => ipcRenderer.invoke('hltb:search', title),
  steamPrices: (appids) => ipcRenderer.invoke('steam:prices', appids),
  pickCover: () => ipcRenderer.invoke('cover:pick'),
  backupExport: () => ipcRenderer.invoke('backup:export'),
  backupImport: () => ipcRenderer.invoke('backup:import'),
  steamFeatured: () => ipcRenderer.invoke('steam:featured'),
  steamMostPlayed: () => ipcRenderer.invoke('steam:mostPlayed'),
  steamHome: () => ipcRenderer.invoke('steam:home'),
  wrappedExport: (rect) => ipcRenderer.invoke('wrapped:export', rect),
  winMinimize: () => ipcRenderer.invoke('win:minimize'),
  winMaximizeToggle: () => ipcRenderer.invoke('win:maximizeToggle'),
  winClose: () => ipcRenderer.invoke('win:close'),
  winIsMaximized: () => ipcRenderer.invoke('win:isMaximized'),
  onWinState: (cb) => ipcRenderer.on('win:state', (_e, max) => cb(max)),
  updateCheck: () => ipcRenderer.invoke('update:check'),
  updateInstall: () => ipcRenderer.invoke('update:install'),
  onUpdateStatus: (cb) => ipcRenderer.on('update:status', (_e, s) => cb(s)),
  appVersion: () => ipcRenderer.invoke('app:version'),
  openExternal: (url) => ipcRenderer.invoke('app:openExternal', url),
});
