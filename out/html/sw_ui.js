/*
 * sw_ui.js - sidebar and chart HTML builders for "Thunderous Applause".
 * Builds strings only; the status scenes interpolate them.
 */
(function (g) {
  'use strict';
  var SW = g.SW;
  if (!SW) return;

  var LABELS = {
    level: [[15, 'very low'], [35, 'low'], [55, 'moderate'], [75, 'high'], [1e9, 'very high']],
    faith: [[25, '<b class="bad">collapsing</b>'], [40, '<b class="warn">shaken</b>'], [55, 'wavering'], [70, '<b class="good">steady</b>'], [1e9, '<b class="good">strong</b>']],
    relation: [[10, '<span class="bad">hostile</span>'], [25, '<span class="warn">cold</span>'], [40, 'cool'], [55, 'cordial'], [70, '<span class="good">warm</span>'], [1e9, '<span class="good">close</span>']],
    evidence: [[0.9, 'nothing'], [2.9, 'rumours'], [4.9, 'suspicions'], [7.9, 'circumstantial'], [9.9, 'compelling'], [1e9, '<b class="good">conclusive</b>']],
    resolve: [[0.9, 'complacent'], [2.9, 'uneasy'], [4.9, 'alarmed'], [6.9, 'determined'], [1e9, '<b class="good">defiant</b>']],
    powers: [[0, '<span class="good">constitutional</span>'], [2, 'extended mandate'], [4, '<span class="warn">wartime emergency</span>'], [6, '<span class="warn">sweeping</span>'], [8, '<b class="bad">near-absolute</b>'], [1e9, '<b class="bad">absolute</b>']],
    unease: [[0, 'business as usual'], [1, 'a vague disquiet'], [2, 'unease no one can name'], [3, '<span class="warn">a shadow over the Senate</span>'], [4, '<b class="bad">darkness clouds every vision</b>'], [1e9, '<b class="bad">the dark side is ascendant</b>']],
    sep: [[20, 'loyal'], [35, 'grumbling'], [50, '<span class="warn">disaffected</span>'], [65, '<b class="bad">seceding</b>'], [1e9, '<b class="bad">in revolt</b>']],
    strength: [[0.5, 'none'], [2, 'token'], [4, 'modest'], [6, 'substantial'], [8, 'strong'], [1e9, 'formidable']],
    ratio: [[0.6, '<b class="bad">hopeless</b>'], [0.9, '<span class="warn">outmatched</span>'], [1.1, 'evenly matched'], [1.6, '<span class="good">favourable</span>'], [1e9, '<b class="good">overwhelming</b>']],
    war: [[-7, '<b class="bad">catastrophic</b>'], [-3, '<span class="warn">losing ground</span>'], [-1, 'faltering'], [1, 'stalemate'], [4, '<span class="good">gaining ground</span>'], [7, '<span class="good">winning</span>'], [1e9, '<b class="good">nearly won</b>']],
    dissent: [[5, '<span class="good">united</span>'], [12, 'murmuring'], [22, 'restless'], [35, '<span class="warn">quarrelsome</span>'], [50, '<b class="bad">fractious</b>'], [1e9, '<b class="bad">on the verge of schism</b>']],
    cdissent: [[0, 'harmonious'], [1, 'grumbling'], [2, 'strained'], [3, '<span class="warn">fraying</span>'], [1e9, '<b class="bad">collapsing</b>']]
  };
  SW.label = function (type, v) {
    var t = LABELS[type];
    v = +v || 0;
    for (var i = 0; i < t.length; i++) if (v <= t[i][0]) return t[i][1];
    return t[t.length - 1][1];
  };

  function row(k, v) { return '<div class="sb-row"><span class="sb-k">' + k + '</span><span class="sb-v">' + v + '</span></div>'; }
  function head(t) { return '<h1>' + t + '</h1>'; }
  function bar(v, max, cls) {
    var w = Math.max(0, Math.min(100, Math.round(100 * v / max)));
    return '<div class="meter"><div class="meter-fill ' + (cls || '') + '" style="width:' + w + '%"></div></div>';
  }
  // Bloc names are coloured text; on the light theme the pale colours need darker shades to stay readable.
  var LIGHT_TEXT = {rc: '#2f6fae', mod: '#7a6a2e', pal: '#b3141b', guild: '#9a6312', rim: '#c4520f', sec: '#56616b',
    ind: '#4c8459', cis: '#7a4aa8', rfc: '#a07410'};
  SW.textColor = function (b) {
    var dark = typeof document !== 'undefined' && document.body && document.body.classList.contains('dark-mode');
    return (!dark && LIGHT_TEXT[b]) || SW.color(b);
  };
  SW.span = function (Q, b, text) {
    return '<span class="bloc" style="color:' + SW.textColor(b) + '">' + (text || SW.name(Q, b)) + '</span>';
  };
  function bloc(Q, b) { return SW.span(Q, b); }

  SW.statusHTML = function (Q, tab) {
    if (!Q || !Q.started) return '<p class="sb-note">Begin a new game to see the state of the Republic.</p>';
    var h = '';
    switch (tab) {
      case 'main': h = mainTab(Q); break;
      case 'senate': h = senateTab(Q); break;
      case 'shadow': h = shadowTab(Q); break;
      case 'forces': h = forcesTab(Q); break;
      case 'polls': h = pollsTab(Q); break;
      case 'chancellery': h = chancelleryTab(Q); break;
    }
    return h;
  };

  function mainTab(Q) {
    var h = head(Q.date_label);
    h += row('Political capital', '<b>' + Q.capital + '</b>');
    var pos = Q.rc_chancellor ? '<b class="good">holds the Chancellery</b>' : (Q.rc_in_govt ? 'in government' : 'in opposition');
    h += row(bloc(Q, 'rc'), pos);
    if (Q.rc_in_govt) h += row('Coalition', Q.coalition_name + (Q.minority_govt ? ' (minority)' : ''));
    if (Q.rc_in_govt) h += row('Coalition mood', SW.label('cdissent', Q.coalition_dissent));
    if (Q.rc_in_govt) h += row('Republic treasury', Q.treasury);
    var chairs = [];
    for (var i = 0; i < SW.COMMITTEES.length; i++) if (Q['chair_' + SW.COMMITTEES[i]] === 'rc') chairs.push(SW.COMMITTEE_NAMES[SW.COMMITTEES[i]]);
    if (chairs.length) h += row('Our chairs', chairs.join(', '));
    h += row('Caucus mood', SW.label('dissent', Q.dissent_percent));
    h += head('The Republic');
    h += row('Chancellor', '<span style="color:' + SW.textColor(Q.chancellor_bloc) + '">' + Q.chancellor + '</span>');
    h += row('Faith in the Republic', SW.label('faith', Q.faith)) + bar(Q.faith, 100, 'good-fill');
    h += row('Corruption', SW.label('level', Q.corruption)) + bar(Q.corruption, 100, 'bad-fill');
    h += row('Fear', SW.label('level', Q.fear)) + bar(Q.fear, 100, 'bad-fill');
    h += row('Outer Rim hardship', SW.label('level', Q.rim_hardship)) + bar(Q.rim_hardship, 100, 'bad-fill');
    h += row('Emergency powers', SW.label('powers', Q.emergency_powers)) + bar(Q.emergency_powers, 10, 'bad-fill');
    h += head('The Caucus');
    for (var j = 0; j < SW.FACTIONS.length; j++) {
      var f = SW.FACTIONS[j];
      h += row(SW.FACTION_NAMES[f], Math.round(Q[f + '_strength']) + '% · ' + SW.label('dissent', Q[f + '_dissent']));
      var led = (Q[f + '_leader'] && SW.firmLabel) ? 'Led by ' + Q[f + '_leader'] + ' (' + SW.firmLabel(Q, f) + ').' : '';
      if (Q[f + '_unmet']) h += '<div class="sb-note warn">' + led + ' Restless: they want ' + Q[f + '_demand'] + '.</div>';
      else if (led) h += '<div class="sb-note">' + led + '</div>';
    }
    if (Q.hawks_split) h += '<p class="sb-note">The Hawks have broken away to the Security Bloc.</p>';
    if (Q.rimward_split) h += '<p class="sb-note">The Rimward wing has split off as the Rim Freedom Caucus.</p>';
    return h;
  }

  function senateTab(Q) {
    var h = head('Senate composition');
    h += '<p class="sb-note">Seats as of the last session. ' + (Q.seceded_total ? Q.seceded_total + '% of delegations have seceded.' : '') + '</p>';
    var list = Q.parties.slice().sort(function (a, b) { return (Q[b + '_r'] || 0) - (Q[a + '_r'] || 0); });
    for (var i = 0; i < list.length; i++) {
      var b = list[i];
      var mark = (Q.govt_blocs || []).indexOf(b) >= 0 ? ' ★' : '';
      h += row(bloc(Q, b) + mark, (Q[b + '_r'] || 0).toFixed(1) + '%');
    }
    h += '<p class="sb-note">★ in the governing coalition (' + Q.govt_seats + '%).</p>';
    h += head('Our relations');
    for (var k = 0; k < Q.parties.length; k++) {
      var bb = Q.parties[k];
      if (bb === 'rc') continue;
      h += row(bloc(Q, bb), SW.label('relation', Q[bb + '_relation']));
      var ref = SW.leader ? (SW.leader(Q, bb).refuses || []).filter(function (x) { return Q.parties.indexOf(x) >= 0; }) : [];
      if (ref.length) h += '<div class="sb-note">' + Q[bb + '_leader'] + ' won\'t govern with the ' + ref.map(function (x) { return SW.name(Q, x); }).join(' or the ') + '.</div>';
    }
    // the Senate's permanent staff, shown like a bloc ("the true rulers of the Republic")
    h += row('The Senate bureaucracy', SW.label('relation', Q.bureau_relation));
    if (Q.bureau_relation < 25 && (Q.rc_in_govt || Q.rc_chairs > 0)) h += '<div class="sb-note warn">Our bills are being lost in committee.</div>';
    h += head('Committee chairs');
    for (var c = 0; c < SW.COMMITTEES.length; c++) {
      var cm = SW.COMMITTEES[c];
      h += row(SW.COMMITTEE_NAMES[cm], bloc(Q, Q['chair_' + cm]));
    }
    return h;
  }

  function shadowTab(Q) {
    var h = head('The shadow');
    h += row('In the corridors', SW.label('unease', Q.unease));
    h += row('Our evidence', SW.label('evidence', Q.evidence)) + bar(Q.evidence, 12, 'good-fill');
    h += row('Jedi suspicion', SW.label('resolve', Q.jedi_suspicion)) + bar(Q.jedi_suspicion, 10, 'good-fill');
    h += row('Senate resolve', SW.label('resolve', Q.senate_resolve)) + bar(Q.senate_resolve, 10, 'good-fill');
    h += row('Emergency powers', SW.label('powers', Q.emergency_powers)) + bar(Q.emergency_powers, 10, 'bad-fill');
    if (Q.misfortunes && Q.misfortunes.length) {
      h += head('Recent misfortunes');
      for (var mf = Q.misfortunes.length - 1; mf >= 0; mf--) h += '<div class="sb-note">' + Q.misfortunes[mf] + '.</div>';
    }
    if (Q.evidence >= 6 && Q.bureau_captured > 0) h += '<p class="sb-note warn">The bureaucracy\'s payroll leads to the Chancellery.</p>';
    else if (Q.evidence >= 6) h += '<p class="sb-note">The bureaucracy\'s payroll leads to the Trade Federation, and through it to someone else.</p>';
    h += head('Safeguards');
    var reforms = [
      ['emergency_sunset', 'Sunset clauses on emergency powers'],
      ['term_limits_protected', 'Chancellor\'s term limit entrenched'],
      ['army_oversight', 'Senate oversight of the army'],
      ['senate_guard_reformed', 'Senate Guard answers to the Senate'],
      ['jedi_independence', 'Jedi Order independent of the Chancellor'],
      ['banking_independent', 'Banking Clan independent of the Chancellery'],
      ['rim_enfranchised', 'Outer Rim fully represented'],
      ['anti_corruption', 'Senate Ethics Commission'],
      ['chips_removed', 'Clone inhibitor chips removed']
    ];
    for (var i = 0; i < reforms.length; i++) {
      var on = Q[reforms[i][0]];
      h += '<div class="sb-check ' + (on ? 'on' : 'off') + '">' + (on ? '✔ ' : '○ ') + reforms[i][1] + '</div>';
    }
    return h;
  }

  function forcesTab(Q) {
    var h = head(Q.war ? 'The Clone Wars' : 'Peace and its enemies');
    if (Q.war) {
      h += row('The front', SW.label('war', Q.war_balance));
      h += row('War-weariness', SW.label('level', Q.war_weariness)) + bar(Q.war_weariness, 100, 'bad-fill');
    }
    h += row('Outer Rim separatism', SW.label('sep', Q.outer_sep));
    h += row('Mid Rim separatism', SW.label('sep', Q.midrim_sep));
    h += row('Corporate separatism', SW.label('sep', Q.corporate_sep));
    if (Q.seceded_total) h += row('Delegations seceded', Q.seceded_total + '%');
    h += head('Who would stand with the Senate?');
    h += row('Jedi Order', SW.label('strength', Q.jedi_strength) + ' · trust ' + SW.label('level', Q.jedi_standing));
    h += row('Judicial Forces', SW.label('strength', Q.judicial_forces));
    h += row('Member-world forces', SW.label('strength', Q.member_forces) + (Q.pact_formed ? ' (Defence Pact)' : ''));
    if (Q.clones > 0) h += row('Clone army', SW.label('strength', Q.clones) + (Q.army_oversight ? ' · Senate oversight' : ''));
    if (Q.clones > 0) h += row('Navy loyalty to the Senate', SW.label('level', Q.navy_loyalty));
    h += row('Senate Guard', Q.senate_guard_reformed ? '<span class="good">loyal to the Senate</span>' : 'answers to the Chancellor');
    h += row('Balance, if it came to it', SW.label('ratio', Q.force_ratio));
    h += '<p class="sb-note">A rough estimate of loyal forces against everyone who might obey the Chancellor alone.</p>';
    return h;
  }

  function pollsTab(Q) {
    var h = head('Delegation alignment');
    h += '<p class="sb-note">Current alignment if the Senate sat today.</p>';
    var list = Q.parties.slice().sort(function (a, b) { return (Q[b + '_votes'] || 0) - (Q[a + '_votes'] || 0); });
    for (var i = 0; i < list.length; i++) {
      var b = list[i];
      var d = (Q[b + '_votes'] || 0) - (Q[b + '_r'] || 0);
      var arrow = d > 0.4 ? ' <span class="good">▲</span>' : (d < -0.4 ? ' <span class="bad">▼</span>' : '');
      h += row(bloc(Q, b), (Q[b + '_votes'] || 0).toFixed(1) + '%' + arrow);
    }
    h += head('Our support by region');
    for (var r = 0; r < SW.REGIONS.length; r++) {
      var rg = SW.REGIONS[r];
      h += row(SW.REGION_NAMES[rg], (Q[rg + '_rc_share'] || 0) + '%');
    }
    return h;
  }

  function chancelleryTab(Q) {
    var h = head('The Chancellery');
    h += '<div class="figure"><div class="figure-name" style="color:' + SW.textColor(Q.chancellor_bloc) + '">' + Q.chancellor_title + ' ' + Q.chancellor + '</div>';
    h += '<div class="figure-sub">' + SW.name(Q, Q.chancellor_bloc) + '</div></div>';
    h += row('Vice Chair', Q.vice_chair);
    h += head('Bloc leaders');
    for (var i = 0; i < Q.parties.length; i++) {
      var b = Q.parties[i];
      var tag = (SW.CONTEST_BLOCS && SW.CONTEST_BLOCS.indexOf(b) >= 0 && SW.firmLabel) ? ' <span class="sb-tag">' + SW.firmLabel(Q, b) + '</span>' : '';
      h += row(bloc(Q, b), (Q[b + '_leader'] || '—') + tag);
    }
    h += '<p class="sb-note">Leaders change with the times. Hardliners vote as a block and hold grudges; pragmatists bargain. See the Holocron.</p>';
    h += head('Our advisors');
    var any = false;
    for (var a in SW.ADVISOR_NAMES) {
      if (Q['adv_' + a]) { h += row(SW.ADVISOR_NAMES[a], SW.FACTION_NAMES[SW.ADVISOR_FACTION[a]]); any = true; }
    }
    if (!any) h += '<p class="sb-note">No advisors. Use Shuffle Leadership.</p>';
    if (Q.anakin_found) {
      h += head('Persons of interest');
      h += row('Anakin Skywalker', Q.anakin_jedi ? (Q.padme_married ? 'Jedi Knight (secretly married)' : 'Jedi') : 'Padawan');
      if (Q.dooku_left && !Q.dooku_dead) h += row('Count Dooku', Q.dooku_movement ? 'Head of the Confederacy' : 'Former Jedi, Count of Serenno');
      if (Q.quigon_alive) h += row('Qui-Gon Jinn', 'Jedi Master');
    }
    return h;
  }


  // Achievements, legacy and summary ----------------------------------------
  SW.ACHIEVEMENTS = [
    ['ending_reborn', 'The Republic Reborn', 'Stop the Sith and restore the Senate\'s authority.'],
    ['ending_endures', 'The Republic Endures', 'Stop the Sith, even if the Republic is left fragile.'],
    ['ending_blood', 'Victory in Blood', 'Win the war for the Republic.'],
    ['ending_divided', 'The Galaxy Divided', 'Keep a Free Republic alive against the Empire.'],
    ['ending_protectorate', 'The Jedi Protectorate', 'See the Jedi rule the Republic.'],
    ['ending_admirals', 'The Admirals\' Republic', 'Destroy the Sith Lord but not his powers.'],
    ['ending_hollow_crown', 'The Hollow Crown', 'Become what you fought.'],
    ['ending_confederacy', 'Confederacy Triumphant', 'Lose the Clone Wars.'],
    ['ending_endless_war', 'The Endless War', 'End the game with the Clone Wars still raging and neither side able to win.'],
    ['ending_dissolved', 'A Republic Dissolved', 'Let the Separatists go in peace.'],
    ['ending_empire', 'The Galactic Empire', 'So this is how liberty dies.'],
    ['caucus_chancellor', 'A Reformer in the Chair', 'Elect a Caucus Supreme Chancellor.'],
    ['term_limit_held', 'Two Terms Means Two Terms', 'Stop the Chancellor\'s term from being extended.'],
    ['sunset', 'Sunset Clause', 'Pass the Sunset Amendment.'],
    ['oversight', 'Civilian Control', 'Bring the clone army under Senate oversight.'],
    ['kamino_early', 'The Missing Planet', 'Find Kamino before the war.'],
    ['no_army', 'No Army of Clones', 'Decommission the clone army.'],
    ['false_flag', 'Fire and Lies', 'Expose the attack on Coruscant as a provocation.'],
    ['gunray_convicted', 'Justice for Naboo', 'Convict Nute Gunray.'],
    ['trust_buster', 'Trust Buster', 'Break up the Trade Federation.'],
    ['abolition', 'No More Chains', 'Abolish slavery in Hutt space.'],
    ['shmi_free', 'A Mother\'s Freedom', 'Free Shmi Skywalker.'],
    ['enfranchised', 'A Voice for the Rim', 'Give the Outer Rim full representation.'],
    ['defence_pact', 'Free Worlds', 'Found the Free Worlds Defence Pact.'],
    ['citizens', 'Brothers and Citizens', 'Grant citizenship to the clone troopers.'],
    ['fives', 'The Warning Heeded', 'Shelter Fives and uncover the chips.'],
    ['chips_removed', 'Free Will', 'Remove every inhibitor chip.'],
    ['federal_compact', 'The Federal Compact', 'End the Clone Wars with a negotiated peace.'],
    ['dooku_turned', 'The Apprentice\'s Betrayal', 'Turn Count Dooku against his master.'],
    ['delegation', 'The Two Thousand', 'Form the Delegation of 2000.'],
    ['unmasked', 'J\'accuse', 'Unmask Darth Sidious before the Senate.'],
    ['restoration', 'Restoration', 'Repeal every emergency power after the Sith fall.'],
    ['anakin_saved', 'The Chosen One', 'End the game with Anakin Skywalker still a Jedi.']
  ];

  SW.achievementsHTML = function (Q, onlyThisGame) {
    var h = '<table class="ach-table">';
    var got = 0;
    for (var i = 0; i < SW.ACHIEVEMENTS.length; i++) {
      var a = SW.ACHIEVEMENTS[i];
      var have = onlyThisGame ? Q['game_achievement_' + a[0]] : Q['achievement_' + a[0]];
      if (have) got++;
      if (onlyThisGame && !have) continue;
      h += '<tr class="' + (have ? 'ach-on' : 'ach-off') + '"><td>' + (have ? '★' : '☆') + '</td><td><b>' + a[1] + '</b><br><span class="achievement_subtitle">' + a[2] + '</span></td></tr>';
    }
    h += '</table>';
    if (!onlyThisGame) h = '<p>' + got + ' of ' + SW.ACHIEVEMENTS.length + ' achievements unlocked.</p>' + h;
    else if (!got) h = '<p class="sb-note">No achievements this game.</p>';
    return h;
  };

  SW.legacyHTML = function (Q) {
    var cards = [
      [Q.slavery_abolished, 'Slavery abolished', 'The slave markets of Hutt space are closed, and those freed will remember who freed them.'],
      [Q.rim_enfranchised, 'The Rim enfranchised', 'The Outer Rim has the voice in the Senate it was denied for a thousand years.'],
      [Q.tf_broken_up, 'The Trade Federation broken up', 'No single guild will ever again command battleships.'],
      [Q.banking_independent || Q.banking_reformed >= 1, 'The banks reformed', 'The Banking Clan is audited, independent and answerable to the law.'],
      [Q.clone_citizenship, 'Clones as citizens', 'Every clone trooper is a citizen of the Republic, with a name and a future.'],
      [Q.jedi_reformed || Q.jedi_independence, 'The Jedi renewed', 'The Order is independent, and wiser about the hearts of its Knights.'],
      [Q.anakin_found && !Q.anakin_fallen && Q.anakin_fall < 8, 'Anakin Skywalker, Jedi Knight', 'The Chosen One never became Darth Vader.'],
      [Q.padme_alive, 'Padmé Amidala lives', 'Senator Amidala lives to see what comes next, and helps to build it.'],
      [Q.anti_corruption, 'An honest Senate', 'The Senate Ethics Commission keeps watch.'],
      [Q.federal_compact, 'The Federal Compact', 'The war ended at the negotiating table, not on a battlefield.']
    ];
    var h = '';
    for (var i = 0; i < cards.length; i++) if (cards[i][0]) h += '<div class="legacy"><b>' + cards[i][1] + '.</b> ' + cards[i][2] + '</div>';
    return h || '<p class="sb-note">The Caucus leaves no lasting reforms behind.</p>';
  };

  SW.summaryHTML = function (Q) {
    var h = '<div class="panel">';
    h += 'Final date: ' + Q.date_label + '<br>';
    h += 'Chancellor: ' + Q.chancellor + '<br>';
    h += 'Ruusan Caucus: ' + (Q.rc_r || 0).toFixed(1) + '% of the Senate<br>';
    h += 'Faith in the Republic: ' + SW.label('faith', Q.faith) + '<br>';
    h += 'Corruption: ' + SW.label('level', Q.corruption) + '<br>';
    h += 'Emergency powers: ' + SW.label('powers', Q.emergency_powers) + '<br>';
    h += 'Our evidence: ' + SW.label('evidence', Q.evidence) + '<br>';
    h += 'Delegations seceded: ' + (Q.seceded_total || 0) + '%';
    return h + '</div>';
  };

  // Charts --------------------------------------------------------------
  SW.drawSenate = function (Q, svgId) {
    if (typeof document === 'undefined' || typeof d3 === 'undefined') return;
    var el = document.getElementById(svgId);
    if (!el) return;
    var width = 500, height = 500;
    var content = document.getElementById('content');
    var screenWidth = content ? content.offsetWidth : 500;
    if (screenWidth < width - 50) { width = screenWidth - 50; height = width; el.style.height = (screenWidth / 2) + 'px'; el.style.width = width + 'px'; }
    var parliament = d3.parliament();
    parliament.width(width).height(height).innerRadiusCoef(0.4);
    parliament.enter.fromCenter(true).smallToBig(true);
    parliament.exit.toCenter(false).bigToSmall(true);
    d3.select('#' + svgId).datum(SW.parliamentData(Q)).call(parliament);
  };

  SW.drawHistory = function (Q, svgId, which) {
    if (typeof document === 'undefined' || typeof d3 === 'undefined' || !d3.linegraph) return;
    var el = document.getElementById(svgId);
    if (!el) return;
    var recs = which === 'senate' ? (Q.senate_records || []) : (Q.support_records || []);
    if (recs.length < 2) return;
    var setup = SW.lineSetup(Q);
    var width = 500;
    var content = document.getElementById('content');
    if (content && content.offsetWidth < width - 50) { width = content.offsetWidth - 50; el.style.width = width + 'px'; }
    var lines = d3.linegraph({noTicks: true, noDots: which !== 'senate', keys: setup.keys, colors: setup.colors, names: setup.names, tickFormat: SW.tickLabel});
    lines.width(width).height(320);
    d3.select('#' + svgId).datum(recs).call(lines);
  };

  SW.parliamentLegend = function (Q) {
    var data = SW.parliamentData(Q);
    var h = '<div class="legend">';
    for (var i = 0; i < data.length; i++) {
      h += '<span class="legend-item"><span class="legend-dot" style="background:' + data[i].color + '"></span>' + data[i].name + ' ' + (Q[data[i].id + '_r'] || 0).toFixed(1) + '%</span>';
    }
    return h + '</div>';
  };
})(typeof window !== 'undefined' ? window : globalThis);
