/**
 * Fonctions helper pour import/export de template
 * Importe/exporte via les fonctions de raidTemplate.ts
 */

import {
  RaidTemplateDocument,
  parseTemplateDocument,
  exportTemplateDocument,
} from './raidTemplate';

/**
 * Exporte le template en JSON et déclenche le téléchargement
 */
export const downloadTemplateAsJson = (template: RaidTemplateDocument, filename = 'ttemplate-export.json') => {
  const jsonString = exportTemplateDocument(template);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

/**
 * Trigger un input file pour sélectionner un JSON à importer
 * Callback: onFileSelected(text: string) - reçoit le contenu du fichier
 */
export const triggerJsonImport = (onFileSelected: (text: string) => void) => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';
  input.onchange = async (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const text = await file.text();
    onFileSelected(text);
  };
  input.click();
};

/**
 * Importe un template depuis une chaîne JSON
 */
export const importTemplate = (json: string): RaidTemplateDocument => {
  return parseTemplateDocument(json);
};

/**
 * Exporte un template en chaîne JSON
 */
export const exportTemplate = (template: RaidTemplateDocument): string => {
  return exportTemplateDocument(template);
};
