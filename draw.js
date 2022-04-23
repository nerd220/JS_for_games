// -------------------------------------------------------
//	DRAW
// -------------------------------------------------------

// Добавляет функционал к стандартному Canvas, делая рисование чуть проще

var c=CanvasRenderingContext2D.prototype;

// очистить канву определённым цветом
c.clearAll=function(color,width,height){
	if(typeof(color)=='undefined') color='rgb(0,0,0)';
	if(typeof(width)=='undefined'){
		if(typeof(this.width)=='undefined') width=screen.width;
		else width=this.width;
	}
	if(typeof(height)=='undefined'){
		if(typeof(this.height)=='undefined') height=screen.height;
		else height=this.height;
	}
	this.fillStyle=color;
	this.fillRect(0,0,width,height);
}

// линия
c.line=function(x1,y1,x2,y2){
	this.beginPath();
	this.moveTo(x1,y1);
	this.lineTo(x2,y2);
	this.stroke();
	f.closePath();
}

// круг по координатам центра и радиусу
c.circle=function(x,y,radius){
	this.beginPath();
	this.arc(x,y,radius,0,2*Math.PI);
	this.fill();
	this.closePath();
}

// окружность по координатам центра и радиусу
c.circleStroke=function(x,y,radius){
	this.beginPath();
	this.arc(x,y,radius,0,2*Math.PI);
	this.stroke();
	this.closePath();
}

// круг по левой верхней координате, ширине и высоте
c.circle2=function(x,y,width,height){
	this.beginPath();
	this.ellipse(x,y,width,height, 0, 0, 2*Math.PI);
	this.fill();
	this.closePath();
}

// окружность по левой верхней координате, ширине и высоте
c.circle2Stroke=function(x,y,width,height){
	this.beginPath();
	this.ellipse(x,y,width,height, 0, 0, 2*Math.PI);
	this.stroke();
	this.closePath();
}

// нарисовать картинку с поворотом
c.drawImageRotate=function(image,x,y,angle,imageWidth,imageHeight,rotateType){	
	var canvas=this;
	if(typeof(rotateType)=='undefined') var rotateType='center';
	if(rotateType=='center'){
		var iw, ih;
		if(typeof(imageWidth)=='undefined') iw=image.canvas.width; else iw=imageWidth;
		if(typeof(imageHeight)=='undefined') ih=image.canvas.height; else ih=imageHeight;
		x=x+iw/2;
		y=y+ih/2;
		canvas.translate(x,y);	
		var a=-angle+180;
		canvas.rotate(inRad(a));
		canvas.drawImage(image,-iw/2,-ih/2,iw,ih);
		canvas.rotate(-inRad(a));
		canvas.translate(-x,-y);
	} else canvas.drawImage(image,x,y,iw,ih);
}

// нарисовать текст с учётом выравнивания по горизонтали и вертикали
c.drawText=function(text, x, y, font, size, color, align, valign){
	var canvas=this;
	if(typeof(color)=='undefined') var color='0,0,0';
	if(typeof(font)=='undefined') var font='Arial';
	if(typeof(size)=='undefined') var size='12';
	if(typeof(align)=='undefined') var align='left';
	if(typeof(valign)=='undefined') var valign='top';
	if(color.includes('rgb')) canvas.fillStyle=color;
	else canvas.fillStyle='rgb('+color+')';
	canvas.font = size+'px '+font;
	var ox, oy;
	if(align=='left') ox=x;
	if(align=='center') ox=x-Math.ceil(canvas.measureText(text).width/2);
	if(valign=='top') oy=y;
	if(valign=='middle') oy=y-size/2;
	canvas.fillText(text, ox, oy);
}
