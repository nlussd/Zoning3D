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
              $('.welcome').show();
              $('.clickBox').show();
          });

        });