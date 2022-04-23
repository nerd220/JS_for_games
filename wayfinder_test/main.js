
// глобальные переменные
var f, drawTimer;
var drawWidth=1900;
var drawHeight=1000;

// инициализация
function main(){
	f=ini_canvas('main_frame');
	start();
}

// функция рисования
function draw(){
	f.fillStyle='rgb(0,0,0)';
	f.fillRect(0,0,drawWidth,drawHeight);
}

function inRad(num){
	return num * Math.PI / 180;
}

function inDegrees(num){
	return num * (180/Math.PI)
}

function getAngleBy2Points(x1,y1,x2,y2){
	// north is 0
	var a=0;
	if(x2-x1!=0) a=Math.atan((y2-y1)/(x2-x1));
	else a=Math.atan(0);
	var d=90+inDegrees(a);
	if(x1-x2>0) d=180+d;
	return Math.floor(d);
}

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

function getDistance(x1,y1,x2,y2){
	var x=x1-x2;
	var y=y1-y2;
	if(y<0) y=-y;
	if(x<0) x=-x;
	return Math.sqrt(x*x+y*y);
}

function lazyFindWay(x1,y1,x2,y2,width,height,map,tryBackFind,toNearest,checkFunction,radius){
	// tryBackFind - поиск в обратном направлении и сравнение маршрутов
	// toNearest - в случае, если путь не найден, прокладывание маршрута до ближайшей возможной точки
	// radius - в случае, если сектор на карте недоступен, ищет дорогу к ближайшему свободному сектору в указанном радиусе, если не указан - радиус 1
	var cx,cy,nx,ny;
	var wayback=[];
	var visited=[];
	var found=false;
	function isVisited(x,y){
		if(!(x in visited)) return false;
		if(!(y in visited[x])) return false;
		if(visited[x][y]==0) return false;
		return true;
	}
	function setVisited(x,y){
		if(!(x in visited)) visited[x]=[];
		visited[x][y]=1;
	}
	if(typeof(checkFunction)=='undefined')var checkFunction=function(sector){
		return (sector==1);
	}
	if(typeof(radius)=='undefined') var radius=1;
	var multyFind=false;
	if(x2 in map && y2 in map[x2] && checkFunction(map[x2][y2])){
		var mrs=[];
		multyFind=true;
		for(var i=x2-radius;i<=x2+radius;i++)
			for(var j=y2-radius;j<=y2+radius;j++)
				if(i>0 && j>0 && i<width && j<height && (!(i in map) || !(j in map[i]) || !checkFunction(map[i][j]))){
					if(!(i in mrs)) mrs[i]=[];
					mrs[i][j]=1;
				}
	}
	if(typeof(tryBackFind)=='undefined') tryBackFind=0;
	if(typeof(toNearest)=='undefined') toNearest=0;
	if(toNearest==1){
		var nearestD=getDistance(x1,y1,x2,y2);
		var nearestP=[x1,y1];
	}
	cx=x1;
	cy=y1;
	nx=x2;
	ny=y2;
	var dm=[1,-1,2,-2,3,-3,4];
	wayback.push([cx,cy]);
	setVisited(cx,cy);
	while(cx!=nx || cy!=ny){
		if(multyFind==1 && cx in mrs && cy in mrs[cx]){
			found=true;
			break;
		}
		var a=getAngleBy2Points(cx,cy,nx,ny);
		a+=45/2;
		if(a>365) a-=365;
		var d=Math.floor(a/45);
		var dmi=0;		
		var p=coordsByDirection(d,cx,cy);
		var bad=false;
		while(p[0]<0 || p[1]<0 || p[0]>=width || p[1]>=height || (p[0] in map && p[1] in map[p[0]] && checkFunction(map[p[0]][p[1]])) || isVisited(p[0],p[1])){
			if(dmi>=dm.length){
				if(wayback.length>0) wayback.pop();
				if(wayback.length>0){
					cx=wayback[wayback.length-1][0];
					cy=wayback[wayback.length-1][1];
				}
				bad=true;
				break;
			}
			var p=coordsByDirection(d+dm[dmi],cx,cy);
			dmi++;
		}
		if(!bad){
			cx=p[0];
			cy=p[1];
			wayback.push([cx,cy]);
			setVisited(cx,cy);
			if(toNearest==1){
				nearestD2=getDistance(cx,cy,x2,y2);
				if(nearestD2<nearestD){
					nearestP=[cx,cy];
					nearestD=nearestD2;
				}
			}
			if(cx==nx && cy==ny) found=true;
		} else {
			if(wayback.length==0){
				break;
			}
		}
	}
	
	//render visited cells
	for(var x in visited)
		for(var y in visited[x]){
			if(!(x==x2 && y==y2) && !((x==x1 && y==y1))){
				f.fillStyle='rgb(0,255,255)';
				f.fillRect(x*10+150,y*10+50,10,10);
			}
		}
	
	//render not optimized wayback
	for(var key in wayback){
		var x=wayback[key][0];
		var y=wayback[key][1];
		if(!(x==x2 && y==y2) && !((x==x1 && y==y1))){
			f.fillStyle='rgb(255,0,255)';
			f.fillRect(x*10+150,y*10+50,10,10);
		}
	}
	
	//wayback optimization
	var vmap=[];
	for(var i=0;i<wayback.length;i++){
		var x=wayback[i][0];
		var y=wayback[i][1];
		var add=true;
		for(var a=x-1;a<=x+1;a++)
			for(var b=y-1;b<=y+1;b++){
				if( (a in vmap) && (b in vmap[a]) && vmap[a][b]!=0 ){
					var i2=vmap[a][b]-1;
					if(i-i2<2) continue;
					for(var c=i2+1;c<i;c++) vmap[wayback[c][0]][wayback[c][1]]=0;
					wayback.splice(i2+1, i-i2-1);
					i=i2;
					add=false;
					break;
				}
				if(!add) break;
			}
		if(!add) continue;				
		if(!(x in vmap)) vmap[x]=[];
		vmap[x][y]=i+1;
	}
	
	if(tryBackFind==1){
		var waybackTmp=lazyFindWay(x2,y2,x1,y1,width,height,map,0,0,checkFunction,radius);
		if(waybackTmp.length<wayback.length) wayback=waybackTmp;
	}
	
	if(!found){
		if(toNearest==1){
			if(x1==nearestP[0] && y1==nearestP[1]) return false;
			else return lazyFindWay(x1,y1,nearestP[0],nearestP[1],width,height,map,0,0,checkFunction,radius);
		} else return false;
	} else {
		wayback.shift();
		return wayback;
	}
}

// старт игры
function start(){
	//drawTimer=setInterval('draw()',1000/60);
	
	f.fillStyle='rgb(0,0,0)';
	f.fillRect(0,0,drawWidth,drawHeight);
	var map=[];
	var width=80;
	var height=80;
	for(var x=0;x<width;x++){
		map[x]=[];
		for(var y=0;y<height;y++){
			if(rand(0,10)>9) map[x][y]=1; else map[x][y]=0;
			if(map[x][y]==0) f.fillStyle='rgb(255,255,255)';
			else f.fillStyle='rgb(0,0,0)';
			f.fillRect(x*10+150,y*10+50,10,10);
		}
	}
	for(var ho=0;ho<100;ho++){
		var w=rand(3,7);
		var h=rand(3,7);
		var x=rand(0,width-1-w);
		var y=rand(0,height-1-h);
		for(var i=x;i<x+w;i++) for(var j=y;j<y+h;j++){
			map[i][j]=1;
			f.fillStyle='rgb(0,0,0)';
			f.fillRect(i*10+150,j*10+50,10,10);
		}
	}
	while(true){
		var ox=rand(0,width-1);
		var oy=rand(0,height-1);
		var nx=rand(0,width-1);
		var ny=rand(0,height-1);
		if(map[ox][oy]==1 || map[nx][ny]==1 || (nx==ox && ny==oy)) continue;
		break;
	}
	
	f.fillStyle='rgb(0,200,0)';
	f.fillRect(ox*10+150,oy*10+50,10,10);
	f.fillStyle='rgb(200,0,0)';
	f.fillRect(nx*10+150,ny*10+50,10,10);
	
	var r=lazyFindWay(ox,oy,nx,ny,width,height,map,0,1);

	if(!r) document.title='Error'; else {
		for(var key in r){
			var x=r[key][0];
			var y=r[key][1];
			if(!(x==nx && y==ny) && !((x==ox && y==oy))){
				f.fillStyle='rgb(0,0,255)';
				f.fillRect(x*10+150,y*10+50,10,10);
			}
		}
	}
}
