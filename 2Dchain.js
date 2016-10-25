sqrt = Math.sqrt

function main_2Dchain() {
	var ctx = canvas_1.getContext("2d");	//Рисуем цепочку
	var w = canvas_1.width;
	var h = canvas_1.height;
	
	var ctx2 = canvas_2.getContext("2d");			//создание окна для параметров
	var w2 = canvas_2.width;
	var h2 = canvas_2.height;
	
	var ctx3 = canvas_3.getContext("2d");	//Рисуем график
	var w3 = canvas_3.width;
	var h3 = canvas_3.height;
	
	var a = 0.1;	//Расстояние между частицами
	var k = +(document.getElementById('point_k').value);	//Коэффициент упругости
	var m = 0.01;	//Масса
	
	
	Period = 2 * Math.PI * sqrt( m / k);	//Считаем период одного колебания
	var dts = +(document.getElementById('time').value);
	var dt = dts * Period	//Шаг интегрирования
    var t = 0; var _t = 0;
	
	var N = +(document.getElementById('number_quantity').value);	//Количество частиц
	var nf = point_chain.value - 1;	//номер частицы, на которую действует сила
    
	var F = [N];	//сила
    var U = [N];	//Смещение
    var U1 = [N];	//Скорость
    var U2 = [N];	//Ускорение
    var r = [N];	//Радиус-вектор
	var l1 = 0; var l2 = 0;	//длины пружин
	
	var T = 0; var _T = 0;	//Кинетическая энергия
	var P = 0; var _P = 0;	//Потенциальная энергия
	var E = 0; var _E = 0;	// Максимальная энерния
	
	var rad =  w / ( N - 1 ) / 5	//Радиус частицы
	var b = 13 * w / 70;	//Расстояние от первой(и последней) частицы до края
	var sc = ( w - 2 * b ) / ( N - 1 ) / a;	//Масштаб 

	for(var i = 0; i < N; i++)	//Задаём начальные условия
    {
        r[i] = new Vector(i * a, 0)
		U[i] = new Vector(0, 0);
        U1[i] = new Vector(0, 0);
        U2[i] = new Vector(0, 0);
        F[i] = new Vector(0, 0);
    }
	
	F[nf] = new Vector(+(document.getElementById('number_prX').value), +(document.getElementById('number_prY').value));

	New.onclick = function(){	//Пересчёт
		
		ctx.clearRect(0, 0, w, h);
		ctx3.clearRect(0, 0, w3, h3);
		N = +(document.getElementById('number_quantity').value);
		nf = +(document.getElementById('point_chain').value) - 1;
		k = +(document.getElementById('point_k').value);
		
		Period = 2 * Math.PI * sqrt( m / k);
		dts = +(document.getElementById('time').value);
		dt = dts * Period
		t = 0; _t = 0;
	
	 T = 0;
	 P = 0;
	 E = 0;
	 t = 0;
	 rad =  w / ( N - 1 ) / 5;
	 sc = ( w - 2 * b ) / ( N - 1 ) / a;
	
	for(var i = 0; i < N; i++)
    {
        r[i] = new Vector(i * a, 0);
		U[i] = new Vector(0, 0);
        U1[i] = new Vector(0, 0);
        U2[i] = new Vector(0, 0);
        F[i] = new Vector(0, 0);
		
    }
	
	F[nf] = new Vector(+(document.getElementById('number_prX').value), +(document.getElementById('number_prY').value));
	console.log(abs(F[nf]))
	
	//finish
	}
	
	function control() {
		physics();
		draw();
	}
	function physics() {	//Расчёт
	
		k = +(document.getElementById('point_k').value);
		F[nf] = new Vector(+(document.getElementById('number_prX').value), +(document.getElementById('number_prY').value));
		
		_T = T;
		_P = P;
		T = 0;
		P = 0;
		_t = t;
		t += dt * 5000 / N;
		if(t >= w3) 
		{
			ctx3.clearRect(0, 0, w3, h3);
			t = 0;
			_t = 0;
		}
	
		for(var i = 1; i < N - 1; i++) //Считаем ускорение
        {
			l1 = sqrt( (r[i - 1].x - r[i].x) * (r[i - 1 ].x - r[i].x) + (r[i - 1].y - r[i].y) * (r[i - 1].y - r[i].y) );
			l2 = sqrt( (r[i + 1].x - r[i].x) * (r[i + 1 ].x - r[i].x) + (r[i + 1].y - r[i].y) * (r[i + 1].y - r[i].y) );
			
			U2[i].x = ( k * (r[i-1].x - 2 * r[i].x + r[i+1].x - a * ( (r[i-1].x - r[i].x) / l1 + (r[i+1].x - r[i].x) / l2  ) ) + F[i].x ) / m;
			U2[i].y = ( k * (r[i-1].y - 2 * r[i].y + r[i+1].y - a * ( (r[i-1].y - r[i].y) / l1 + (r[i+1].y - r[i].y) / l2  ) ) + F[i].y ) / m;
        }
		
		for(var i = 1; i < N - 1; i++)	//Считаем скорость 
		{
			U1[i].x += U2[i].x * dt;
			U1[i].y += U2[i].y * dt;
			T += m * ( U1[i].x * U1[i].x + U1[i].y * U1[i].y ) / 2;
		}
		
		_E = E;
		
		for(var i = 1; i < N - 1; i++)	//Считаем перемещение
		{
			r[i].x += U1[i].x * dt;
			r[i].y += U1[i].y * dt;
			
			l1 = sqrt( (r[i - 1].x - r[i].x) * (r[i - 1 ].x - r[i].x) + (r[i - 1].y - r[i].y) * (r[i - 1].y - r[i].y) );

			P += k * ( l1 - a ) * ( l1 - a ) / 2
		}
		
		P += k * ( sqrt( (r[N - 1].x - r[N - 2].x) * (r[N - 1].x - r[N - 2].x) + (r[N - 1].y - r[N - 2].y) * (r[N - 1].y - r[N - 2].y) ) - a ) * ( sqrt( (r[N - 1].x - r[N - 2].x) * (r[N - 1].x - r[N - 2].x) + (r[N - 1].y - r[N - 2].y) * (r[N - 1].y - r[N - 2].y) ) - a ) / 2
		if( (P + T) > E ) E = (P + T);
		
	}
	function draw() {	//Рисование
		ctx.clearRect(0, 0, w, h);
		
		for(var i = 1; i < N; i++){			//Рисуем пружинки
			
			ctx.lineWidth = rad / 4;
			ctx.beginPath();                        
			ctx.strokeStyle = "red"			
			ctx.moveTo( b + r[i-1].x * sc, h / 5 - r[i-1].y * sc);                            
			ctx.lineTo( b + r[i].x * sc, h / 5 - r[i].y * sc);                            
			ctx.stroke();   
			
		}
		
		for(var i = 0; i < N; i++) {
			
			var xS = b + r[i].x * sc;
			var yS =  h / 5 - r[i].y * sc;
			
			var gradient = ctx.createRadialGradient(xS, yS, rad , xS - rad / 5, yS - rad / 5, 0);	//Рисуем градиен для частиц
		    
            gradient.addColorStop(0, "#008201");
            gradient.addColorStop(1, "#00FF02");
            ctx.fillStyle = gradient; 
			
			ctx.beginPath();                                // Рисуем частицы
			ctx.arc(xS, yS, rad, 0, 2*Math.PI, false);
			ctx.closePath();
			ctx.fill(); 
		}
		
		ctx2.clearRect(20,0,w2,h2);	//Вывод параметров

	    ctx2.beginPath();		
		ctx2.moveTo(0, 10);			
		ctx2.lineTo(20, 10);
		ctx2.strokeStyle = '#00CFEB';
		ctx2.lineWidth = '3';	
		ctx2.stroke();

		ctx2.beginPath();
		ctx2.moveTo(0, 30);			
		ctx2.lineTo(20, 30);
		ctx2.strokeStyle = '#FC00A3';
		ctx2.lineWidth = '3';	
		ctx2.stroke();

		ctx2.beginPath();
		ctx2.moveTo(0, 50);			
		ctx2.lineTo(20, 50);
		ctx2.strokeStyle = '#F5D900';
		ctx2.lineWidth = '3';	
		ctx2.stroke();
		
		ctx2.fillText('E_Kin = ' + (T.toFixed(5)) , 30 , 14);
		ctx2.fillText('E_Pot = ' + (P.toFixed(5)), 30 , 34);
		ctx2.fillText('E_Full = ' + ( (T + P).toFixed(5)), 30 , 54);
		
		ctx3.beginPath();	//Рисуем график потенциальной энергии
		ctx3.moveTo(_t, +((h3 - _P.toFixed(10) * h3 / E)));			
		ctx3.lineTo(t, +((h3 - P.toFixed(10) * h3 / E)));
		ctx3.strokeStyle = '#FC00A3';
		ctx3.lineWidth = '2';	
		ctx3.stroke();
		
		ctx3.beginPath();	//Рисуем график кинетической энергии
		ctx3.moveTo(_t, h3 - _T.toFixed(2) * h3 / E );			
		ctx3.lineTo(t, h3 - T.toFixed(2) * h3 / E );
		ctx3.strokeStyle = '#00CFEB';
		ctx3.lineWidth = '2';	
		ctx3.stroke();
		
		ctx3.beginPath();	//Рисуем график полной энергии
		ctx3.moveTo(_t, h3 - (_T + _P).toFixed(10) * h3 / E);			
		ctx3.lineTo(t, h3 - (T + P).toFixed(10) * h3 / E);
		ctx3.strokeStyle = '#F5D900';
		ctx3.lineWidth = '2';	
		ctx3.stroke();	
	}

	
	setInterval(control, 1000 / 60);
	
	
	number_quantity.oninput = function() {	//Ползунок для количества частиц
        slider_quantity.value = number_quantity.value;
    };
    slider_quantity.oninput = function() {
        number_quantity.value = slider_quantity.value;
    };
	
	point_chain.oninput = function() {	//Ползунок для номера частицы с силой
        slider_chain.value = point_chain.value;
    };
    slider_chain.oninput = function() {
        point_chain.value = slider_chain.value;
    };
	
	point_k.oninput = function() {	//Ползунок для жёсткости
        slider_k.value = point_k.value;
    };
    slider_k.oninput = function() {
        point_k.value = slider_k.value;
    };
 
	number_prX.oninput = function() {	//Ползунок для значения F.x
        slider_prX.value = number_prX.value;
    };
    slider_prX.oninput = function() {
        number_prX.value = slider_prX.value;
    };
	
	number_prY.oninput = function() {	//Ползунок для значения F.y
        slider_prY.value = number_prY.value;
    };
    slider_prY.oninput = function() {
        number_prY.value = slider_prY.value;
    };
   
	//пауза
 	var pause_check = false;
 	Pause.onclick = function() {
 		pause_check = !(pause_check);
 	}
	
	function control(){	
 		if (!(pause_check)){
 			physics();
 		}
 		draw();
 	}
}

function Vector(x, y) {	//Вектор
	this.x = x;
	this.y = y;
}
