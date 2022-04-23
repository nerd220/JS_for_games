// -------------------------------------------------------
//	IMAGES LOADING
// -------------------------------------------------------
//
// load all img with loadImg(src)
// load last img with loadImg(src, 1, function on load all imgs)
//
// -------------------------------------------------------

var liTotal=0;
var liReady=0;
var liOver=0;
var liFunc=0;
function loadImg(f,last,onOver){
	liTotal++;
	if(last) liOver=1;
	if(onOver) liFunc=onOver;
	var image=new Image();
	//image.crossOrigin="anonymous";
	image.onload=function(){
		liReady++;
		if(liReady==liTotal && liFunc) liFunc();
	};
	image.src = f;
	return image;
}
