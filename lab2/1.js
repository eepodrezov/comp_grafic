let image;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const grayscaleCanvas1 = document.getElementById('grayscaleCanvas1');
const ctx1 = grayscaleCanvas1.getContext('2d');
const grayscaleCanvas2 = document.getElementById('grayscaleCanvas2');
const ctx2 = grayscaleCanvas2.getContext('2d');
const differenceCanvas = document.getElementById('differenceCanvas');
const diffCtx = differenceCanvas.getContext('2d');
const imageInput = document.getElementById('imageInput');

function loadImage() {
  const file = imageInput.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    image = new Image();
    image.src = e.target.result;
    image.onload = function () {
      canvas.width = grayscaleCanvas1.width = grayscaleCanvas2.width = differenceCanvas.width = image.width;
      canvas.height = grayscaleCanvas1.height = grayscaleCanvas2.height = differenceCanvas.height = image.height;

      ctx.drawImage(image, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Преобразование изображения в оттенки серого по первой формуле
      for (let i = 0; i < data.length; i += 4) {
        const grayValue1 = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        data[i] = data[i + 1] = data[i + 2] = grayValue1;
      }
      ctx1.putImageData(imageData, 0, 0);
      buildHistogram(imageData, 'grayscaleCanvas1');

      // Преобразование изображения в оттенки серого по второй формуле
      for (let i = 0; i < data.length; i += 4) {
        const grayValue2 = 0.21 * data[i] + 0.72 * data[i + 1] + 0.07 * data[i + 2];
        data[i] = data[i + 1] = data[i + 2] = grayValue2;
      }
      ctx2.putImageData(imageData, 0, 0);
      buildHistogram(imageData, 'grayscaleCanvas2');

      // Находим разность полутоновых изображений
      const diffImageData = ctx1.getImageData(0, 0, grayscaleCanvas1.width, grayscaleCanvas1.height);
      const diffData = diffImageData.data;

      for (let i = 0; i < diffData.length; i += 4) {
        diffData[i] = Math.abs(diffData[i] - data[i]);
        diffData[i + 1] = Math.abs(diffData[i + 1] - data[i + 1]);
        diffData[i + 2] = Math.abs(diffData[i + 2] - data[i + 2]);
      }
      diffCtx.putImageData(diffImageData, 0, 0);
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
    ctx.fillStyle = `rgb(${i}, ${i}, ${i})`;
    ctx.fillRect(i, canvas.height - height, 1, height);
  }
}