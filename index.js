var elem=document.getElementById('shapka');
var radio1=document.getElementById('check1');
var radio2=document.getElementById('check2');
var radio3=document.getElementById('check3');
//var elem = document.querySelector("#shapka");
var i=1;
var j=0;
var timee=100;

function prozr(){
j+=0.1;
elem.style.opacity=j;
	if (j>0.9) j=0.1;
console.log(j);	
}

function back(){
if (radio1.checked==1) i=1;
if (radio2.checked==1) i=2;
if (radio3.checked==1) i=3;		
	i--;
	if (i==0){
		i=3;
		elem.classList.remove("img1");
		elem.classList.add("img3");
		radio3.checked=1;
		radio2.checked=0;
		radio1.checked=0;
	}
		if (i==2){
		elem.classList.remove("img3");
		elem.classList.add("img2");
		radio3.checked=0;
		radio2.checked=1;
		radio1.checked=0;
	}
			if (i==1){
		elem.classList.remove("img2");
		elem.classList.add("img1");
		radio3.checked=0;
		radio2.checked=0;
		radio1.checked=1;
	}
}

function forward(){
		if (radio1.checked==1) i=1;
if (radio2.checked==1) i=2;
if (radio3.checked==1) i=3;
	i++;
		if (i==4){
		i=1;
		elem.classList.remove("img3");
		elem.classList.add("img1");
		radio3.checked=0;
		radio2.checked=0;
		radio1.checked=1;
	}
     	if (i==2){
		elem.classList.remove("img1");
		elem.classList.add("img2");
		radio3.checked=0;
		radio2.checked=1;
		radio1.checked=0;
		
	}
				if (i==3){
		elem.classList.remove("img2");
		elem.classList.add("img3");
		radio3.checked=1;
		radio2.checked=0;
		radio1.checked=0;
	}

	
}

var a;
var b;
function foo(c) {
    if (a != c) {b = 0;a = c};
    b ^= 1;
    c.checked = b;
}

function checkk(){
if (radio1.checked==1){
i=1;
if (elem.classList="img3") {elem.classList.remove("img3")};
if (elem.classList="img2") {elem.classList.remove("img2")};
elem.classList.add("img1");	
}

if (radio2.checked==1){
i=2;
if (elem.classList="img3") {elem.classList.remove("img3")};
if (elem.classList="img1") {elem.classList.remove("img1")};
elem.classList.add("img2");	
}


if (radio3.checked==1){
i=3;
if (elem.classList="img1") {elem.classList.remove("img1")};
if (elem.classList="img2") {elem.classList.remove("img2")};
elem.classList.add("img3");	
}
}


