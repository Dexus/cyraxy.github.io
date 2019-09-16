var tab1=document.getElementById('tab1');
var tab2=document.getElementById('tab2');
var tab3=document.getElementById('tab3');

var tab1_active=document.getElementById('tab1_active');
var tab2_active=document.getElementById('tab2_active');
var tab3_active=document.getElementById('tab3_active');

var color_active='black';
var color_noactive='black';

tab1_active.style.display='block';
tab2_active.style.display='none';
tab3_active.style.display='none';


tab1.style.color=color_active;
tab2.style.color=color_noactive;
tab3.style.color=color_noactive;

function active_tab1(){
tab1.classList.add("tab_active");
if (tab2.classList="tab_active") {tab2.classList.remove("tab_active")};
if (tab3.classList="tab_active") {tab3.classList.remove("tab_active")};
tab1_active.style.display='block';
tab2_active.style.display='none';
tab3_active.style.display='none';

tab1.style.color=color_active;
tab2.style.color=color_noactive;
tab3.style.color=color_noactive;

}


function active_tab2(){
tab2.classList.add("tab_active");
if (tab1.classList="tab_active") {tab1.classList.remove("tab_active")};
if (tab3.classList="tab_active") {tab3.classList.remove("tab_active")};
tab1_active.style.display='none';
tab2_active.style.display='block';
tab3_active.style.display='none';
tab1.style.color=color_noactive;
tab2.style.color=color_active;
tab3.style.color=color_noactive;
}


function active_tab3(){
tab3.classList.add("tab_active");
if (tab2.classList="tab_active") {tab2.classList.remove("tab_active")};
if (tab1.classList="tab_active") {tab1.classList.remove("tab_active")};
tab1_active.style.display='none';
tab2_active.style.display='none';
tab3_active.style.display='block';

tab1.style.color=color_noactive;
tab2.style.color=color_noactive;
tab3.style.color=color_active;
}




