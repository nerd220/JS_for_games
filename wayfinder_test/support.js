function rand(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// загрузка изображения
var li_total=0;
var li_ready=0;
var li_over=0;
var li_func=0;
function load_img(f,last,on_over){
	li_total++;
	if(last) li_over=1;
	if(on_over) li_func=on_over;
	var image=new Image();
	//image.crossOrigin="anonymous";
	image.onload=function(){
		li_ready++;
		if(li_ready==li_total && li_func) li_func();
	};
	image.src = f;
	return image;
}

function ini_canvas(id){
	var frameCanvas=document.getElementById(id);
	frameCanvas.style.width=(document.body.clientWidth-20)+'px';
	frameCanvas.style.height=(document.body.clientHeight-20)+'px'; 
	frameCanvas.width=document.body.clientWidth;
	frameCanvas.height=document.body.clientHeight;
	var f=frameCanvas.getContext('2d');
	//f.scale(frameCanvas.width/drawWidth,frameCanvas.height/drawHeight);
	return f;
}
