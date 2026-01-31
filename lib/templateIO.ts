/**
 * Fonctions helper pour import/export de template
 * Patterns: Mutations uniquement via loadTemplate(), display uniquement via exportTemplate()
 */

/**
 * Exporte le template en JSON et déclenche le téléchargement
 */
export const downloadTemplateAsJson = (jsonString: string, filename = 'ttemplate-export.json') => {
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
