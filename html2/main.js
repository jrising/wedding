(function(){

    $(document).ready(function(){

        init(true);
        $('section.toc_topic').each(function(indx, el){
            $('header',el).click(function(){
                var body = $("html, body");
                var sectionTop = $(el).offset().top;

                body.animate({scrollTop:sectionTop}, 1000, 'easeInOutSine', function() {
                   //console.log('DONE ANIMATING');
                });
            });
            $('.backtotop').click(function(){
                var scroll_offset = $($('.toc_topic')[0]).offset().top;
                $('html, body').animate({scrollTop: scroll_offset}, 1000, 'easeInOutSine');
            })
        });

        setTimeout(function(){
            $('.overlay-screen').fadeOut(500, function(){
                $('.overlay-screen').remove();
            });

        }, 1000);
    });

    $(window).scroll(function(){
        checkSectionPos();
    });
    $(window).on('resize',init);

    function init(isFirst){
        var winH = $(window).innerHeight();
        var winW = $(window).innerWidth();

        var navHeight = $('#navigation_global_container').height();

        $('main > header').height(winH - 232);

        $('.toc_topic').each(function(indx, el){
            if(indx==0)return true;
            $(el).addClass('offbottom');
        });

        if(isFirst){
            setTimeout(checkHashTag, 1000);
        }

        var textHeight = $('main > header h1').height() + $('main > header h4').height();
        var newPaddingTop = Math.round((winH - 242 - textHeight)/2);
        if(newPaddingTop < 70)newPaddingTop = 70;
        $('main > header').css('padding-top', newPaddingTop+"px");

        var timeoutTime = (isFirst) ? 500 : 0;
        setTimeout(function(){
            if($('.ngs-video video').length > 0){
                sizeVideo();
            }
        }, timeoutTime);

        $('.gn_JS_global-search').offset({left: $('.gn_biggierow').width() - $('.gn_JS_global-search').width() - 15});
    };


    function checkSectionPos(){
        $('.toc_topic').each(function(indx, el){

            var curTop = $(window).scrollTop();
            var sectionTop = $(el).position().top;
            var sectionBottom = sectionTop + $(el).height()+210;
            var screenHeight = $(window).innerHeight();
            var offset = 232 - (56 * indx);
            var top_offset = Math.abs(56 * indx); // 0, 56, 112
            var onscreen_offset_top = 56;
            var bottomPos = Math.round(curTop + (screenHeight - offset));

            if(bottomPos >= sectionTop){
                // The section above the bottom of the page
                $(el).removeClass('offbottom');
                $('header h3 i.icongs', el).removeClass('icongs-directiondown').addClass('icongs-directionup');

                // Makes it scroll again

                // Check to see if section is above the top of the view port
                if(sectionTop < curTop - 56){
                    $(el).addClass('offtop');
                } else {
                    $(el).removeClass('offtop');
                }

                // Check to see if the bottom is still in viewport

                if(sectionBottom > curTop+84){
                    $(el).addClass('onscreen');
                } else {
                    $(el).removeClass('onscreen');
                }

            } else {
                $(el).addClass('offbottom').removeClass('onscreen');
                $('header h3 i.icongs', el).addClass('icongs-directiondown').removeClass('icongs-directionup');
            }

            if(curTop == 0){
                $(el).removeClass('onscreen');
                $('header h3 i.icongs', el).addClass('icongs-directiondown').removeClass('icongs-directionup');
            }

        });
    };

    function checkHashTag(){
        if(window.location.hash.length > 4){
            var aID = window.location.hash.substr(1);
            var aTag = $('a[id*="'+aID+'"]');
            if(aTag.length > 0){
                var body = $("html, body");
                var parentSection = $(aTag).parents('.toc_topic');
                var scroll_offset = 0;

                if(aTag.siblings('header').hasClass('second')){
                    scroll_offset = 51;
                } else if(aTag.siblings('header').hasClass('third')){
                    scroll_offset = 122;
                }

                var sectionTop = parentSection.offset().top - scroll_offset;
                body.animate({scrollTop:sectionTop}, 1000, 'easeInOutSine', function() {
                    // DONE
                });
            }
        }
    };

    function sizeVideo(){
        var vRatio = 1080 / 1920;
        var headerH = $(window).innerHeight() - 232;
        var headerW = $('main > header').width();
        var headerRatio = headerH / headerW;

        var vDiff;

        // If the slide is taller than the dragarea, make the slide's width
        // equal to the dragarea's
        if( vRatio >= headerRatio) {
            //set to height
            var vHt = headerW * vRatio;
            vDiff = Math.round( (vHt - headerH)*0.8);
            $($('.background-media video')[0]).width( headerW ).height( vHt ).css('top',-vDiff).css('left', 0);
        } else {
            var vWdt = headerH / vRatio;
            vDiff = Math.round( (vWdt - headerW)/2);
            $($('.background-media video')[0]).height( headerH ).width( vWdt ).css('left',-vDiff).css('top', 0);
        }
    };
}).call();
