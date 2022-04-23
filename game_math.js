// проверка пересечения двух отрезков
function lineIntersect(ax1,ay1,ax2,ay2,bx1,by1,bx2,by2){
	var v1=(bx2-bx1)*(ay1-by1)-(by2-by1)*(ax1-bx1);
	var v2=(bx2-bx1)*(ay2-by1)-(by2-by1)*(ax2-bx1);
	var v3=(ax2-ax1)*(by1-ay1)-(ay2-ay1)*(bx1-ax1);
	var v4=(ax2-ax1)*(by2-ay1)-(ay2-ay1)*(bx2-ax1);
	return (v1*v2<0) && (v3*v4<0) && !(ax1 == bx1 && ay1 == by1 || ax1 == bx1 && ay1 == by1 || ax2 == bx1 && ay2 == by1 || ax1 == bx2 && ay1 == by2 || ax2 == bx2 && ay2 == by2);
}

// проверка на вхождение точки в полигон
function pointInPolygon(point,polygon){
	var counter=0;
	for(var i=0;i<polygon.length;i++){
		if(i==polygon.length-1) var sx=polygon[0].x; else var sx=polygon[i+1].x;
		if(i==polygon.length-1) var sy=polygon[0].y; else var sy=polygon[i+1].y;
		if(lineIntersect(polygon[i].x,polygon[i].y,sx,sy,-10,-10,point.x,point.y)) counter++;
	}
	if(counter==0) return false;
	return (counter%2==1);
}

// проверка на пересечение двух полигонов
function polygonIntersectsPolygon(polygon,polygon2){
	for(var i=0;i<polygon.length;i++){
		if(i==polygon.length-1) var sx=polygon[0].x; else var sx=polygon[i+1].x;
		if(i==polygon.length-1) var sy=polygon[0].y; else var sy=polygon[i+1].y;
		for(var i2=0;i2<polygon2.length;i2++){
			if(i2==polygon2.length-1) var sx2=polygon2[0].x; else var sx2=polygon2[i2+1].x;
			if(i2==polygon2.length-1) var sy2=polygon2[0].y; else var sy2=polygon2[i2+1].y;
			if(lineIntersect(polygon[i].x,polygon[i].y,sx,sy,polygon2[i2].x,polygon2[i2].y,sx2,sy2)) return true;
		}			
	}
	return false;
}

// выдать градус поворота отрезка (0 это север)
function getAngleBy2Points(x1,y1,x2,y2){
	// north is 0
	var a=0;
	if(x2-x1!=0) a=Math.atan((y2-y1)/(x2-x1));
	else a=Math.atan(0);
	var d=90+inDegrees(a);
	if(x1-x2>0) d=180+d;
	return Math.floor(d);
}

// выдать новые координаты по сдвигу в одном из 9 направлений
function coordsByDirection(direction,x,y){
	var newX=x;
	var newY=y;
	if(direction>7) direction-=8;
	if(direction<0) direction+=8;
	if(direction==0) newY--;
	if(direction==1){ newY--; newX++; }
	if(direction==2) newX++;
	if(direction==3) {newX++; newY++;}
	if(direction==4) newY++;
	if(direction==5) {newX--; newY++;}
	if(direction==6) newX--;
	if(direction==7) {newX--; newY--;}
	return [newX,newY];
}

// расстояние между двумя точками
function getDistance(x1,y1,x2,y2){
	var x=x1-x2;
	var y=y1-y2;
	if(y<0) y=-y;
	if(x<0) x=-x;
	return Math.sqrt(x*x+y*y);
}
