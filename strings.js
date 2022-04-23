// бесполезные адаптеры (вспомогательные функции)

function substr(f_string, f_start, f_length){
	if(f_start<0){
		f_start+=f_string.length;
	}
	if(f_length==undefined){
		f_length=f_string.length;
	} else if(f_length<0){
		f_length+=f_string.length;
	} else {
		f_length+=f_start;
	}
	if(f_length<f_start) {
		f_length=f_start;
	}
	return f_string.substring(f_start, f_length);
}

function strlen(s){ return s.length; }

// выдать все вхождения между тегами t1 и t2 в строке str

function get_all_tag(str,t1,t2){
	var pro_res2, u, in1, i, pro_res, c;
	pro_res2=[];
	u=0;
	in1=0;
	for(i=0;i<strlen(str);i++) if (substr(str,i,strlen(t1))==t1){
		pro_res='';		
		for(c=i+strlen(t1);c<strlen(str);c++) if(substr(str,c,strlen(t2))==t2 && in1==0){
			pro_res2[u]=pro_res;
			u++;
			i=c+strlen(t2)-1;
			break;
		} else {
			if (substr(str,c,strlen(t1))==t1) in1++;
			if (substr(str,c,strlen(t2))==t2) in1--;
			pro_res=pro_res+str[c];
		}
	}
	return pro_res2;
}
