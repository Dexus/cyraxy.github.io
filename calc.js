//var plus=$('plus');
//var minus=$('minus');
//var umnoz=$('umnoz');
//var delenie=$('delenie');
//var oneinput=$('oneinput').value;
//v//ar twoinput=$('twoinput').value;
var znak=document.getElementById('znak');
var otvet=document.getElementById('otvet');
s3='';
num='';
var s1 = document.getElementById('oneinput');
var s2 = document.getElementById('twoinput');
function ravno(){


if (num=='plus') otvet.value=((s2.value*1)+(s3*1));
if (num=='minus') otvet.value=((s2.value*1)-(s3*1));
if (num=='umnoz') otvet.value=((s2.value*1)*(s3*1));
if (num=='delenie') otvet.value=((s2.value*1)/(s3*1));


if (num=='sin') otvet.value=Math.sin(s2.value*1);
if (num=='cos') otvet.value=Math.cos(s2.value*1);
if (num=='tan') otvet.value=Math.tan(s2.value*1);
if (num=='ctg') otvet.value=Math.ctg(s2.value*1);		
}


function minuss(){
	num='minus';
	s3=s2.value;
	s1.value=s3;
	s2.value='';
	znak.innerHTML='-';
}

function pluss(){
	num='plus';
		s3=s2.value;
		s1.value=s3;
		s2.value='';
		znak.innerHTML='+';
}
function umnozz(){
	num='umnoz';
		s3=s2.value;
		s1.value=s3;
		s2.value='';
		znak.innerHTML='*';
}

function deleniee(){
	num='delenie';
		s3=s2.value;
		s1.value=s3;
		s2.value='';
		znak.innerHTML='/';
}


function sinn(){
	num='sin';
otvet.value=Math.sin(s1.value*1);
}

function coss(){
	num='cos';
	otvet.value=Math.cos(s1.value*1);
}
function tann(){
	num='tan';
	otvet.value=Math.tan(s1.value*1);
}

function ctgg(){
	num='ctg';
	otvet.value=Math.ctg(s1.value*1);
}






