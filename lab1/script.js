// Список функций для выбора
var functions = [   {name: "sin(x)", func: Math.sin},   {name: "x^2", func: function(x) { return Math.pow(x, 2); }}];

// Функция для построения графика
function drawGraph(func) {
   // Получение контекста холста для рисования
   var canvas = document.getElementById("canvas");
   var ctx = canvas.getContext("2d");
   
   // Очистка холста
   ctx.clearRect(0, 0, canvas.width, canvas.height);
   
   // Получение размеров окна вывода
   var width = canvas.width;
   var height = canvas.height;
   
   // Определение диапазона значений по оси X
   var xMin = -width / 2;
   var xMax = width / 2;
   
   // Определение диапазона значений по оси Y
   var yMin = 0;
   var yMax = height;
   
   // Построение графика
   ctx.beginPath();
   ctx.moveTo(xMin, func(xMin));
   for (var x = xMin; x <= xMax; x++) {
      var y = func(x);
      ctx.lineTo(x, y);
   }
   ctx.strokeStyle = "black";
   ctx.stroke();
}

// Обработчик изменения размера окна вывода
window.addEventListener('resize', function() {
   drawGraph(functions[select.selectedIndex].func);
});

// Получение элементов управления
var select = document.getElementById("functionSelect");
var button = document.getElementById("drawButton");

// Добавление функций в список выбора
for (var i = 0; i < functions.length; i++) {
   var option = document.createElement("option");
   option.value = i;
   option.text = functions[i].name;
   select.appendChild(option);
}

// Изначальное построение графика
drawGraph(functions[select.selectedIndex].func);

// Обработчик нажатия кнопки "Построить график"
button.addEventListener('click', function() {
   drawGraph(functions[select.selectedIndex].func);
});