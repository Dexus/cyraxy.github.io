var chapters = new Array();
var selected = 1;
var combobox = $("#combobox");
var this_id = 1;

for (var i=1;i<=16;i++) {
	chapters[i] = $("."+i);
}



for (i=1;i<=16;i++) {
chapters[i].on('click',function() {	
	selected = this.className;	
	for (var j=1;j<=16;j++)
		if (selected!=j) $(chapters[j]).css({'color' : 'white'});
	$(this).css({'color' : 'black'});
});
}

var data3;
$.ajax({async: false,dataType: "json",type:'GET',url:"save_all_heroes_mission.json",success: function(data) {data3 = data;}});


function get_data(id){
this_id = id;
var hero = data3.heroes[id];
var star = hero.star;
var color = hero.color;
var level = hero.level;


$("#level").val(level);
$("#star").val(star);
$("#color").val(color);

var skill_1 = hero.skills[Object.keys(hero.skills)[0]];
var skill_2 = hero.skills[Object.keys(hero.skills)[1]];
var skill_3 = hero.skills[Object.keys(hero.skills)[2]];
var skill_4 = hero.skills[Object.keys(hero.skills)[3]];
$("#skill_1").val(skill_1);
$("#skill_2").val(skill_2);
$("#skill_3").val(skill_3);
$("#skill_4").val(skill_4);


if (hero.artifacts!=undefined) {
	var artifact = hero.artifacts;
	var art_1_star = artifact[0].star;
	var art_2_star = artifact[1].star;
	var art_3_star = artifact[2].star;
	
	var art_1_level = artifact[0].level;
	var art_2_level = artifact[1].level;
	var art_3_level = artifact[2].level;
	
	$("#art_1_star").val(art_1_star);
	$("#art_2_star").val(art_2_star);
	$("#art_3_star").val(art_3_star);
	
	$("#art_1_level").val(art_1_level);
	$("#art_2_level").val(art_2_level);
	$("#art_3_level").val(art_3_level);
}

var dar = hero.titanGiftLevel;
$("#dar").val(dar);

$("#rune_1").val(hero.runes[0]);
$("#rune_2").val(hero.runes[1]);
$("#rune_3").val(hero.runes[2]);
$("#rune_4").val(hero.runes[3]);
$("#rune_5").val(hero.runes[4]);
//var dar = 

}



get_data(this_id);
//save_data();


function save_data(id){
	
	var hero = data3.heroes[id];
	
	
	hero.level=$("#level").val();
	hero.star=$("#star").val();
	hero.color=$("#color").val();
	
	
	hero.skills[Object.keys(hero.skills)[0]] = $("#skill_1").val();
	hero.skills[Object.keys(hero.skills)[1]] = $("#skill_2").val();
	hero.skills[Object.keys(hero.skills)[2]] = $("#skill_3").val();
	hero.skills[Object.keys(hero.skills)[3]] = $("#skill_4").val();



	
	hero.artifacts[0].star = $("#art_1_star").val();
	hero.artifacts[1].star = $("#art_2_star").val();
	hero.artifacts[2].star = $("#art_3_star").val();
	
	hero.artifacts[0].level = $("#art_1_level").val();
	hero.artifacts[1].level = $("#art_2_level").val();
	hero.artifacts[2].level = $("#art_3_level").val();

	hero.titanGiftLevel = $("#dar").val();

	hero.runes[0] = $("#rune_1").val();
	hero.runes[1] = $("#rune_2").val();
	hero.runes[2] = $("#rune_3").val();
	hero.runes[3] = $("#rune_4").val();
	hero.runes[4] = $("#rune_5").val();
	
	data3.heroes[id] = hero;
	//JSON.stringiry(data3);
	console.log(JSON.stringify(data3));
}

//$("#combobox :selected").html()

$( "#combobox" ).change(function () {
	
	//alert($("#combobox :selected").val());
save_data(this_id);
get_data ($("#combobox :selected").val());    
});  