// Some general UI pack related JS
// Extend JS String with repeat method
String.prototype.repeat = function(num) {
  return new Array(num + 1).join(this);
};

/** 
    Copied from http://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
    Modified to make text right-aligned
 */
function wrapText(context, text, x, y, maxWidth, lineHeight) {
  var words = text.split(' ');
  var line = '';

  for(var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + ' ';
    var metrics = context.measureText(testLine);
    var testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      var lineWidth = context.measureText(line);
      context.fillText(line.trim(), x, y);
      line = words[n] + ' ';
      y += lineHeight;
    }
    else {
      line = testLine;
    }
  }
  var metrics = context.measureText(line);
  context.fillText(line.trim(), x, y);
}

var certificateAnalytics = _.debounce(function(event) {
    _paq.push(['trackEvent', 'certificate-create', $('#certificate').val(), $('#topic').val(), $('#person-name').val()]);
}, 300);

function drawCertificate(canv, img) {
    var context = canv.getContext('2d');
    var selection = $('#certificate').val();
    var x = certificateOptions[selection].x;
    var y = certificateOptions[selection].y;
    var maxWidth = certificateOptions[selection].width;
    var lineHeight = 55;

    var text = certificateOptions[selection].text.replace('{name}', $('#person-name').val()).replace('{topic}', $('#topic').val());
    canv.width = img.width;
    canv.height = img.height;
    context.drawImage(img, 0, 0);
    context.font = '18px Droid Arabic Naskh';
    context.textBaseline = 'top';
    context.textAlign = 'right';
    context.fillStyle = 'black';
    wrapText(context, text, maxWidth + x, y, maxWidth, lineHeight);
    $('.downloader').attr('href', canv.toDataURL()).attr('download', $('#certificate option:selected').text() + ' - ' + $('#topic').val() + ' - ' + $('#person-name').val());

    // analytics
    certificateAnalytics('certificate-create');
};

var certificateOptions = {
    'qassam': {
        image: 'cert_images/qassam.jpg',
        x: 25,
        y: 150,
        width: 550,
        height: 330,
        text:  'تشهد كتائب عز الدين القسام الجناح العسكري لحركة المقاومة الإسلامية (حماس) أن المتدرب {name} قد اجتاز بنجاح الدورة التدريبية المتقدمة في {topic}'
    },
    'mossad': {
        image: 'cert_images/mossad-certificate.jpg',
        x: 60,
        y: 150,
        width: 500,
        height: 330,
        text: 'يشهد جهاز الموساد للاستخبارات والعمليات الخاصة أن المتدرب {name} قد اجتاز بنجاح الدورة التدريبية المتقدمة في {topic}'
    }
};



(function($) {

  // Add segments to a slider
  $.fn.addSliderSegments = function (amount, orientation) {    
    return this.each(function () {
      if (orientation == "vertical") {
        var output = ''
          , i;
        for (i = 1; i <= amount - 2; i++) {
          output += '<div class="ui-slider-segment" style="top:' + 100 / (amount - 1) * i + '%;"></div>';
        };
        $(this).prepend(output);
      } else {
        var segmentGap = 100 / (amount - 1) + "%"
          , segment = '<div class="ui-slider-segment" style="margin-left: ' + segmentGap + ';"></div>';
        $(this).prepend(segment.repeat(amount - 2));
      }
    });
  };

  $(function() {

    // Custom Selects
    $("select[name='huge']").selectpicker({style: 'btn-hg btn-primary', menuStyle: 'dropdown-default'});
    $("select[name='herolist']").selectpicker({style: 'btn-primary', menuStyle: 'dropdown-default'});
    $("select[name='info']").selectpicker({style: 'btn-info'});

    // Tooltips
    $("[data-toggle=tooltip]").tooltip("show");

    // Tags Input
    $(".tagsinput").tagsInput();

    // Placeholders for input/textarea
    $(":text, textarea").placeholder();

    // Focus state for append/prepend inputs
    $('.input-group').on('focus', '.form-control', function () {
      $(this).closest('.input-group, .form-group').addClass('focus');
    }).on('blur', '.form-control', function () {
      $(this).closest('.input-group, .form-group').removeClass('focus');
    });

    $(".btn-group").on('click', "a", function() {
      $(this).siblings().removeClass("active").end().addClass("active");
    });

    var canv = $('canvas')[0];
    var img = new Image();
    var selection = $('#certificate').val();
    img.src = certificateOptions[selection].image;
    img.onload = (function() {
        drawCertificate(canv, img);
    });
    $('#certificate').change(function() {
        img.src = certificateOptions[$(this).val()].image;
        drawCertificate(canv, img);
    });
    $('#person-name,#topic').keyup(function() {
        drawCertificate(canv, img);
    });

    $('.downloader').click(function() {
        //ga('send', 'event', 'certificate-create', selection, $('#topic').val(), $('#person-name').val());
        _paq.push(['trackEvent', 'certificate-download', $('#certificate').val(), $('#topic').val(), $('#person-name').val()]);
    });

    // The typewriter effect
    var str = "<p>هل تبحث عن فرصة لخيانة وطنك؟</p>" +
          "<p>هل تحب شم الكولة ووجبات الكنتاكي؟</p>" +
          "<p>يمكنك الآن أن تحصل علي شهادات تجسس معتمدة من أقذر أجهزة المخابرات في العالم!</p>" + 
          "<p>السي آي إيه! الكي جي بي! والمفاجأة الكبري....</p>" +
          "<h4>الموووووووووووووسااااااااااااااااااااااااد</h4>",
      i = 0,
      isTag,
      text;
      (function type() {
          text = str.slice(0, ++i);
          if (text === str) {
            // We finished the text. Now we need to show the certificate designer
            $('#certificate-canvas,#certificate-form').css({'visibility': 'visible', 'display': 'none'}).fadeIn()
            return;
          }

          $('#typewriter').html(text);

          var char = text.slice(-1);
          if( char === '<' ) isTag = true;
          if( char === '>' ) isTag = false;

          if (isTag) return type();
          setTimeout(type, 80);
      
      }());

  });
  
})(jQuery);