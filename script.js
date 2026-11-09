/**
 * SCRIPT FOR HOMER'S WEB PAGE & MR. X
 * Season 12 Episode 6: "The Computer Wore Menace Shoes"
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const homerPage = document.getElementById('homerPage');
  const mrxPage = document.getElementById('mrxPage');
  const addressInput = document.getElementById('addressInput');
  const windowTitle = document.getElementById('windowTitle');
  const btnSwitchSite = document.getElementById('btnSwitchSite');
  const btnSoundChaos = document.getElementById('btnSoundChaos');
  const soundBtnText = document.getElementById('soundBtnText');
  const linkToMrX = document.getElementById('linkToMrX');
  const btnReturnHomer = document.getElementById('btnReturnHomer');
  const btnBack = document.getElementById('btnBack');
  const btnForward = document.getElementById('btnForward');
  const btnHome = document.getElementById('btnHome');
  const btnReload = document.getElementById('btnReload');
  const statusMessage = document.getElementById('statusMessage');

  // Interactive Features
  const hitCounter = document.getElementById('hitCounter');
  const jesusStage = document.getElementById('jesusStage');
  const btnHallelujah = document.getElementById('btnHallelujah');
  const btnSpawnToaster = document.getElementById('btnSpawnToaster');
  const toasterSpawner = document.getElementById('toasterSpawner');
  const bellBox = document.getElementById('bellBox');
  const btnHomerLaugh = document.getElementById('btnHomerLaugh');

  // Modals
  const guestbookModal = document.getElementById('guestbookModal');
  const btnOpenGuestbook = document.getElementById('btnOpenGuestbook');
  const btnCloseGuestbook = document.getElementById('btnCloseGuestbook');
  const btnAddSignature = document.getElementById('btnAddSignature');
  const gbNameInput = document.getElementById('gbNameInput');
  const gbMsgInput = document.getElementById('gbMsgInput');
  const guestbookEntriesList = document.getElementById('guestbookEntriesList');

  // Mr. X Features
  const btnTips = document.getElementById('btnTips');
  const tipsSection = document.getElementById('tipsSection');
  const btnSendTip = document.getElementById('btnSendTip');
  const tipAuthor = document.getElementById('tipAuthor');
  const tipTitle = document.getElementById('tipTitle');
  const tipContent = document.getElementById('tipContent');
  const tipResponse = document.getElementById('tipResponse');
  const mrxPublishedLeaks = document.getElementById('mrxPublishedLeaks');
  const btnIslandAlert = document.getElementById('btnIslandAlert');
  const islandAlertModal = document.getElementById('islandAlertModal');
  const btnEscapeIsland = document.getElementById('btnEscapeIsland');

  // Hit counter state (cada decena, centena, etc. en su propio recuadro)
  let visits = parseInt(localStorage.getItem('homer_web_hits') || '1', 10);

  function updateCounterDisplay() {
    const minDigits = 7;
    const strVisits = String(visits);
    const totalDigits = Math.max(minDigits, strVisits.length);
    const padded = strVisits.padStart(totalDigits, '0');

    hitCounter.innerHTML = '';
    for (let i = 0; i < padded.length; i++) {
      const digitBox = document.createElement('span');
      digitBox.className = 'digit';
      digitBox.textContent = padded[i];
      hitCounter.appendChild(digitBox);
    }
  }

  updateCounterDisplay();

  // Increment counter on click
  hitCounter.addEventListener('click', () => {
    visits++;
    localStorage.setItem('homer_web_hits', visits);
    updateCounterDisplay();
    window.retroAudio.playSoundByName('bell');
  });

  // Sound Chaos Toggle
  btnSoundChaos.addEventListener('click', () => {
    const isPlaying = window.retroAudio.toggleSound();
    if (isPlaying) {
      soundBtnText.textContent = '🔇 SILENCIAR CAOS';
      btnSoundChaos.classList.add('active');
      statusMessage.textContent = 'Transmitiendo audio MIDI 8-bit de baja calidad a todo volumen...';
    } else {
      soundBtnText.textContent = '📢 ¡ACTIVAR SONIDOS!';
      btnSoundChaos.classList.remove('active');
      statusMessage.textContent = 'Sonidos silenciados (Marge respira aliviada).';
    }
  });

  // Sound Sampler Buttons
  const soundBtns = document.querySelectorAll('.sound-fx-btn');
  soundBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const sound = btn.getAttribute('data-sound');
      window.retroAudio.playSoundByName(sound);
    });
  });

  // Homer Voice / Laugh Quote
  btnHomerLaugh.addEventListener('click', () => {
    window.retroAudio.speakHomerQuote();
  });

  // Ringing Bells Click
  bellBox.addEventListener('click', () => {
    window.retroAudio.playSoundByName('bell');
  });

  // Dancing Jesus Speed-up
  jesusStage.addEventListener('click', () => {
    jesusStage.classList.toggle('speed-up');
    window.retroAudio.playSoundByName('boing');
  });

  btnHallelujah.addEventListener('click', () => {
    jesusStage.classList.add('speed-up');
    window.retroAudio.playSoundByName('cheer');
    setTimeout(() => {
      window.retroAudio.playSoundByName('bell');
    }, 400);
  });

  // Spawn extra flying toasters
  btnSpawnToaster.addEventListener('click', spawnToaster);

  function spawnToaster() {
    window.retroAudio.playSoundByName('whistle');
    const toaster = document.createElement('div');
    toaster.className = 'flying-toaster';
    toaster.style.top = Math.random() * 70 + '%';
    toaster.style.animation = `flyAcross1 ${Math.random() * 5 + 6}s linear forwards`;

    toaster.innerHTML = `
      <div class="toaster-body">
        <div class="toast-slice">🍞</div>
        <div class="toaster-box">⚙️</div>
      </div>
      <div class="toaster-wing wing-left">🪽</div>
      <div class="toaster-wing wing-right">🪽</div>
    `;

    toasterSpawner.appendChild(toaster);

    setTimeout(() => {
      toaster.remove();
    }, 12000);
  }

  // ==============================================
  // GUESTBOOK SYSTEM (PERSISTENT & DYNAMIC)
  // ==============================================
  let savedSignatures = [];
  try {
    savedSignatures = JSON.parse(localStorage.getItem('homer_guestbook_signatures') || '[]');
  } catch (e) {
    savedSignatures = [];
  }

  function renderGuestbookEntry(entry, prepend = false) {
    const newEntry = document.createElement('div');
    newEntry.className = 'gb-entry user-entry';
    newEntry.innerHTML = `
      <span class="tag" style="background:#000080; color:#fff; font-size:9px; padding:1px 4px; margin-right:4px;">NUEVA FIRMA</span>
      <strong>${escapeHtml(entry.name)}:</strong> ${escapeHtml(entry.msg)}
      <span class="gb-entry-meta">(${escapeHtml(entry.time || 'Reciente')})</span>
    `;
    if (prepend) {
      guestbookEntriesList.prepend(newEntry);
    } else {
      guestbookEntriesList.prepend(newEntry);
    }
  }

  // Render previously saved signatures
  savedSignatures.forEach(sig => renderGuestbookEntry(sig, false));

  btnOpenGuestbook.addEventListener('click', () => {
    guestbookModal.classList.remove('hidden');
    window.retroAudio.playSoundByName('boing');
  });

  btnCloseGuestbook.addEventListener('click', () => {
    guestbookModal.classList.add('hidden');
  });

  function handleAddSignature() {
    const name = gbNameInput.value.trim() || 'Internauta Anónimo';
    const msg = gbMsgInput.value.trim();

    if (!msg) {
      alert('¡Escribe al menos un comentario sobre los gifs!');
      return;
    }

    const now = new Date();
    const timeStr = `${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const newEntryObj = { name, msg, time: timeStr };

    savedSignatures.push(newEntryObj);
    localStorage.setItem('homer_guestbook_signatures', JSON.stringify(savedSignatures));

    renderGuestbookEntry(newEntryObj, true);

    gbNameInput.value = '';
    gbMsgInput.value = '';
    guestbookEntriesList.scrollTop = 0;
    window.retroAudio.playSoundByName('cheer');
  }

  btnAddSignature.addEventListener('click', handleAddSignature);
  gbMsgInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleAddSignature();
  });

  // ==============================================
  // SITE NAVIGATION (HOMER vs MR. X)
  // ==============================================

  function showHomerPage() {
    homerPage.classList.remove('hidden-page');
    homerPage.classList.add('active-page');
    mrxPage.classList.remove('active-page');
    mrxPage.classList.add('hidden-page');

    addressInput.value = 'http://www.springfield.net/~homersimpson/';
    windowTitle.textContent = "Netscape Communicator - [Homer's Web Page]";
    btnSwitchSite.textContent = '🕵️ Ir a Mr. X';
    statusMessage.textContent = 'Document: Done (Conexión por módem 56k activa)';
  }

  function showMrXPage() {
    homerPage.classList.remove('active-page');
    homerPage.classList.add('hidden-page');
    mrxPage.classList.remove('hidden-page');
    mrxPage.classList.add('active-page');

    addressInput.value = 'http://www.mrx-springfield.com/investigations/index.html';
    windowTitle.textContent = "Netscape Communicator - [Mr. X's Web Page: All the muck that's fit to rake]";
    btnSwitchSite.textContent = '🍩 Volver a Homer';
    statusMessage.textContent = 'Cifrado de 128 bits activado - Conexión anónima establecida';
  }

  function toggleSites() {
    if (homerPage.classList.contains('active-page')) {
      showMrXPage();
      window.retroAudio.playSoundByName('siren');
    } else {
      showHomerPage();
      window.retroAudio.playSoundByName('doh');
    }
  }

  btnSwitchSite.addEventListener('click', toggleSites);
  linkToMrX.addEventListener('click', (e) => {
    e.preventDefault();
    showMrXPage();
  });
  btnReturnHomer.addEventListener('click', showHomerPage);
  btnHome.addEventListener('click', showHomerPage);
  btnBack.addEventListener('click', showHomerPage);
  btnForward.addEventListener('click', showMrXPage);

  btnReload.addEventListener('click', () => {
    statusMessage.textContent = 'Recargando elementos multimedia...';
    window.retroAudio.playSoundByName('boing');
    setTimeout(() => {
      statusMessage.textContent = 'Document: Done';
    }, 600);
  });

  // ==============================================
  // MR. X LEAKS PUBLISHING SYSTEM (PERSISTENT & DYNAMIC)
  // ==============================================
  let savedLeaks = [];
  try {
    savedLeaks = JSON.parse(localStorage.getItem('mrx_user_leaks') || '[]');
  } catch (e) {
    savedLeaks = [];
  }

  function renderPublishedLeak(leak, prepend = false) {
    const article = document.createElement('article');
    article.className = 'mrx-article user-leak';
    article.innerHTML = `
      <div class="article-meta">
        <span class="tag user">🚨 FILTRACIÓN DE INTERNAUTA</span>
        <span class="date">${escapeHtml(leak.time)} - Primicia anónima</span>
      </div>
      <h3>${escapeHtml(leak.title)}</h3>
      <p class="article-body">${escapeHtml(leak.content)}</p>
      <div class="article-footer">
        <span class="verdict">Veredicto de Mr. X: Publicado en portada sin verificar. Enviado por: <strong>${escapeHtml(leak.author)}</strong>.</span>
      </div>
    `;

    if (prepend) {
      mrxPublishedLeaks.prepend(article);
    } else {
      mrxPublishedLeaks.appendChild(article);
    }
  }

  // Render previously published leaks
  savedLeaks.forEach(leak => renderPublishedLeak(leak, false));

  // Mr. X Tip Submission
  btnTips.addEventListener('click', () => {
    tipsSection.scrollIntoView({ behavior: 'smooth' });
  });

  btnSendTip.addEventListener('click', () => {
    const author = tipAuthor.value.trim() || 'Garganta Profunda de Springfield';
    let title = tipTitle ? tipTitle.value.trim() : '';
    const content = tipContent.value.trim();

    if (!content) {
      alert('¡Mr. X necesita carnaza real o rumores infundados para publicar!');
      return;
    }

    if (!title) {
      // Sensational headline if user didn't write one
      const preview = content.length > 35 ? content.slice(0, 35) + '...' : content;
      title = `¡BOMBAZO EN SPRINGFIELD: ${preview.toUpperCase()}!`;
    }

    const now = new Date();
    const timeStr = `${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const newLeakObj = { author, title, content, time: timeStr };

    savedLeaks.unshift(newLeakObj);
    localStorage.setItem('mrx_user_leaks', JSON.stringify(savedLeaks));

    renderPublishedLeak(newLeakObj, true);

    tipResponse.classList.remove('hidden');
    tipResponse.innerHTML = `
      ✅ <strong>¡Filtración publicada con éxito en portada!</strong><br>
      Tu exclusiva: <em>"${escapeHtml(title)}"</em> ya está en primera plana de Mr. X.<br>
      <a href="#mrxPublishedLeaks" style="color:#00ff66; text-decoration:underline; font-weight:bold;">▲ Subir a ver el artículo publicado</a>
    `;

    if (tipTitle) tipTitle.value = '';
    tipAuthor.value = '';
    tipContent.value = '';

    window.retroAudio.playSoundByName('siren');

    // Smooth scroll to the newly published leak in the feed
    setTimeout(() => {
      mrxPublishedLeaks.scrollIntoView({ behavior: 'smooth' });
    }, 350);
  });

  // The Island Alert Easter Egg
  btnIslandAlert.addEventListener('click', () => {
    islandAlertModal.classList.remove('hidden');
    window.retroAudio.playSoundByName('siren');
    setTimeout(() => {
      window.retroAudio.playSoundByName('whistle');
    }, 800);
  });

  btnEscapeIsland.addEventListener('click', () => {
    islandAlertModal.classList.add('hidden');
    showHomerPage();
    window.retroAudio.playSoundByName('doh');
  });

  // Utilities
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
});
