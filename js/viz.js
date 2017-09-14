  $(document).ready(function(){
          $('.clickBox').hover(function(){
              $(this).css("background-color", "#a6c4fc");
              }, function(){
              $(this).css("background-color", "#3285ff");
          });
          $('.clickBox').click(function(){
              $('.clickBox').hide();
              $('.welcome').hide();
              $('#button').fadeIn();
              $('#chartdiv').fadeIn();
              $('#chartdiv2').fadeIn();
              $('.clickBoxMain').fadeIn();
              $('.desc').fadeIn();
              $('.summary').fadeIn();
          });
          $('.clickBoxMain.clickHome').hover(function(){
              $(this).css("background-color", "#a6c4fc");
              }, function(){
              $(this).css("background-color", "#3285ff");
          });
          $('.clickBoxMain.clickHome').click(function(){
              $('#chartdiv').hide();
              $('#chartdiv2').hide();
              $('.clickBoxMain').hide();
              $('.desc').hide();
              $('.summary').hide();
              $('#summaryTxt').hide();
              $('.welcome').show();
              $('.clickBox').show();
          });
          $('.summary').click(function(){
              $('#chartdiv').toggle();
              $('#chartdiv2').toggle();
              $('#summaryTxt').toggle();
          });


        });