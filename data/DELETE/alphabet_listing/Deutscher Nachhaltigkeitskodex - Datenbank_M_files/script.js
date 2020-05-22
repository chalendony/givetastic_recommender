$(document).ready(function () 
{	
	
	$('.head').height($("header").height());
    
    $('header').affix({
        offset: { top: $('header').offset().top }
    });
	
	$('.panel-collapse').on('show.bs.collapse', function () {
		$(this).parent('.panel').addClass('active');
	  });

	  $('.panel-collapse').on('hide.bs.collapse', function () {
		$(this).parent('.panel').removeClass('active');
	  });


    var panelHeight, panelHeightInner;

    if ($(window).width() < 480)
    {
	    panelHeight = 390;
	    panelHeightInner = 175;
	}
    else
    {
        panelHeight = 235;
	    panelHeightInner = 195;
	}
	$("#quotesAccordion .acc_panel").click(function(){
      if($(this).hasClass('acc_hide')) {
          $(this).animate({height:"100%"},400).removeClass('acc_hide');
		  $(this).find(".quotes_con").animate({height:"100%"},500);
      } else { 
          $(this).animate({height:panelHeight},400).addClass('acc_hide');
		  $(this).find(".quotes_con").animate({height:panelHeightInner},500);
      }
    });
	// Register Tabs:
	$(".registertabs ul.tab_navi li").first().addClass('current');
	$(".registertabs .tab_content").first().addClass('current');
	
	$('.registertabs ul.tab_navi li').click(function(){
		var tab_id = $(this).attr('data-tab');
		
		$(".registertabs ul.tab_navi li").first().removeClass('current');
		$(".registertabs .tab_content").first().removeClass('current');
		$('.registertabs ul.tab_navi li').removeClass('current');
		$('.registertabs .tab_content').removeClass('current');
		$(this).addClass('current');
		$("#"+tab_id).addClass('current');
    });
	
});


function carouselNormalization(carousel)
{
    var items = $(carousel).find('.item'); //grab all slides

    if (items.length)
    {
        normalizeHeights(items);
    }  
}
function normalizeHeights(items)
{
    var heights = [];
    var tallest;
    items.each(function ()
    { //add heights to array
        heights.push($(this).height());
    });
    tallest = Math.max.apply(null, heights); //cache largest value
    items.each(function ()
    {
        $(this).css('min-height', tallest + 'px');
        $(this).css('margin-bottom', '60px');
    });
}
