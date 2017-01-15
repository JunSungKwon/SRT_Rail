// http://www.letskorail.com/ebizprd/EbizPrdTicketPr21111_i1.do

function injectJs(srcFile) {
    var scr = document.createElement('script');
    scr.src = srcFile;
    document.getElementsByTagName('head')[0].appendChild(scr);
}

function redirectPage(href) {
	console.log("redirectPage: " + href.substring(0,href.length));
	alert(href.substring(0,href.length))
	if (href.indexOf("javascript:") == 0) {
		href = "window.showModalDialog=window.showModalDialog || function(url, arg, opt) {window.open(url, arg, opt);};window.confirm=function (str) {return true;};requestReservationInfo=function(a,b,c,d,e,f){requestReservationInfo(a,b,c,d,e,f);};" + href.substring(0, href.length-14);
		location.href = "javascript:" + href;
	} else {
		location.href = href;
	}
}

var dsturl0 = "https://etk.srail.co.kr/hpg/hra/01/selectScheduleList.do?pageId=TK0101010000";
//var dsturl1 = "http://www.letskorail.com/ebizprd/EbizPrdTicketPr21111_i1.do";
//var dsturl2 = "http://www.letskorail.com/ebizprd/EbizPrdTicketpr21100W_pr21110.do";
if (document.URL.substring(0, dsturl0.length) == dsturl0) {

	$(document).ready(function() {
		injectJs(chrome.extension.getURL('inject.js'));

		var coachSelected = JSON.parse(localStorage.getItem('coachSelected'));
		var firstSelected = JSON.parse(localStorage.getItem('firstSelected'));
		if (coachSelected == null) coachSelected = [];
		if (firstSelected == null) firstSelected = [];
		console.log("coach:" + coachSelected);
		console.log("first:" + firstSelected);

		if (localStorage.getItem('macro') == "true") {
			$(".search-form").append('<a href="#" onclick="macrostop();" style="font-size:15px; margin-left:5px;"><img src="' + chrome.extension.getURL('btn_stop.png') + '"></a>');

		} else {
			$(".search-form").append('<a href="#" onclick="macro();" style="font-size:15px; margin-left:5px;"><img src="' + chrome.extension.getURL('btn_start.png') + '"></a>');
		}
		// 테이블에 "매크로" 버튼을 삽입한다.
		if ($("#search-list").length != 0) {
			console.log("table_length : " + $("#search-list").length);
			var rows = $('table tr');
			console.log("table_rows : " + rows.length);
			for (i = 1; i < rows.length; i++) {
				var columns = $(rows[i]).children('td');
				var first = $(columns[5]);
				var coach = $(columns[6]);
				if (coach.children().length > 0) {
					coach.append($("<p class='p5'></p>"));
					var checkbox = $("<label></label>").html('<input type="checkbox" name="checkbox" class="coachMacro" value="' + i + '">매크로');
					checkbox.children('input').prop('checked', coachSelected.indexOf(i+"") > -1);
					coach.append(checkbox);
				}
				if (first.children().length > 0) {
					first.append($("<p class='p5'></p>"));
					var checkbox = $("<label></label>").html('<input type="checkbox" name="checkbox" class="firstMacro" value="' + i + '">매크로');
					checkbox.children('input').prop('checked', firstSelected.indexOf(i+"") > -1);
					first.append(checkbox);
				}
			}
		}

		if (localStorage.getItem('macro') == "true") {

			// Restore preferences
			$("select[name=psgInfoPerPrnb1]").val(localStorage.getItem('psgInfoPerPrnb1'));
			$("select[name=psgInfoPerPrnb5]").val(localStorage.getItem('psgInfoPerPrnb5'));
			$("select[name=psgInfoPerPrnb4]").val(localStorage.getItem('psgInfoPerPrnb4'));
			$("select[name=psgInfoPerPrnb2]").val(localStorage.getItem('psgInfoPerPrnb2'));
			$("select[name=psgInfoPerPrnb3]").val(localStorage.getItem('psgInfoPerPrnb3'));
			$("select[name=locSeatAttCd1]").val(localStorage.getItem('locSeatAttCd1'));
			$("select[name=rqSeatAttCd1]").val(localStorage.getItem('rqSeatAttCd1'));

			if ($("#search-list").length != 0) {
				var rows = $('table tr');

				var succeed = false;
				for (i = 1; i < rows.length; i++) {
					var columns = $(rows[i]).children('td');

					var first = $(columns[5]);
					var coach = $(columns[6]);

					if (coachSelected.indexOf(i+"") > -1) {
						var coachSpecials = coach.children("a");
						if (coachSpecials.length != 0) {
							for (j = 0; j < coachSpecials.length; j++) {
								cls = $(coachSpecials[j]).attr('class');
								if (cls == "button button-02") {
									//$(coachSpecials[j]).click($(coachSpecials[j]).attr('onclick'));
									redirectPage($(coachSpecials[j]).attr('onclick'));

									succeed = true;
									break;
								}
							}
							if (succeed == true) break;
						}
					}

					if (firstSelected.indexOf(i+"") > -1) {
						var firstSpecials = first.children("a");
						if (firstSpecials.length != 0) {
							for (j = 0; j < firstSpecials.length; j++) {
								cls = $(coachSpecials[j]).attr('class');
								if (cls == "button button-02") {
									redirectPage($(coachSpecials[j]).attr('onclick'));
									//$(coachSpecials[j]).click($(coachSpecials[j]).attr('onclick'));

									succeed = true;
									break;
								}
							}
							if (succeed == true) break;
						}
					}
				}

				if (succeed == true) {
					localStorage.removeItem('macro');
					localStorage.removeItem('coachSelected');
					localStorage.removeItem('firstSelected');
					localStorage.removeItem('psgInfoPerPrnb1');
					localStorage.removeItem('psgInfoPerPrnb5');
					localStorage.removeItem('psgInfoPerPrnb4');
					localStorage.removeItem('psgInfoPerPrnb2');
					localStorage.removeItem('psgInfoPerPrnb3');
					localStorage.removeItem('locSeatAttCd1');
					localStorage.removeItem('rqSeatAttCd1');
					chrome.extension.sendMessage({type: 'playSound'}, function(data) { });
				} else {
					// 모두 실패한 경우
					setTimeout(function() {
					var f = document.getElementById("search-form"); // form 엘리멘트 생성
					f.submit();
					}, 2500);
				}
			} else {
				// 결과폼이 없는 경우 (오류 화면 발생?)
				history.go(-1);
			}
		}
	});

}
