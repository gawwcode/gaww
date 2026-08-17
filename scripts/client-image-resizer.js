document.addEventListener('DOMContentLoaded', () => {
  // Simple client-side resizer without external dependencies.
  // Processes images marked with data-auto-resize="true" and replaces them with a smaller WebP blob.

  const lowPower = (() => {
    try {
      const mem = navigator.deviceMemory || 4;
      const cores = navigator.hardwareConcurrency || 4;
      return mem < 2 || cores <= 1;
    } catch (e) {
      return false;
    }
  })();

  if (lowPower) return; // avoid CPU-heavy work on weak devices

  const imgs = Array.from(document.querySelectorAll('img[data-auto-resize="true"]'));
  if (!imgs.length) return;

  // Concurrency-limited resizer: returns a Promise that resolves when done
  const loadAndResize = (img) => {
    return new Promise((resolve) => {
      if (!img.dataset.src) return resolve();
      if (img.dataset._resized) return resolve();

      const displayWidth = Math.max(64, Math.floor(img.clientWidth || img.getBoundingClientRect().width || 300));
      const maxWidth = parseInt(img.dataset.maxwidth || displayWidth, 10);
      const targetWidth = Math.min(displayWidth, maxWidth);

      const quality = Math.max(0.25, Math.min(0.95, parseFloat(img.dataset.quality) || 0.6));

      const full = img.dataset.src;
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = () => {
        const scale = Math.min(1, targetWidth / (image.naturalWidth || targetWidth));
        const canvas = document.createElement('canvas');
        const w = Math.max(1, Math.round((image.naturalWidth || targetWidth) * scale));
        const h = Math.max(1, Math.round((image.naturalHeight || (w * 0.75)) * scale));
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, w, h);

        // toBlob is async and efficient
        canvas.toBlob((blob) => {
          if (!blob) return resolve();
          const url = URL.createObjectURL(blob);
          // preserve the original full src in data-original (if not already set)
          if (!img.dataset.original && img.dataset.src) img.dataset.original = img.dataset.src;
          img.src = url;
          img.dataset._resized = '1';
          // revoke object URL after image loads to free memory
          img.addEventListener('load', () => {
            URL.revokeObjectURL(url);
            resolve();
          }, { once: true });
        }, 'image/webp', quality);
      };
      image.onerror = () => {
        // fallback: use original full image
        img.src = full;
        img.dataset._resized = '1';
        resolve();
      };
      image.src = full;
    });
  };

  // Simple queue to limit concurrent resizes
  const queue = [];
  const MAX_CONCURRENT = 2;
  let activeCount = 0;
  let isPageVisible = true;
  let resumeDelay = 0; // ms delay between starting queued tasks when resuming from background

  const processQueue = () => {
    if (!queue.length) return;
    if (!isPageVisible) return; // don't start new work while hidden

    let startDelay = 0;
    while (activeCount < MAX_CONCURRENT && queue.length) {
      const img = queue.shift();
      if (resumeDelay > 0) {
        // stagger start to avoid CPU spikes when coming back from background
        setTimeout(() => {
          activeCount += 1;
          loadAndResize(img).finally(() => {
            activeCount -= 1;
            processQueue();
          });
        }, startDelay);
        startDelay += resumeDelay;
      } else {
        activeCount += 1;
        loadAndResize(img).finally(() => {
          activeCount -= 1;
          processQueue();
        });
      }
    }
  };

  const enqueue = (img) => {
    // avoid duplicates
    if (img.dataset._queued) return;
    img.dataset._queued = '1';
    queue.push(img);
    processQueue();
  };

  // Use IntersectionObserver to only process images when near viewport
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          enqueue(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '300px' });

    imgs.forEach(img => obs.observe(img));
  } else {
    // Fallback: enqueue all images with a small stagger
    imgs.forEach((img, i) => setTimeout(() => enqueue(img), i * 150));
  }

  // Pause processing when page is hidden; resume with a small stagger when visible
  const onVisibilityChange = () => {
    if (document.hidden) {
      isPageVisible = false;
      // increase delay to be conservative while in background
      resumeDelay = 500;
    } else {
      isPageVisible = true;
      // small stagger to avoid immediate CPU spike
      resumeDelay = 120;
      // resume processing after a short grace period
      setTimeout(() => processQueue(), 200);
    }
  };

  document.addEventListener('visibilitychange', onVisibilityChange);
});
