let image;
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const imageInput = document.getElementById('imageInput');
    const hueInput = document.getElementById('hue');
    const saturationInput = document.getElementById('saturation');
    const brightnessInput = document.getElementById('brightness');

    function loadImage() {
      const file = imageInput.files[0];
      const reader = new FileReader();

      reader.onload = function (e) {
        image = new Image();
        image.src = e.target.result;
        image.onload = function () {
          canvas.width = image.width;
          canvas.height = image.height;
          ctx.drawImage(image, 0, 0);
          updateImage();
        };
      };

      reader.readAsDataURL(file);
    }

    function updateImage() {
      const hue = hueInput.value;
      const saturation = saturationInput.value;
      const brightness = brightnessInput.value;

      ctx.drawImage(image, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const hsv = rgbToHsv(data[i], data[i + 1], data[i + 2]);
        hsv.h += hue;
        hsv.s += saturation;
        hsv.v += brightness;

        const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);

        data[i] = rgb.r;
        data[i + 1] = rgb.g;
        data[i + 2] = rgb.b;
      }

      ctx.putImageData(imageData, 0, 0);
    }

    function rgbToHsv(r, g, b) {
      r /= 255;
      g /= 255;
      b /= 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const delta = max - min;

      let h, s, v;

      if (delta === 0) {
        h = 0;
      } else if (max === r) {
        h = ((g - b) / delta) % 6;
      } else if (max === g) {
        h = (b - r) / delta + 2;
      } else {
        h = (r - g) / delta + 4;
      }

      h = Math.round(h * 60);
      if (h < 0) {
        h += 360;
      }

      s = max === 0 ? 0 : Math.round((delta / max) * 100);
      v = Math.round((max) * 100);

      return { h, s, v };
    }

    function hsvToRgb(h, s, v) {
      const c = (v / 100) * (s / 100);
      const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
      const m = (v / 100) - c;

      let r, g, b;

      if (h >= 0 && h < 60) {
        r = c;
        g = x;
        b = 0;
      } else if (h >= 60 && h < 120) {
        r = x;
        g = c;
        b = 0;
      } else if (h >= 120 && h < 180) {
        r = 0;
        g = c;
        b = x;
      } else if (h >= 180 && h < 240) {
        r = 0;
        g = x;
        b = c;
      } else if (h >= 240 && h < 300) {
        r = x;
        g = 0;
        b = c;
      } else {
        r = c;
        g = 0;
        b = x;
      }

      r = Math.round((r + m) * 255);
      g = Math.round((g + m) * 255);
      b = Math.round((b + m) * 255);

      return { r, g, b };
    }