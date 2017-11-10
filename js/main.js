$(document).ready(function(){
	//Добавление активного класса ссылке
	$('.nav ul li a').each(function(){
		var location = window.location.href;
		var link = this.href;
		if (location == link) {
			$('nav ul li a').removeClass('active');
			$(this).addClass('active');
		}
	});
	//Добавление активного класса к дроп-меню
	$('.nav-adaptive-drop li a').each(function(){
		var location = window.location.href;
		var link = this.href;
		if (location == link) {
			$('nav-adaptive-drop li a').removeClass('nav-drop-active');
			$(this).addClass('nav-drop-active');
		}
	});

	$('.intro-title').css({'margin-bottom':'20px', 'opacity':'0'}).stop().animate({
		bottom: '-18px',
		opacity: '1'
	}, {duration: 500});
	$('.intro_st').css({'opacity':'0'}).delay(500).animate({
		opacity: '1'
	});
	$('.intro-vk').css({'margin-top':'20px', 'opacity':'0'}).delay(700).animate({
		opacity: '1',
		top: '-18px'
	}, {duration: 500});
	$('.intro-inst').css({'margin-top':'20px', 'opacity':'0'}).delay(900).animate({
		opacity: '1',
		top: '-18px'
	}, {duration: 500});
	//Drop-Menu
	$('.nav-adaptive').click(function(){
		$('.nav-adaptive-drop').slideToggle('slow');
	});
	//Tab-Menu
	$('.tab-select').click(function(e){
		e.preventDefault();
		$('.tab-select').removeClass('tab-active');
		$(this).addClass('tab-active');
		var tab = $(this).attr('href');
		$('.tab').not(tab).css({'display':'none'});
		$(tab).fadeIn(400);
	});
	$('.question').click(function(e){
		e.preventDefault();
		var question = $(this).attr('href');
		$(question).slideToggle();
	});
});