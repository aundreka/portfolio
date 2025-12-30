
(() => {
  const LOG = "[entrance-anim]";

  
  const DUR = {
    drop: 1000,     
    bounce: 700,    
    stagger: 260,   
    catExtra: 380,  
  };
  const BOUNCE = {
    first: -10,     
    second: -4,     
  };

  
  const getCat = () =>
    document.querySelector('[data-role="cat"]') ||
    document.querySelector('.cat') ||
    document.querySelector('.cat-wrap');

  
  function computeStartY(el) {
    const margin = 30; 
    const rect = el.getBoundingClientRect();
    return -(rect.top + rect.height + margin);
  }

  
  function animate() {
    const pianos = Array.from(
      document.querySelectorAll('model-viewer.piano, .piano')
    );
    const cat = getCat();

    if (pianos.length === 0 && !cat) {
      console.warn(LOG, "No targets found (.piano or cat).");
      return;
    }

    
    const haveAnyTransform = pianos.some(
      el => getComputedStyle(el).transform !== "none"
    );

    const run = () => {
      
      const rootStyle = document.documentElement.style;
      rootStyle.setProperty('--drop-duration', `${DUR.drop}ms`);
      rootStyle.setProperty('--bounce-duration', `${DUR.bounce}ms`);
      rootStyle.setProperty('--stagger', `${DUR.stagger}`);
      rootStyle.setProperty('--cat-extra', `${DUR.catExtra}`);
      rootStyle.setProperty('--bounce-1', `${BOUNCE.first}px`);
      rootStyle.setProperty('--bounce-2', `${BOUNCE.second}px`);

      document.body.classList.add('intro-active');

      const targets = [...pianos];
      if (cat) targets.push(cat);

      
      targets.forEach((el) => {
        const computedTF = getComputedStyle(el).transform; 
        const finalTF = (computedTF && computedTF !== 'none') ? computedTF : 'none';

        
        el.dataset.origInlineTransform = el.style.transform || "";

        
        el.style.setProperty('--finalTF', finalTF);

        const startY = computeStartY(el);
        el.style.setProperty('--startY', `${startY}px`);

        el.classList.add('intro-target');
      });

      
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const root = getComputedStyle(document.documentElement);
          const stagger = parseInt(root.getPropertyValue('--stagger')) || DUR.stagger;
          const drop = DUR.drop;
          const bounce = DUR.bounce;
          const catExtra = parseInt(root.getPropertyValue('--cat-extra')) || DUR.catExtra;

          targets.forEach((el, i) => {
            const isCat = (el === cat);
            const pianoCount = pianos.length;
            const baseIndex = isCat ? pianoCount : i;
            const delay = baseIndex * stagger + (isCat ? catExtra : 0);

            setTimeout(() => {
              if (el.dataset.fellOnce === 'true') return;

              el.classList.add('fall-in');

              const onDone = () => {
                el.classList.remove('fall-in', 'intro-target');
                el.style.removeProperty('--finalTF');
                el.style.removeProperty('--startY');

                
                if (el.dataset.origInlineTransform !== undefined) {
                  el.style.transform = el.dataset.origInlineTransform;
                }
                el.dataset.fellOnce = 'true';
                el.removeEventListener('animationend', onDone);
              };
              el.addEventListener('animationend', onDone, { once: true });
            }, delay);
          });

          
          const total =
            (pianos.length - 1) * stagger +
            (cat ? catExtra : 0) +
            drop + bounce + 100;

          setTimeout(() => {
            document.body.classList.remove('intro-active');
            console.log(LOG, `Intro complete for ${pianos.length} piano(s)${cat ? " + cat" : ""}.`);
          }, total);
        });
      });
    };

    if (!haveAnyTransform) {
      
      setTimeout(run, 0);
    } else {
      run();
    }
  }

  
  if (document.readyState === 'complete') {
    animate();
  } else {
    window.addEventListener('load', animate, { once: true });
  }
})();
