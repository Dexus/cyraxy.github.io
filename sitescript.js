
var objectType={age: 14, sex:'male', name:'Руслан'};
var arrayType = ['Имя 1', 'name2', 'name3'];
var nullType= null;
function myFunction(){
a=5;
b=6;
c=a+b;
document.getElementById('paragraph').innerHTML ='paragraph ' + c +' '+objectType.name+' '+arrayType[1];
}

function displayResult(){
var length=document.getElementById('length').value;
var width=document.getElementById('width').value;
var height=document.getElementById('height').value;

document.getElementById('result').innerHTML='Площадь равна ' +calculateSize(length, width, height);
}

function calculateSize(length, width, height){
return length*width*height;

}

var user, user2;

user = {
	firstName:'Руслан',
	lastName:'Капцов',
	age:23,
	sex:'Мужской',
	fullname:function(){
		return this.firstName + ' ' +this.lastName + ' ' + this.age +' ' + 'года' + ' '+ 'пол:' + this.sex;		
	}
};




document.getElementById('result').innerHTML=user.fullname();
console.log(user.fullname());

function testFunction(){
	var testVar = 100;
	console.log(testVar);
	return testVar;
	
}

var testObject={
	run:function(){
		console.log('Метод объекта');
	}
}

testObject.run();

//window.open("http://ru4slan.github.io");

document.getElementById('vivod').innerHTML=testFunction();


var v1='10+15';
var v2=new String("10 + 15");
console.log(eval(v1));
console.log(v2.length);
console.log(v1.split());



var arr_1 = new Array();
var arr_2 = new Array();
var arr_3 = new Array();

for(var i=0;i<5;i++) arr_1[i]=i;
for(var i=0;i<10;i++) arr_2[i]=i;
for(var i=0;i<15;i++) arr_3[i]=i;
	
var arr = new Array(arr_1, arr_2, arr_3);

console.log(arr[0][4]);

for (var i=0;i<arr.length;i++){
	
}



