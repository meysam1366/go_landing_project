/*
by: Danial Dezfouli
*/
var currentPage = 1;
$(function () {
    $('.page[data-page="' + currentPage + '"]').show();
    $('.copytext').click(function (e) {
        e.preventDefault();
        copyTextToClipboard(this.href);
        var x = $(this);
        $(this).addClass('pulse').css({
            'animation-duration': '.5s'
        });
        setTimeout(function () {
            x.removeClass('pulse');
        }, 600)
    });
});

function navigate(n) {
    if (n == currentPage) return;
    currentPage = n;
    $('.page').each(function () {
        if (parseInt($(this).attr('data-page')) == currentPage)
            $(this).fadeIn();
        else
            $(this).fadeOut();
    })

}


function copyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;

    textArea.style.width = '2em';
    textArea.style.height = '2em';

    textArea.style.padding = 0;

    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';

    textArea.style.background = 'transparent';


    textArea.value = text;

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copying text command was ' + msg);
    } catch (err) {
        console.log('Oops, unable to copy');
    }

    document.body.removeChild(textArea);
}


/*##########*/

var version = $('#version').text();
var service = $('#service').text();
var tid;

$(document).on('click', '#enter_msisdn', function () {
    console.log(version);
    console.log(service);

    msisdn = $('#msisdn').val();
    var token = $('#token').val();
    navigate(4);

    $.ajax({
        method: 'post',
        url: '/landing/api/verify/' + service + '/' + version,
        crossDomain: true,
        data: {
            msisdn: msisdn,
            token: token
        }
    }).done(function (data) {
        console.log(data);
        if (data['message'] == 'SUCCESS') {
            tid = data['tid'];
            request_id = data['request_id'];
            navigate(2);
        } else {
            $("#error_div1").css({
                "display": "block"
            });
            $("#error").text(data['tid']);
            navigate(1)
        }
    })
});

$(document).on('click', '#enter_pin', function () {
    var pin = $('#pin').val();
    var token = $('#token').val();
    source_url = $('#source_url').text();
    var report_url = $('#report_url').attr('href');
    var kp = $('#kp').val();
    navigate(4);
    console.log(source_url);
    $.ajax({
        method: 'post',
        url: '/landing/api/thanks/' + service + '/' + version,
        crossDomain: true,
        data: {
            pin: pin,
            tid: tid,
            request_id: request_id,
            token: token,
            kp: kp
        }
    }).done(function (data) {
        console.log(data);
        if (data['message'] == 'SUCCESS') {
            console.log(data['token']);
            token1 = data['token'];
            $("#source_url").text(source_url + "/" + data['token']);
            $("#copy_url").attr("href", source_url + "/" + data['token']);
            $(".whatsapp").attr("href", "whatsapp://send?text=تو هم برو یه شارژ 2000 تومانی بگیر حالشو ببر" + source_url + "/" + data['token']);
            $(".telegram").attr("href", "https://t.me/share/url?url=" + source_url + "/" + data['token'] + "&text=تو هم برو یه شارژ 2000 تومانی بگیر حالشو ببر");
            $("#report_url").attr("href", report_url + "/" + data['token']);
            navigate(3)
        } else {
            $("#error_div2").css({
                "display": "block"
            });
            $("#error2").text(data['message']);
            navigate(2)
        }
    })
});

$(document).on('click', '#new_request', function () {
    navigate(4);
    console.log(msisdn);
    $.ajax({
        method: 'post',
        url: '/landing/api/verify_step2/' + service + '/' + version,
        crossDomain: true,
        data: {
            msisdn: msisdn,
            request_id: request_id
        }
    }).done(function (data) {
        console.log(data);
        if (data['message'] == 'SUCCESS') {
            tid = data['tid'];
            request_id = data['request_id'];
            navigate(5)
        } else {
            $("#error_div1").css({
                "display": "block"
            });
            $("#error").text(data['message']);
            navigate(3)
        }
    })
});

$(document).on('click', '#enter_pin2', function () {
    var pin = $('#pin2').val();

    navigate(4);
    console.log(source_url);
    var report_url2 = $('#report_url2').attr('href');
    $.ajax({
        method: 'post',
        url: '/landing/api/thanks_step2/' + service + '/' + version,
        crossDomain: true,
        data: {
            pin: pin,
            tid: tid,
            request_id: request_id
        }
    }).done(function (data) {
        console.log(data);
        if (data['message'] == 'SUCCESS') {
            console.log(token1);
            $("#source_url2").text(source_url + "/" + token1);
            $("#copy_url2").attr("href", source_url + "/" + token1);
            $("#whatsapp1").attr("href", "whatsapp://send?text=تو هم برو یه شارژ 2000 تومانی بگیر حالشو ببر" + source_url + "/" + token1);
            $("#telegram1").attr("href", "https://t.me/share/url?url=" + source_url + "/" + token1 + "&text=تو هم برو یه شارژ 2000 تومانی بگیر حالشو ببر");
            $("#report_url2").attr("href", report_url2 + "/" + token1);
            navigate(6)
        } else {
            $("#error_div3").css({
                "display": "block"
            });
            $("#error3").text(data['message']);
            navigate(4)
        }
    })
});