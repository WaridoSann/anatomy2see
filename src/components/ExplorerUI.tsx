import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Activity, ArrowRight, ArrowUpRight, Bone, Brain, Check, ChevronRight, CircleHelp, EyeOff, Focus, Heart, Info, Layers3, Maximize, Menu, Minus, MousePointer2, Pause, Play, Plus, RotateCcw, Scan, Search, Settings2, Waves, X } from 'lucide-react';
import { systems, type AnatomyStructure, type SystemId } from '../data/anatomy';

export interface ExplorerUIProps {
  structures: AnatomyStructure[];
  availableIds: string[];
  selectedId: string | null;
  activeSystems: SystemId[];
  hiddenIds: string[];
  isolated: boolean;
  transparent: boolean;
  query: string;
  quality: 'low' | 'medium' | 'high' | 'ultra';
  labels: boolean;
  loaded: boolean;
  error: string | null;
  onSelect(id: string): void;
  onToggleSystem(id: SystemId): void;
  onReset(): void;
  onIsolate(): void;
  onHide(): void;
  onTransparent(): void;
  onQuery(q: string): void;
  onQuality(q: 'low' | 'medium' | 'high' | 'ultra'): void;
  onLabels(): void;
  onZoom(dir: number): void;
  onView(view: 'front' | 'back' | 'side'): void;
}

const icons = { skeletal: Bone, muscular: Activity, nervous: Brain, cardiovascular: Heart, respiratory: Waves, digestive: Activity, urinary: Waves };
const qualityNames = { low: 'Économie', medium: 'Équilibrée', high: 'Élevée', ultra: 'Ultra' };

function Physiology({ kind }: { kind: 'heart' | 'lungs' }) {
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState('1');
  return <section className="physiology-card" aria-label="Animation pédagogique">
    <div className="eyebrow"><span className="live-dot" /> PHYSIOLOGIE · SCHÉMA</div>
    <div className={`physiology-graphic ${playing ? 'is-playing' : ''}`} style={{ '--animation-time': `${2 / Number(speed)}s` } as CSSProperties}>
      {kind === 'heart' ? <><Heart className="pulse-heart" size={48} strokeWidth={1} /><svg viewBox="0 0 200 45" aria-hidden="true"><path d="M0 25H38L45 21L52 29L61 25H76L83 10L91 40L99 3L108 30L116 25H146L153 19L162 25H200" /></svg></> : <><Waves className="breathing-wave" size={58} strokeWidth={1} /><span>Inspiration & expiration</span></>}
    </div>
    <div className="physiology-controls"><button className="text-button" onClick={() => setPlaying(!playing)} aria-label={playing ? 'Mettre le schéma en pause' : 'Lire le schéma'}>{playing ? <Pause size={13} /> : <Play size={13} />}{playing ? 'Pause' : 'Lecture'}</button><label>Vitesse <select value={speed} onChange={e => setSpeed(e.target.value)} aria-label="Vitesse du schéma"><option value="0.5">0,5×</option><option value="1">1×</option><option value="1.5">1,5×</option></select></label></div>
    <p>Illustration du rythme, sans simulation ni déformation du modèle anatomique.</p>
  </section>;
}

export default function ExplorerUI(p: ExplorerUIProps) {
  const [mobilePanel, setMobilePanel] = useState<'systems' | 'info' | null>(null);
  const [settings, setSettings] = useState(false);
  const [help, setHelp] = useState(false);
  const [infoTab, setInfoTab] = useState<'overview' | 'details'>('overview');
  const [view, setView] = useState<'front' | 'back' | 'side'>('front');
  const [toast, setToast] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const selected = p.structures.find(s => s.id === p.selectedId);
  const ready = p.loaded || !!p.error;
  const available = p.structures.filter(s => p.availableIds.includes(s.id));
  const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/œ/g, 'oe').replace(/æ/g, 'ae');
  const filtered = available.filter(s => normalize(`${s.name} ${s.latin}`).includes(normalize(p.query)));
  const selectedSystem = selected && systems.find(s => s.id === selected.system);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setMobilePanel('systems'); searchRef.current?.focus(); }
      if (e.key === 'Escape') { setSettings(false); setHelp(false); setMobilePanel(null); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
  useEffect(() => { if (!toast) return; const id = window.setTimeout(() => setToast(''), 4000); return () => window.clearTimeout(id); }, [toast]);
  useEffect(() => { setInfoTab('overview'); setView('front'); }, [p.selectedId]);

  const select = (id: string) => { p.onSelect(id); setView('front'); setMobilePanel(null); };
  const fullscreen = async () => {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); }
    catch { setToast('Le plein écran est indisponible dans ce navigateur.'); }
  };

  return <div className="explorer-ui" data-loaded={p.loaded ? "true" : "false"}>
    <header className="topbar">
      <a className="brand" href={import.meta.env.BASE_URL} aria-label="anatomy2see — accueil"><span className="brand-mark"><Scan size={25} strokeWidth={1.3} /><span /></span><span>anatomy<span className="brand-two">2</span>see<span className="brand-subtitle">L’ATLAS DU CORPS HUMAIN</span></span></a>
      <nav className="top-nav" aria-label="Navigation principale"><span className="nav-current"><span />Explorateur 3D</span><button onClick={() => setHelp(!help)}>Guide d’exploration <ArrowUpRight size={12} /></button></nav>
      <div className="header-tools"><span className="edition-label">ÉDITION OUVERTE <span>01</span></span><button className={`icon-button ${settings ? 'active' : ''}`} aria-label="Paramètres graphiques" onClick={() => setSettings(!settings)}><Settings2 size={18} /></button><button className="icon-button fullscreen-button" aria-label="Plein écran" onClick={fullscreen}><Maximize size={17} /></button><button className="icon-button mobile-menu" aria-label="Ouvrir les systèmes" onClick={() => setMobilePanel(mobilePanel === 'systems' ? null : 'systems')}><Menu size={21} /></button></div>
    </header>

    <aside className="side-rail" aria-label="Outils"><button className={`rail-button ${mobilePanel !== 'info' ? 'active' : ''}`} onClick={() => { setMobilePanel(mobilePanel === 'systems' ? null : 'systems'); }} aria-label="Systèmes et structures"><Layers3 size={19} /></button><button disabled={!p.loaded} className={`rail-button ${p.labels ? 'active' : ''}`} onClick={p.onLabels} aria-label={p.labels ? 'Masquer les étiquettes' : 'Afficher les étiquettes'}><Info size={18} /></button><span className="rail-line" /><button className="rail-button rail-bottom" onClick={() => setHelp(!help)} aria-label="Aide"><CircleHelp size={19} /></button><span className="rail-caption">EXPLORER LE VIVANT</span></aside>

    <aside className={`systems-panel ${mobilePanel === 'systems' ? 'mobile-open' : ''}`} aria-label="Systèmes anatomiques">
      <div className="panel-heading"><div><span className="eyebrow">VOTRE EXPLORATION</span><h2>Systèmes anatomiques</h2></div><button className="icon-button panel-close" onClick={() => setMobilePanel(null)} aria-label="Fermer les systèmes"><X size={18} /></button></div>
      <div className="search-box"><Search size={15} /><input data-testid="search-structures" ref={searchRef} placeholder="Rechercher une structure…" aria-label="Rechercher une structure" value={p.query} onChange={e => p.onQuery(e.target.value)} /><span className="search-shortcut">⌘ K</span>{p.query && <button onClick={() => p.onQuery('')} aria-label="Effacer la recherche"><X size={12} /></button>}</div>
      <div className="systems-heading"><span>COUCHES DU MODÈLE</span><span>{p.activeSystems.length.toString().padStart(2, '0')}</span></div>
      <div className="system-list">{systems.map(system => {
        const Icon = icons[system.id];
        const enabled = available.some(a => a.system === system.id);
        const active = p.activeSystems.includes(system.id);
        return <button data-testid={`system-${system.id}`} key={system.id} className={`system-row ${active && enabled ? 'selected' : ''}`} disabled={!enabled || !p.loaded} onClick={() => p.onToggleSystem(system.id)} aria-pressed={active && enabled} style={{ '--system-color': system.color } as CSSProperties}><Icon size={18} strokeWidth={1.3} /><span>{system.name.replace(/^Système /, '')}</span>{enabled ? <span className="layer-check">{active ? <Check size={10} /> : <Plus size={10} />}</span> : <span className="soon-label">À VENIR</span>}</button>;
      })}</div>
      <div className="structure-heading"><span>STRUCTURES DISPONIBLES</span><span>{available.length.toString().padStart(2, '0')}</span></div>
      <div className="structure-list" aria-label="Liste des structures">{filtered.map((structure, i) => <button data-testid={`structure-${structure.id}`} className={`structure-row ${p.selectedId === structure.id ? 'selected' : ''} ${p.hiddenIds.includes(structure.id) ? 'is-hidden' : ''}`} key={structure.id} onClick={() => select(structure.id)} disabled={!ready}><span className="structure-index">{(i + 1).toString().padStart(2, '0')}</span><span>{structure.name}</span>{p.hiddenIds.includes(structure.id) ? <EyeOff size={12} /> : p.selectedId === structure.id ? <span className="selection-dot" /> : <ChevronRight size={12} />}</button>)}{filtered.length === 0 && <p className="empty-search">{p.query ? 'Aucune structure ne correspond à cette recherche.' : 'Chargement de l’inventaire anatomique…'}</p>}</div>
      <a className="model-note" href="https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html" target="_blank" rel="noreferrer"><span className="live-dot" /><span>BodyParts3D · CC BY 4.0<span>© The Database Center for Life Science</span></span><ArrowUpRight size={13} /></a>
    </aside>

    {p.error && <div className="scene-error" role="alert"><Info size={28} strokeWidth={1} /><h2>La 3D est momentanément indisponible.</h2><p>{p.error}</p><p>Vous pouvez continuer à explorer les fiches scientifiques depuis la liste des structures.</p><button onClick={() => window.location.reload()}><RotateCcw size={13} />Réessayer le chargement</button></div>}
    {!p.loaded && !p.error && <div className="loading-status" role="status"><span className="loading-spinner" /><span>Préparation du modèle anatomique<small>Chargement des géométries scientifiques…</small></span></div>}
    <div className="scene-heading"><div className="eyebrow"><span className="tiny-cross">+</span> ATLAS ANATOMIQUE INTERACTIF</div><h1>Le corps humain,<br /><em>sous un autre angle.</em></h1><p>Observer. Comprendre. Explorer.</p></div>
    <div className="scene-coordinates" aria-hidden="true"><span>VUE ANATOMIQUE</span><strong>{p.isolated ? 'STRUCTURE ISOLÉE' : view === 'back' ? 'POSTÉRIEURE' : view === 'side' ? 'LATÉRALE' : 'ANTÉRIEURE'}</strong><span className="coordinate-rule" /></div>
    <div className="orientation-widget" aria-hidden="true"><span>SUP.</span><div><span>D</span><span className="orientation-axis"><i /><i /></span><span>G</span></div><span>INF.</span></div>

    <aside className={`information-panel ${mobilePanel === 'info' ? 'mobile-open' : ''}`} aria-label="Fiche anatomique">
      <div className="info-topline"><span className="eyebrow">{selected ? 'STRUCTURE SÉLECTIONNÉE' : 'LE SAVOIR, EN PROFONDEUR'}</span><button className="icon-button panel-close" onClick={() => setMobilePanel(null)} aria-label="Fermer la fiche"><X size={18} /></button><span className="info-number">{selected ? String(Math.max(1, available.findIndex(s => s.id === selected.id) + 1)).padStart(2, '0') : '01'}<span> / {available.length.toString().padStart(2, '0')}</span></span></div>
      {selected ? <>
        <div className="structure-title"><span className="system-badge" style={{ '--system-color': selectedSystem?.color || '#75e2df' } as CSSProperties}><span />{selectedSystem?.name}</span><h2>{selected.name}</h2><p>{selected.latin}</p></div>
        <div className="info-tabs" role="tablist" aria-label="Contenu de la fiche"><button role="tab" aria-selected={infoTab === 'overview'} className={infoTab === 'overview' ? 'active' : ''} onClick={() => setInfoTab('overview')}>Vue d’ensemble</button><button role="tab" aria-selected={infoTab === 'details'} className={infoTab === 'details' ? 'active' : ''} onClick={() => setInfoTab('details')}>En détail <Plus size={11} /></button></div>
        <div className="info-body">{infoTab === 'overview' ? <><p className="structure-description">{selected.description}</p><section className="fact-section"><span className="eyebrow">FONCTION PRINCIPALE</span><p>{selected.function}</p></section><section className="fact-section"><span className="eyebrow">LOCALISATION</span><p>{selected.location}</p></section>{(selected.id === 'heart' || selected.id === 'lungs') && <Physiology kind={selected.id as 'heart' | 'lungs'} />}</> : <><section className="fact-section"><span className="eyebrow">RELATIONS ANATOMIQUES</span><ul>{selected.relations.map(relation => <li key={relation}>{relation}</li>)}</ul></section><section className="fact-section"><span className="eyebrow">POUR ALLER PLUS LOIN</span><ul>{selected.facts.map(fact => <li key={fact}>{fact}</li>)}</ul></section></>}</div>
        <div className="selection-actions"><button disabled={!p.loaded} data-testid="isolate-selection" className={`primary-button ${p.isolated ? 'is-active' : ''}`} onClick={p.onIsolate}><Focus size={15} />{p.isolated ? 'Quitter l’isolation' : 'Isoler la structure'}<ArrowUpRight size={14} /></button><div><button disabled={!p.loaded} className="secondary-button" onClick={() => p.onSelect(selected.id)}><Scan size={13} />Recentrer</button><button disabled={!p.loaded} className="secondary-button" onClick={p.onHide}><EyeOff size={13} />Masquer</button></div></div>
        <a className="source-link" href={selected.source.url} target="_blank" rel="noreferrer"><span>RÉFÉRENCE SCIENTIFIQUE<strong>{selected.source.label}</strong></span><ArrowUpRight size={15} /></a>
      </> : <>
        <div className="intro-card"><div className="intro-orbit" aria-hidden="true"><span /><span /><Heart size={46} strokeWidth={0.8} /><i /></div><span className="eyebrow">UNE NOUVELLE PERSPECTIVE</span><h2>La complexité du vivant.<br /><em>À portée de main.</em></h2><p>Parcourez le corps humain, de sa structure aux organes qui l’animent. Chaque élément révèle son histoire.</p><button className="primary-button" disabled={!ready || !p.availableIds.includes('heart')} onClick={() => select('heart')}><Heart size={15} />Explorer le cœur<ArrowRight size={15} /></button></div>
        <div className="discovery-steps"><div><span>01</span><p><strong>Choisissez un système</strong>Activez les couches pour voir autrement.</p></div><div><span>02</span><p><strong>Approchez une structure</strong>Cliquez sur le modèle ou dans la liste.</p></div><div><span>03</span><p><strong>Entrez dans le détail</strong>Isolez un organe et découvrez sa fonction.</p></div></div>
        <div className="education-note"><Info size={14} /><p>Un atlas pour apprendre et explorer.<br />Usage pédagogique, sans visée diagnostique.</p></div>
      </>}
    </aside>

    <div className="scene-bottom"><div className="interaction-hint"><MousePointer2 size={13} /><span>Glisser pour tourner <i />Molette pour zoomer</span></div><div className="camera-toolbar" aria-label="Commandes du modèle"><button data-testid="reset-view" className="toolbar-home" onClick={() => { p.onReset(); setView('front'); }} aria-label="Revenir au corps entier"><RotateCcw size={16} /><span>Vue globale</span></button><span className="toolbar-divider" /><div className="view-selector">{(['front', 'back', 'side'] as const).map(v => <button disabled={!p.loaded} key={v} aria-label={`Vue ${v === 'front' ? 'de face' : v === 'back' ? 'de dos' : 'de profil'}`} aria-pressed={view === v} className={view === v ? 'active' : ''} onClick={() => { setView(v); p.onView(v); }}>{v === 'front' ? 'Face' : v === 'back' ? 'Dos' : 'Profil'}</button>)}</div><span className="toolbar-divider" /><button disabled={!p.loaded} onClick={() => p.onZoom(-1)} aria-label="Dézoomer"><Minus size={17} /></button><button disabled={!p.loaded} onClick={() => p.onZoom(1)} aria-label="Zoomer"><Plus size={17} /></button><span className="toolbar-divider" /><button disabled={!p.loaded} className={p.transparent ? 'active' : ''} onClick={p.onTransparent} aria-pressed={p.transparent} aria-label="Activer la transparence"><Layers3 size={17} /></button></div></div>

    <footer className="statusbar"><span data-testid="model-status" data-loaded={p.loaded ? "true" : "false"}><span className={`status-dot ${p.loaded && !p.error ? 'ready' : ''}`} />{p.error ? 'MODÈLE INDISPONIBLE' : p.loaded ? 'EXPLORATION EN TEMPS RÉEL' : 'PRÉPARATION DE L’ATLAS'}</span><span className="status-center">{p.loaded ? `${available.length} structures anatomiques` : 'Chargement des modèles scientifiques'}<span>·</span>3D INTERACTIVE</span><span>ANATOMY2SEE <span className="footer-year">© {new Date().getFullYear()}</span></span></footer>
    <div className="mobile-bottom-nav"><button data-testid="mobile-structures-toggle" className={mobilePanel === 'systems' ? 'active' : ''} onClick={() => setMobilePanel(mobilePanel === 'systems' ? null : 'systems')}><Layers3 size={17} />Systèmes</button><button onClick={() => { p.onReset(); setMobilePanel(null); }}><RotateCcw size={17} />Vue globale</button><button className={mobilePanel === 'info' ? 'active' : ''} onClick={() => setMobilePanel(mobilePanel === 'info' ? null : 'info')}><Info size={17} />{selected ? selected.name : 'Découvrir'}</button></div>

    {settings && <div className="settings-popover"><div className="popover-heading"><span>Paramètres d’affichage</span><button className="icon-button" aria-label="Fermer les paramètres" onClick={() => setSettings(false)}><X size={16} /></button></div><label className="settings-label">Qualité graphique<select value={p.quality} onChange={e => p.onQuality(e.target.value as ExplorerUIProps['quality'])}>{Object.entries(qualityNames).map(([key, value]) => <option key={key} value={key}>{value}</option>)}</select></label><p>Adaptez la résolution de rendu et les effets aux capacités de votre appareil.</p><button disabled={!p.loaded} className="setting-toggle" aria-pressed={p.labels} onClick={p.onLabels}><span>Étiquettes anatomiques</span><span className={`toggle ${p.labels ? 'on' : ''}`} /></button><button disabled={!p.loaded} className="setting-toggle" aria-pressed={p.transparent} onClick={p.onTransparent}><span>Transparence des couches</span><span className={`toggle ${p.transparent ? 'on' : ''}`} /></button></div>}
    {help && <div className="modal-backdrop" onClick={() => setHelp(false)}><section className="help-modal" role="dialog" aria-modal="true" aria-label="Guide d’exploration" onClick={e => e.stopPropagation()}><button className="icon-button modal-close" onClick={() => setHelp(false)} aria-label="Fermer l’aide"><X size={20} /></button><span className="eyebrow">PRENEZ LE TEMPS DE DÉCOUVRIR</span><h2>Le corps humain vous attend.</h2><p>Un modèle scientifique, libre à explorer.</p><div className="help-grid"><div><MousePointer2 size={23} /><strong>Observer</strong><p>Glissez pour faire tourner le corps. Utilisez la molette ou pincez l’écran pour zoomer.</p></div><div><Focus size={23} /><strong>Approcher</strong><p>Cliquez sur une structure pour la sélectionner et ouvrir sa fiche. Double-cliquez pour l’isoler.</p></div><div><Layers3 size={23} /><strong>Comprendre</strong><p>Affichez les systèmes, activez la transparence et consultez les références scientifiques.</p></div><div><RotateCcw size={23} /><strong>Revenir</strong><p>« Vue globale » rétablit le modèle complet et le cadrage initial.</p></div></div><button className="primary-button" onClick={() => setHelp(false)}>Commencer l’exploration<ArrowRight size={16} /></button><p className="help-limit">Seules les structures disponibles dans les ressources intégrées sont activées. Les schémas physiologiques sont illustratifs.</p></section></div>}
    {toast && <div role="status" className="toast">{toast}<button aria-label="Fermer le message" onClick={() => setToast('')}><X size={14} /></button></div>}
    {mobilePanel && <button className="mobile-panel-backdrop" aria-label="Fermer le panneau" onClick={() => setMobilePanel(null)} />}
  </div>;
}
