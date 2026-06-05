import { describe, expect, it } from 'vitest';
import { getUiText, nodeTypeLabels, reviewStatusLabels } from '../src/lib/i18n';

describe('ui localization', () => {
  it('uses Chinese labels by default for the graph UI', () => {
    const text = getUiText('zh');

    expect(text.search).toBe('搜索');
    expect(text.mapLayers).toBe('图谱层级');
    expect(text.learningPath).toBe('学习路径');
    expect(text.connectedConcepts).toBe('关联概念');
  });

  it('keeps English labels available through the toggle', () => {
    const text = getUiText('en');

    expect(text.search).toBe('Search');
    expect(text.mapLayers).toBe('Map Layers');
    expect(text.learningPath).toBe('Learning Path');
    expect(text.connectedConcepts).toBe('Connected Concepts');
  });

  it('translates node type and review status labels', () => {
    expect(nodeTypeLabels.zh['case-study']).toBe('工程案例');
    expect(nodeTypeLabels.en['case-study']).toBe('Case Study');
    expect(reviewStatusLabels.zh['needs-review']).toBe('待复核');
  });
});
