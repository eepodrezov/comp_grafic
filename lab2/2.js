let image;
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const redCanvas = document.getElementById('redCanvas');
    const redCtx = redCanvas.getContext('2d');
    const greenCanvas = document.getElementById('greenCanvas');
    const greenCtx = greenCanvas.getContext('2d');
    const blueCanvas = document.getElementById('blueCanvas');
    const blueCtx = blueCanvas.getContext('2d');
    const imageInput = document.getElementById('imageInput');

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

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          const redData = new ImageData(canvas.width, canvas.height);
          const greenData = new ImageData(canvas.width, canvas.height);
          const blueData = new ImageData(canvas.width, canvas.height);

          for (let i = 0; i < data.length; i += 4) {
            redData.data[i] = data[i];
            greenData.data[i + 1] = data[i + 1];
            blueData.data[i + 2] = data[i + 2];
            redData.data[i + 3] = greenData.data[i + 3] = blueData.data[i + 3] = data[i + 3];
          }

          redCtx.putImageData(redData, 0, 0);
          greenCtx.putImageData(greenData, 0, 0);
          blueCtx.putImageData(blueData, 0, 0);

          buildHistogram(redData, 'redCanvas');
          buildHistogram(greenData, 'greenCanvas');
          buildHistogram(blueData, 'blueCanvas');
        };
      };

      reader.readAsDataURL(file);
    }

    function buildHistogram(imageData, canvasId) {
      const canvas = document.getElementById(canvasId);
      const ctx = canvas.getContext('2d');
      const data = imageData.data;
      const histogram = new Array(256).fill(0);

      for (let i = 0; i < data.length; i += 4) {
        const value = data[i];
        histogram[value] += 1;
      }

      const maxCount = Math.max(...histogram);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < histogram.length; i++) {
        const height = (histogram[i] / maxCount) * canvas.height;
        ctx.fillStyle = `rgb(${i}, 0, 0)`;
        ctx.fillRect(i, canvas.height - height, 1, height);
      }
    }