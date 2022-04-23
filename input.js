// -------------------------------------------------------
//	KEYBOARD INPUT
// -------------------------------------------------------
//
// addKeyTimerEvent	(key - key or keycode 'up, down, space' etc, action - function, interval - 1/1000 second 33 default, startNow - start first action on key down before timer 0 default)
// removeKeyTimerEvent	(key - key or keycode)
// addKeyEvent			(key - key or keycode, action - function, type - 'up', 'down', 'up/down' default 'up')
//
// -------------------------------------------------------

//
// помогает перехватывать события при нажатии, зажатии клавиш
//
// например, addTimerEvent('space',()=>{some function}, 33);
// добавит вызов функции каждые 0.033 секунды при удержании пробела

var timers=[];
var timersStatus=[];
var events=[];
var timerEvents=[];
var keycode={
	'right':39,
	'left':37,
	'up':38,
	'down':40,
	'space':32,
	'enter':13,
	'escape':27,
	'esc':27,
	'tab':9,
	'right2':68,
	'left2':65,
	'up2':87,
	'down2':83
};

function timer(code){
	if(code in timerEvents){
		timerEvents[code].action();
	}
}

window.onkeydown = function(event) {
	var kCode = window.event ? window.event.keyCode : (event.keyCode ? event.keyCode : (event.which ? event.which : null))
	if(kCode in events){
		var e=events[kCode];
		if(e.type=='down' || e.type=='up/down') e.action();
		else if(typeof(e.type2)!='undefined' && e.type2=='down') e.action2();
	}
	if(kCode in timerEvents){
		var e=timerEvents[kCode];		
		if(!timersStatus[kCode]){
			timers[kCode]=setInterval('timer('+kCode+')',e.interval);
			timersStatus[kCode]=1;
			if(e.startNow) e.action();
		}
	}
}

window.onkeyup = function(event) {
	var kCode = window.event ? window.event.keyCode : (event.keyCode ? event.keyCode : (event.which ? event.which : null))
	if(kCode in events){
		var e=events[kCode];
		if(e.type=='up' || e.type=='up/down') e.action();
		else if(typeof(e.type2)!='undefined' && e.type2=='up') e.action2();
	}
	if(kCode in timerEvents){	
		if(kCode in timers) clearInterval(timers[kCode]);
		if(kCode in timersStatus) timersStatus[kCode]=0;
	}
}

function addKeyTimerEvent(key,action,interval,startNow){
	if(key in keycode) key=keycode[key];
	if(typeof(interval)=='undefined') interval=33;
	if(typeof(startNow)=='undefined') startNow=0;
	timerEvents[key]={action:action,interval:interval,startNow:startNow};
}

function removeKeyTimerEvent(key){
	if(key in keycode) key=keycode[key];
	if(key in timerEvents) delete timerEvents[key];
	if(key in timers) clearInterval(timers[key]);
	if(key in timersStatus) timersStatus[key]=0;
}

function addKeyEvent(key,action,type){
	if(key in keycode) key=keycode[key];
	if(typeof(type)=='undefined') type='up';
	if(key in events){
		events[key].type2=type;
		events[key].action2=action;
	} else events[key]={action:action,type:type};
}

// выдать координаты цели для всех устройств (мышь, тачпад)

function getAllDevicesPoint(e){
	let cx=0;
	let cy=0;
	if(typeof(e.changedTouches)!='undefined' && e.changedTouches.length>0){
		cx=e.changedTouches[0].pageX;
		cy=e.changedTouches[0].pageY;
	} else {
		cx=e.pageX;
		cy=e.pageY;
	}
	return {x:cx, y:cy};
}
