// Standalone routing util — uses hash routing for GitHub Pages compatibility
export function createPageUrl(pageName: string): string {
  return '#/' + pageName.replace(/ /g, '-');
}
