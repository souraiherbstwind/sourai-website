(function(){
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- キラキラ映像:毎フレームCanvasへ転写してスクリーン合成(Safari対策) ---- */
  var glitter = document.getElementById('glitter');
  var gCanvas = document.getElementById('glitter-canvas');
  if(glitter && gCanvas && !reduced){
    var gCtx = gCanvas.getContext('2d');
    gCtx.imageSmoothingEnabled = true;
    gCtx.imageSmoothingQuality = 'high';
    var gDPR = Math.min(window.devicePixelRatio || 1, 2);
    function sizeGlitterCanvas(){
      gCanvas.width = innerWidth * gDPR;
      gCanvas.height = innerHeight * gDPR;
    }
    sizeGlitterCanvas();
    addEventListener('resize', sizeGlitterCanvas);

    try{
      glitter.src = 'assets/video/glitter.mp4';
      glitter.playbackRate = 0.6;   /* ゆっくり瞬かせる */
      var tryPlay = function(){
        glitter.playbackRate = 0.6;
        var p = glitter.play();
        if(p && p.catch) p.catch(function(){});
      };
      tryPlay();
      addEventListener('pointerdown', tryPlay, {once:true});
      addEventListener('touchstart', tryPlay, {once:true});
      /* iOSはタブ切替や画面ロックで動画を自動停止するが、復帰時に再開はしてくれない。
         放置するとエフェクトが最後のフレームで固まる */
      document.addEventListener('visibilitychange', function(){
        if(!document.hidden && glitter.paused) tryPlay();
      });
      addEventListener('pageshow', function(){ if(glitter.paused) tryPlay(); });

      /* 転写は30fpsに制限する。動画は0.6倍速再生で実質15〜18fpsしか新フレームが
         ないため見た目は変わらず、全画面転写の負荷(発熱)が半分になる */
      var lastDraw = 0;
      var drawFrame = function(t){
        if(t - lastDraw >= 31 && glitter.readyState >= 2 && !glitter.paused && glitter.videoWidth){
          lastDraw = t;
          var vw = glitter.videoWidth, vh = glitter.videoHeight;
          var cw = gCanvas.width, ch = gCanvas.height;
          var scale = Math.max(cw/vw, ch/vh);
          var dw = vw*scale, dh = vh*scale;
          gCtx.clearRect(0,0,cw,ch);
          gCtx.drawImage(glitter, (cw-dw)/2, (ch-dh)/2, dw, dh);
        }
        requestAnimationFrame(drawFrame);
      };
      requestAnimationFrame(drawFrame);
    }catch(e){ gCanvas.style.display = 'none'; }
  }else if(gCanvas){
    gCanvas.style.display = 'none';
  }

  /* ---- 代表作:クリックでその場再生 ---- */
  document.querySelectorAll('.video[data-yt]').forEach(function(v){
    function playVideo(){
      if(v.classList.contains('playing')) return;
      v.classList.add('playing');
      var thumb = v.querySelector('.thumb');
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube.com/embed/' + v.getAttribute('data-yt') + '?autoplay=1&rel=0';
      f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      f.allowFullscreen = true;
      f.title = v.getAttribute('aria-label') || 'video';
      thumb.appendChild(f);
    }
    v.addEventListener('click', playVideo);
    v.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); playVideo(); }
    });
  });

  /* ---- 金の光塵がさりげなく舞う ----
     極小の砂粒(芯あり・多数)と大きく淡いボケ玉(少数)の二階層。
     群れの中心の周りにガウス分布で湧くので、むらのある自然な密度になる */
  var dust = document.getElementById('dust');
  if(dust && !reduced){
    var dCtx = dust.getContext('2d');
    var dDPR = Math.min(window.devicePixelRatio || 1, 2);
    var motes = [];
    /* 群れの中心(体の両脇の帯) */
    var clusters = [
      {x:.18, y:.56}, {x:.72, y:.5}, {x:.24, y:.86}, {x:.66, y:.82}
    ];
    function gauss(){ return (Math.random()+Math.random()+Math.random())/3 - .5; }

    function sizeDust(){
      var r = dust.getBoundingClientRect();
      dust.width = Math.max(1, r.width * dDPR);
      dust.height = Math.max(1, r.height * dDPR);
    }
    function newMote(fresh){
      var c = clusters[Math.floor(Math.random()*clusters.length)];
      var big = Math.random() < .18;   /* 18%は大きなボケ玉 */
      return {
        x0: c.x + gauss() * .28,
        y0: c.y + gauss() * .3,
        rise: (big ? .016 : .04) + Math.random() * (big ? .024 : .06),
        drift: 0,   /* 右上に流れる横成分(下で rise から算出) */
        swayAmp: .006 + Math.random() * .014,
        swayF: .25 + Math.random() * .5,
        phase: Math.random() * Math.PI * 2,
        big: big,
        r: big ? (7 + Math.random() * 13) : (.5 + Math.random() * 1.3),
        life: 4 + Math.random() * 5,
        t0: performance.now()/1000 + (fresh ? 0 : -Math.random() * 10),
        peak: big ? (.05 + Math.random() * .08) : (.25 + Math.random() * .4),
        tint: Math.random() < .85
          ? (Math.random() < .5 ? '238,209,150' : '224,186,120')  /* 金 */
          : '235,238,252'                                          /* たまに白銀 */
      };
    }
    function finalizeMote(m){
      /* 星屑動画と同じ「右上へ」の気流。上昇量に対して横流れをやや強めに */
      m.drift = m.rise * (1.1 + Math.random() * .7);
      return m;
    }
    function drawDust(){
      var now = performance.now()/1000;
      dCtx.clearRect(0, 0, dust.width, dust.height);
      for(var i = 0; i < motes.length; i++){
        var m = motes[i];
        var p = (now - m.t0) / m.life;
        if(p >= 1){ motes[i] = finalizeMote(newMote(true)); continue; }
        if(p < 0) continue;
        var a = Math.sin(p * Math.PI) * m.peak;
        var x = (m.x0 + m.drift * (now - m.t0) + Math.sin(now * m.swayF + m.phase) * m.swayAmp) * dust.width;
        var y = (m.y0 - m.rise * (now - m.t0)) * dust.height;
        var r = m.r * dDPR;
        if(m.big){
          /* 淡いボケ玉:輪郭のやわらかい円盤 */
          var g = dCtx.createRadialGradient(x, y, 0, x, y, r);
          g.addColorStop(0, 'rgba(' + m.tint + ',' + a + ')');
          g.addColorStop(.75, 'rgba(' + m.tint + ',' + (a * .7) + ')');
          g.addColorStop(1, 'rgba(' + m.tint + ',0)');
          dCtx.fillStyle = g;
          dCtx.beginPath(); dCtx.arc(x, y, r, 0, Math.PI * 2); dCtx.fill();
        }else{
          /* 砂粒:小さな芯 + にじみ */
          var g2 = dCtx.createRadialGradient(x, y, 0, x, y, r * 4);
          g2.addColorStop(0, 'rgba(' + m.tint + ',' + a + ')');
          g2.addColorStop(.25, 'rgba(' + m.tint + ',' + (a * .5) + ')');
          g2.addColorStop(1, 'rgba(' + m.tint + ',0)');
          dCtx.fillStyle = g2;
          dCtx.beginPath(); dCtx.arc(x, y, r * 4, 0, Math.PI * 2); dCtx.fill();
        }
      }
      requestAnimationFrame(drawDust);
    }
    sizeDust();
    addEventListener('resize', sizeDust);
    var COUNT = 44;
    for(var mi = 0; mi < COUNT; mi++) motes.push(finalizeMote(newMote(false)));
    requestAnimationFrame(drawDust);
  }else if(dust){
    dust.style.display = 'none';
  }

  /* ---- お問い合わせテンプレートのコピー ---- */
  var copyBtn = document.getElementById('copy-tpl');
  if(copyBtn){
    copyBtn.addEventListener('click', function(){
      var en = document.documentElement.classList.contains('en');
      var text = document.getElementById(en ? 'tpl-en' : 'tpl-ja').textContent;
      function done(){
        copyBtn.classList.add('done');
        setTimeout(function(){ copyBtn.classList.remove('done'); }, 2200);
      }
      /* クリック直後(ユーザー操作が有効なうち)に同期の旧方式を先に試す。
         非同期のClipboard APIを先にすると、拒否されたときには操作の有効期限が
         切れていて旧方式も失敗するため、この順序が重要 */
      var ok = false;
      try{
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed'; ta.style.opacity = '0';
        ta.setAttribute('readonly', '');
        document.body.appendChild(ta);
        ta.select();
        ta.setSelectionRange(0, text.length);
        ok = document.execCommand('copy');
        document.body.removeChild(ta);
      }catch(e){ ok = false; }
      if(ok){
        done();
      }else if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(text).then(done, function(){});
      }
    });
  }

  /* ---- 言語切り替え ---- */
  function setLang(en){
    document.documentElement.classList.toggle('en', en);
    document.documentElement.lang = en ? 'en' : 'ja';
    try{ localStorage.setItem('sourai-lang', en ? 'en' : 'ja'); }catch(e){}
    /* 表示切り替えで未発火のrevealが残らないよう全部表示扱いに */
    document.querySelectorAll('.reveal, .entry').forEach(function(el){ el.classList.add('in'); });
    if (typeof drawConstellation === 'function') requestAnimationFrame(drawConstellation);
  }
  document.querySelectorAll('[data-lang-toggle]').forEach(function(btn){
    btn.addEventListener('click', function(){
      setLang(!document.documentElement.classList.contains('en'));
    });
  });

  /* ---- 発光レイヤーに本体と同じ画像を流用 ----
     本体は<picture>(WebP優先)のため、実際に選ばれたcurrentSrcを使う。
     読み込み前でcurrentSrcが未確定なら、loadを待ってから流用する
     (srcで先に流用するとPNGとWebPの二重ダウンロードになる) */
  document.querySelectorAll('.hero-figure img.glow').forEach(function(g){
    var main = g.parentElement.querySelector('img:not(.glow)');
    if(!main) return;
    function apply(){ g.src = main.currentSrc || main.src; }
    if(main.complete && main.currentSrc){ apply(); }
    else{ main.addEventListener('load', apply, {once:true}); }
  });

  /* ---- ハンバーガーメニュー ---- */
  var menuBtn = document.getElementById('menu-btn');
  var mobileMenu = document.getElementById('mobile-menu');
  if(menuBtn && mobileMenu){
    function setMenu(open){
      menuBtn.classList.toggle('open', open);
      mobileMenu.classList.toggle('open', open);
      /* メニュー展開中はナビの背景を消してオーバーレイ1枚に統一する(CSS側で参照) */
      document.documentElement.classList.toggle('menu-open', open);
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      mobileMenu.setAttribute('aria-hidden', open ? 'false' : 'true');
    }
    menuBtn.addEventListener('click', function(){
      setMenu(!mobileMenu.classList.contains('open'));
    });
    mobileMenu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ setMenu(false); });
    });
  }

  /* ---- 折りたたみ見出しのフォーカス枠 ----
     Safariはマウスクリックでもsummaryにフォーカス枠を出し続けるため、
     ポインタ操作のときだけフォーカスを外す。キーボード操作(Enter/Space)では
     pointerupが発火しないので、:focus-visibleの枠はそのまま残る */
  document.querySelectorAll('summary').forEach(function(s){
    s.addEventListener('pointerup', function(){
      requestAnimationFrame(function(){ s.blur(); });
    });
  });

  /* ---- 実績の星をつなぐ星座線 ---- */
  function drawConstellation(){
    var tl = document.getElementById('timeline');
    if(!tl) return;
    var svg = tl.querySelector('svg');
    var nodes = tl.querySelectorAll('.node');
    if(nodes.length < 2){ svg.innerHTML=''; return; }
    svg.setAttribute('viewBox', '0 0 ' + tl.offsetWidth + ' ' + tl.offsetHeight);
    /* getBoundingClientRectはアニメーション中のtransformを拾ってしまうので、
       レイアウト座標(offset)を積み上げて星の中心を求める */
    function centerOf(el){
      var x = el.offsetWidth/2, y = el.offsetHeight/2;
      while(el && el !== tl){
        x += el.offsetLeft;
        y += el.offsetTop;
        el = el.offsetParent;
      }
      return {x:x, y:y};
    }
    var pts = [];
    nodes.forEach(function(n){ pts.push(centerOf(n)); });
    var html = '';
    for(var i=0;i<pts.length-1;i++){
      html += '<line x1="'+pts[i].x+'" y1="'+pts[i].y+'" x2="'+pts[i+1].x+'" y2="'+pts[i+1].y+'"/>';
    }
    svg.innerHTML = html;
  }

  /* ---- ナビ背景 ---- */
  var nav = document.getElementById('nav');
  var scrollHint = document.querySelector('.scroll-hint');
  function onScroll(){
    nav.classList.toggle('scrolled', scrollY > 40);
    if(scrollHint) scrollHint.classList.toggle('hidden', scrollY > 60);
  }
  addEventListener('scroll', onScroll, {passive:true});

  /* ---- スクロールで浮かび上がる ---- */
  var targets = document.querySelectorAll('.reveal, .entry');
  if(reduced || !('IntersectionObserver' in window)){
    targets.forEach(function(el){ el.classList.add('in'); });
  }else{
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, {threshold:.15});
    targets.forEach(function(el){ io.observe(el); });
  }

  addEventListener('resize', drawConstellation);
  addEventListener('load', drawConstellation);
  document.fonts && document.fonts.ready.then(drawConstellation);
  drawConstellation();
  onScroll();
})();
