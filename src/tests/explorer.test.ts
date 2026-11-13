import { beforeEach, describe, expect, it } from 'vitest';
import { useExplorer } from '../state/explorer';

beforeEach(() => {
  useExplorer.setState(useExplorer.getInitialState(), true);
});

const state = () => useExplorer.getState();

describe('navigation anatomique', () => {
  it('sélectionne un organe précédemment masqué et demande son cadrage', () => {
    state().select('heart');
    state().hide();
    expect(state().hiddenIds).toContain('heart');
    expect(state().selectedId).toBeNull();

    state().select('heart');
    expect(state().selectedId).toBe('heart');
    expect(state().hiddenIds).not.toContain('heart');
    expect(state().cameraRequest).toMatchObject({ type: 'focus', id: 'heart' });
  });

  it('sort de l’isolation lors d’une autre sélection et conserve le dernier cadrage', () => {
    state().select('heart');
    state().isolate();
    expect(state().isolated).toBe(true);

    state().select('lungs');
    expect(state().isolated).toBe(false);
    expect(state().selectedId).toBe('lungs');
    expect(state().cameraRequest).toMatchObject({ type: 'focus', id: 'lungs' });
  });

  it('restaure toutes les couches et les organes masqués au retour général', () => {
    const initialLayers = [...state().activeSystems];
    state().toggleSystem('digestive');
    state().select('liver');
    state().setTransparent();
    state().isolate();
    state().hide();
    state().reset();

    expect(state()).toMatchObject({ selectedId: null, isolated: false, transparent: false, hiddenIds: [] });
    expect(state().activeSystems).toEqual(initialLayers);
    expect(state().cameraRequest.type).toBe('reset');
  });

  it('active et désactive une couche sans doublon et annule l’isolation', () => {
    state().select('heart');
    state().isolate();
    state().toggleSystem('respiratory');
    expect(state().activeSystems).not.toContain('respiratory');
    expect(state().isolated).toBe(false);
    state().toggleSystem('respiratory');
    expect(state().activeSystems.filter(id => id === 'respiratory')).toHaveLength(1);
  });

  it('retire la sélection quand sa couche est désactivée', () => {
    state().select('heart');
    state().toggleSystem('cardiovascular');
    expect(state().selectedId).toBeNull();
    expect(state().activeSystems).not.toContain('cardiovascular');
  });

  it('numérote chaque requête caméra pour les sélections rapides et les répétitions', () => {
    const start = state().cameraRequest.sequence;
    state().select('heart');
    state().select('heart');
    state().select('kidneys');
    state().zoom(1);
    state().view('back');
    state().reset();
    expect(state().cameraRequest.sequence).toBe(start + 6);
    expect(state().cameraRequest.type).toBe('reset');
  });

  it('résout une erreur de chargement après un chargement réussi', () => {
    state().setError('Impossible de charger le modèle');
    expect(state().loaded).toBe(false);
    state().setLoaded(['heart', 'lungs']);
    expect(state()).toMatchObject({ loaded: true, error: null, availableIds: ['heart', 'lungs'] });
  });
});
