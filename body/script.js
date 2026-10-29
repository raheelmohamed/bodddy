let scene, camera, renderer, starGeometry, stars;
const starCount = 3500;
let starSpeed = 0.8;

function initSpace() {
  const canvas = document.getElementById('space-canvas');
  if (!canvas) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 1;
  camera.rotation.x = Math.PI / 2;

  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  } catch (e) {
    console.error("WebGL error:", e);
    return;
  }

  starGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 2000;
    positions[i + 1] = (Math.random() - 0.5) * 2000;
    positions[i + 2] = (Math.random() - 0.5) * 2000;
  }

  starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1.5,
    transparent: true,
    opacity: 0.85
  });

  stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);

  renderLoop();
}

function renderLoop() {
  requestAnimationFrame(renderLoop);

  if (starGeometry && stars && renderer && scene && camera) {
    const pos = starGeometry.attributes.position.array;

    for (let i = 1; i < starCount * 3; i += 3) {
      pos[i] -= starSpeed;
      if (pos[i] < -1000) {
        pos[i] = 1000;
      }
    }

    starGeometry.attributes.position.needsUpdate = true;
    stars.rotation.y += 0.0008;

    renderer.render(scene, camera);
  }
}

initSpace();

window.addEventListener('resize', () => {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function transitionScreen(fromScreenId, toScreenId) {
  const fromScreen = document.getElementById(fromScreenId);
  const toScreen = document.getElementById(toScreenId);

  if (!fromScreen || !toScreen) return;

  let warpInterval = setInterval(() => {
    if (starSpeed < 26) starSpeed += 1.4;
  }, 25);

  fromScreen.classList.remove('active');

  setTimeout(() => {
    clearInterval(warpInterval);

    let calmInterval = setInterval(() => {
      if (starSpeed > 0.8) {
        starSpeed -= 1.2;
      } else {
        starSpeed = 0.8;
        clearInterval(calmInterval);
      }
    }, 25);

    toScreen.classList.add('active');
  }, 950);
}

const bgm = document.getElementById('bgm');
const audioBtn = document.getElementById('audio-btn');
const audioIcon = document.getElementById('audio-icon');
const audioText = document.getElementById('audio-text');
let isBgmPlaying = false;

if (bgm) bgm.volume = 0.6;

function startAudio() {
  if (!bgm) return;
  bgm.play()
    .then(() => {
      isBgmPlaying = true;
      if (audioIcon) audioIcon.innerText = '🔊';
      if (audioText) audioText.innerText = 'Music On';
    })
    .catch((err) => {
      console.warn("Autoplay blocked:", err);
    });
}

if (audioBtn) {
  audioBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!bgm) return;
    if (isBgmPlaying) {
      bgm.pause();
      if (audioIcon) audioIcon.innerText = '🔈';
      if (audioText) audioText.innerText = 'Music Off';
      isBgmPlaying = false;
    } else {
      startAudio();
    }
  });
}

const enterBtn = document.getElementById('enter-btn');
if (enterBtn) {
  enterBtn.addEventListener('click', () => {
    if (!isBgmPlaying) {
      startAudio();
    }
    transitionScreen('screen-1', 'screen-2');
  });
}

const modal = document.getElementById('app-modal');
const backdrop = document.getElementById('modal-backdrop');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalTag = document.getElementById('modal-tag');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');

let activeCallback = null;

function openModal(tag, title, body, onCloseCallback = null) {
  if (!modal || !backdrop) return;
  modalTag.innerText = tag;
  modalTitle.innerText = title;
  modalBody.innerText = body;
  activeCallback = onCloseCallback;

  modal.classList.add('open');
  backdrop.classList.add('open');
}

function closeModal() {
  if (!modal || !backdrop) return;
  modal.classList.remove('open');
  backdrop.classList.remove('open');

  if (activeCallback) {
    activeCallback();
    activeCallback = null;
  }
}

if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
if (backdrop) backdrop.addEventListener('click', closeModal);

const starData = {
  1: {
    tag: "CONSTELLATION — SIRIUS",
    title: "سيريوس.. ألمع نجوم السما ✨",
    content: "اخترت لك 'سيريوس' لأنها ألمع وأوضح نجمة في السماء كلها؛ وزيها بالظبط، نظرتي ل عبر الرحمن انت الوحيد اللي قدر يقنع قلبي وعقلي بيه باقل مجهووود انت بالنسبالي البطل اللي قدر ينور قلبيي انت الحاجه الوحيده اللي لفتت نظري ف وسط عالم كنت اقتنعت انه خلاص كلهه عتمه.."
  },
  2: {
    tag: "CONSTELLATION — POLARIS (نجم الشمال)",
    title: "بولاريس.. أمان المدار 🧭",
    content: "اخترت لك 'بولاريس' لأنها النجمة الثابتة اللي بيهتدي بيها التايهين في الليل.. واليوم اللي شوفتك فيه بالجواب والورد ونظراتك ليا، حسيت إنك بوصلتي ومكاني الآمن اللي مش هتوه بعده أبداً."
  },
  3: {
    tag: "CONSTELLATION — CAPELLA (العيوق)",
    title: "كابيلا.. سر الضحكة والبهجة 🌟",
    content: "اخترت لك 'كابيلا' لأن نورها نابض بالبهجة والروح الخفيفة؛ بالظبط زي روحك اللي اخف ع قلبيي م الهوا."
  },
  4: {
    tag: "CONSTELLATION — VEGA (النسر الواقع)",
    title: "فيجا.. ملاذ الليل الهادئ 🌌",
    content: "اخترت لك 'فيجا' لأنها أهدى نجمة في سكون الفضاء؛ وزيها بالظبط فكرة الهدوء والامان اللي بحسه ف وجودك مع كل كلمه ونظره بينا زيها زي اول لحظه حسيت فيها ان قلبي وقف ع انه يدور ع نصه التاني لانه خلاص بقا ف قلبه وبين ايديه ..."
  },
  5: {
    tag: "STAR I — YOUR PURE HEART",
    title: "صفة بحبها فيك..",
    content: "بعيداً عن إني بحب كل صفاتك يا بودييي ، بس أكتر صفة ملموسة وساكنة في قلبي.. إنك دايماً حنين على قلبي بشكل مفيش زيه."
  },
  6: {
    tag: "STAR II — UNFORGETTABLE MOMENTS",
    title: "ذكرى عمرها ما هتتنسي..",
    content: "اليوم اللي شوفتك فيه بالجواب والورد مع كل نظرة منك ليا كانت بتطمني.. والكام مرة اللي بنفضل فيهم في الكول للصبح لحد ما ننام سوا بهدوء مع اخر نفس ليك وليا مش هقدر اوصفلك قد اي بكون حاسه بالامان والراحه وبوجودك فعلا اعتقد اللحظات دي مش هتروح م قلبي وعقلي ابدا."
  },
  7: {
    tag: "STAR III — OUR LAUGHTER",
    title: "حاجة بتضحكني معاك..",
    content: "لما بتغني فجأة بصوت غريب ولما بسمع منك جمل زي مساء الانانس ي حلو ي حساس ورحوله الجلب والروح ،اللحظات دي بتبسطني من كل قلبي وكل لحظه معاك بكون فيها اسعد حد ف الدنيا ."
  },
  8: {
    tag: "STAR IV — DETAILS YOU THINK I MISS",
    title: "تفصيلة فاكر إني مش واخدة بالي منها..",
    content: "واخدة بالي بكل تفصيلة بتعملها عشاني، بس فكرة إن برغم يومك الطويل والمُتعب في الشغل، بتختار تنهي يومك معايا.. ومرة قولتلي إن دي الحاجة اللي بتحسسك إنك عايش.. لازم تكون عارف إن حنيتك دي أكتر حاجة بتحسسني بأمان في الدنيا كلها."
  }

};


const revealedStars = new Set();
const starNodes = document.querySelectorAll('.star-node');
const nextOrbitBox = document.getElementById('next-orbit-box');

starNodes.forEach(node => {
  node.addEventListener('click', () => {
    const starId = node.getAttribute('data-star');
    const data = starData[starId];

    if (!data) return;

    openModal(data.tag, data.title, data.content, () => {
      revealedStars.add(Number(starId));
      node.classList.add('revealed');

      for (let i = 1; i <= 7; i++) {
        if (revealedStars.has(i) && revealedStars.has(i + 1)) {
          const line = document.getElementById(`line-${i}-${i + 1}`);
          if (line) line.classList.add('active-line');
        }
      }

      if (revealedStars.size >= 8 && nextOrbitBox) {
        nextOrbitBox.classList.add('visible');
      }
    });
  });
});

const toScreen3Btn = document.getElementById('to-screen-3-btn');
if (toScreen3Btn) {
  toScreen3Btn.onclick = function() {
    document.getElementById('screen-2').classList.remove('active');
    document.getElementById('screen-3').classList.add('active');
  };
}
const envelopeData = {
  tired: {
    tag: "OPEN WHEN — YOU'RE TIRED",
    title: "لما تحس بتعب..",
    content: "افتكر دايماً إن أنا معاك في كل لحظة وكل وقت، وأي وقت هتحتاجني فيه هكون دايماً مستنياك، وإنك ممكن ترتاح في قلبي ومعايا بدون خوف و قلق ابدا."
  },
  bored: {
    tag: "OPEN WHEN — YOU'RE BORED",
    title: "لما تحس بملل..",
    content: "فـ ممكن تشوف التيك توووووك بتوعي مثلااا وممكن نروح سينما وممكن تلكمنيييي مثلاا ودايما هكون ف انتظارك عموما!"
  },
  reminder: {
    tag: "OPEN WHEN — YOU NEED A REMINDER",
    title: "تذكير لقلبك دايماً..",
    content: "خليك فاكر إني دايماً هختار أكون معاك مهما كانت الظروف، وإني دايماً هتمنى أشوفك أنجح وأحسن حد في الدنيا كلها+ انت مش متخيل بس انت ممكن تكون دعوه كنت دايما بدعي ربنا بيها وانت الشخص الوحيد اللي حسيت معاه ان ربنا استجاب للدعوه اللي كنت دايما عندي يقين بيها ان ربنا هيحققها + وانا بكتب الكلام دا حاسه مشاعر كتير ف قلبي منها حب ودفا وابتديت احس ان عايزه اعملك كل حاجه حتي لو بسيطه بس المهم تكون مبسوط ف شكرا ع كل المشاعر اللي انت كنت وماذلت سبب فيها."
  },
  sleep: {
    tag: "OPEN WHEN — BEFORE YOU SLEEP",
    title: "رسالة قبل النوم لبالك الهادي..",
    content: "اطمن وشيل كل الأفكار السلبية من دماغك، وانسي أي حاجة ممكن تكون سبب في زعلك.. واطمن، فيه حد شايفك أنقى قلب في العالم وشايفك ف عيونه انك انت العالم كله."
  }
};


const envelopeCards = document.querySelectorAll('.envelope-card');
envelopeCards.forEach(card => {
  card.addEventListener('click', () => {
    const key = card.getAttribute('data-envelope');
    const data = envelopeData[key];
    if (data) {
      openModal(data.tag, data.title, data.content);
    }
  });
});

const toScreen4Btn = document.getElementById('to-screen-4-btn');
if (toScreen4Btn) {
  toScreen4Btn.addEventListener('click', () => {
    transitionScreen('screen-3', 'screen-4');
  });
}

const voiceNote = document.getElementById('voice-note');
const voicePlayBtn = document.getElementById('voice-play-btn');
const voiceBtnIcon = document.getElementById('voice-btn-icon');
const audioWaves = document.getElementById('audio-waves');
const voiceStatus = document.getElementById('voice-status');

if (voicePlayBtn && voiceNote) {
  voicePlayBtn.addEventListener('click', () => {
    if (voiceNote.paused) {
      if (isBgmPlaying && bgm) bgm.volume = 0.2;

      const playPromise = voiceNote.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (voiceBtnIcon) voiceBtnIcon.innerText = '❚❚';
            if (audioWaves) audioWaves.classList.add('playing');
            if (voiceStatus) voiceStatus.innerText = 'Playing voice message...';
          })
          .catch((err) => {
            console.warn("Audio file missing:", err);
            if (voiceStatus) voiceStatus.innerText = 'ملف الصوت غير موجود';
          });
      }
    } else {
      voiceNote.pause();
      if (voiceBtnIcon) voiceBtnIcon.innerText = '▶';
      if (audioWaves) audioWaves.classList.remove('playing');
      if (voiceStatus) voiceStatus.innerText = 'Paused';
      if (isBgmPlaying && bgm) bgm.volume = 0.6;
    }
  });

  voiceNote.addEventListener('ended', () => {
    if (voiceBtnIcon) voiceBtnIcon.innerText = '▶';
    if (audioWaves) audioWaves.classList.remove('playing');
    if (voiceStatus) voiceStatus.innerText = 'Finished listening';
    if (isBgmPlaying && bgm) bgm.volume = 0.6;
  });
}

const toScreen5Btn = document.getElementById('to-screen-5-btn');
if (toScreen5Btn) {
  toScreen5Btn.addEventListener('click', () => {
    if (voiceNote && !voiceNote.paused) {
      voiceNote.pause();
      if (isBgmPlaying && bgm) bgm.volume = 0.6;
    }
    transitionScreen('screen-4', 'screen-5');
  });
}

const toScreen6Btn = document.getElementById('to-screen-6-btn');
if (toScreen6Btn) {
  toScreen6Btn.addEventListener('click', () => {
    transitionScreen('screen-5', 'screen-6');
  });
}

const revealBtn = document.getElementById('reveal-answer-btn');
const realAnswer = document.getElementById('real-answer');
const restartBtn = document.getElementById('restart-journey-btn');
const openStoryBtn = document.getElementById('open-story-btn');

if (revealBtn) {
  revealBtn.addEventListener('click', () => {
    if (realAnswer) realAnswer.classList.add('revealed');
    revealBtn.style.display = 'none';

    if (openStoryBtn) {
      setTimeout(() => {
        openStoryBtn.style.display = 'inline-block';
      }, 500);
    }

    if (restartBtn) {
      setTimeout(() => {
        restartBtn.style.display = 'inline-block';
      }, 900);
    }

    if (stars && stars.material) {
      stars.material.size = 2.4;
    }
  });
}

if (restartBtn) {
  restartBtn.addEventListener('click', () => {
    location.reload();
  });
}

const storyModal = document.getElementById('story-modal');
const storyBackdrop = document.getElementById('story-modal-backdrop');
const storyCloseBtn = document.getElementById('story-close-btn');

if (openStoryBtn && storyModal && storyBackdrop) {
  openStoryBtn.addEventListener('click', () => {
    storyModal.classList.add('open');
    storyBackdrop.classList.add('open');
  });

  const closeStory = () => {
    storyModal.classList.remove('open');
    storyBackdrop.classList.remove('open');
  };

  if (storyCloseBtn) storyCloseBtn.addEventListener('click', closeStory);
  storyBackdrop.addEventListener('click', closeStory);
}