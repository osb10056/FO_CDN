
var barcode = "";
function goDetail(obj) {
	var flag_main = "Y";
	var detail_barcode = "";
	
	var temp = $("#K_AUDIO_MAIN_IMG").prop("src"); 
	var temp2 = temp.substring(temp.lastIndexOf("/"),temp.lastIndexOf("."));
		temp2 = temp2.replace("/l","");
	var mv_barcode = temp2;
	
	if(barcode == "" || barcode == "undefined"|| barcode == null){
		if(flag_main == "Y"){
			var url = "/digital/ebook/ebookDetail.ink?barcode="+ mv_barcode;
			document.location.href = url;
		}
	}else{
		if(barcode != detail_barcode){
			var url = "/digital/ebook/ebookDetail.ink?barcode="+ barcode;
			document.location.href = url;
		}
	}
}

function addBtnEvent(){
	$("#K_AUDIO_PALYER_LIST > button").unbind("click").bind("click",function() {
		barcode = $(this).attr("barcode");
	});
}

$(document).ready(function(){
	_EKYOBO.Init({userAgent:"P"}); 
	//오디오 호출 - 수정하면 됨.
	$(".audioClick span").click(function(){
		_EKYOBO.fileChange($(this).attr("audio-duration"),$(this).attr("audio-src"),$(this).attr("audio-barcode"),$(this).attr("audio-url"),$(this).attr("audio-title"),$(this).attr("audio-reading")); 
	});	
});

var miniAudioPlayerAni = {
    playerBody: $(".audioPlayer"),
    miniPlayer: $(".miniPlayer"),
    contorlBox: $(".audioPlayer .contorlBox"),
    audioPlayList: $(".listening_list"),    
    contorlBoxPannel: $(".listening_pannel"),
    btnAudioPlay: $(".audioPlayer .pannel button.play"),
    btnAudioListPlay: $(".audioPlayer .listening_list button "),
    btnAudioClose: $(".listening_box button.close "),
    playTimmer: $(".audioPlayer .time"),
    totlaTimmer: $(".audioPlayer .total"),
    playProgress: $(".audioPlayer .progress"),
    
    init: function () {
        this.playerBody.find(".slide").click(function () {
            miniAudioPlayerAni.controlPannel();
        }),
            this.playerBody.draggable({ handle: ".listening_pannel > img" }),
            this.playerBody.bind("drag", function () {
                miniAudioPlayerAni.playerBody.removeClass("open");
                var a = $(window).width() / 2,
                    b = parseInt(miniAudioPlayerAni.playerBody.css("left")),
                    c = $(".audioPlayer .inner");
                b > a ? !c.hasClass("right") && (c.removeClass("left"), c.addClass("right")) : !c.hasClass("left") && (c.removeClass("right"), c.addClass("left")),
                    1 < parseInt(miniAudioPlayerAni.contorlBox.css("width")) &&
                        (miniAudioPlayerAni.audioPlayList.css({ bottom: "0", display: "none" })
                         ,miniAudioPlayerAni.contorlBox.css({  display: "none", width: "0px" })
                         ,miniAudioPlayerAni.contorlBoxPannel.css({ width: "fit-content" })
                         ,miniAudioPlayerAni.playerBody.find(".slide").addClass('scale')
                        );
            }),
            this.playerBody.find(".pannel .list").click(function () {
                var a = parseInt(miniAudioPlayerAni.audioPlayList.css("bottom"));
                miniAudioPlayerAni.audioPlayListPannel(a);
                addBtnEvent();

            }),
            $(document).on("click", ".listening_list button", function () {
                var a = $(".audioPlayer .listening_list button ");
                if (!!$(this).hasClass("stop")) $(".audioPlayer .pannel button.play").click();
                else if ($(this).hasClass("last")) _EKYOBO.getTime(), $(".audioPlayer .pannel button.play").click();
                else {
                    var b = $(this).closest("button")[0].originalData;
                    _EKYOBO.fileChange(b.time, b.src, b.barcode, b.url, b.title, b.reading, !0),
                        a.removeClass("stop"),
                        a.removeClass("last"),
                        miniAudioPlayerAni.audioStop(),
                        $(this).addClass("stop"),
                        $(this).addClass("last"),
                        setTimeout(function () {
                            miniAudioPlayerAni.audioPlay();
                        }, 200);
                }
            }),
            this.btnAudioClose.click(function () {
                return (
                    miniAudioPlayerAni.audioStop(),
                    $(".audioPlayer").hide(),
                    miniAudioPlayerAni.btnAudioListPlay.removeClass("stop"),
                    miniAudioPlayerAni.btnAudioListPlay.removeClass("last"),
                    miniAudioPlayerAni.audioStop(),
                    $(_EKYOBO.getAudioDiv()).find().remove("audio"),
                    !1
                );
            }),
            $(document).on("click", ".audioPlayer .pannel button.play", function () {
                $(this).hasClass("stop") ? miniAudioPlayerAni.audioStop() : ($(".listening_list button").find(".last").addClass("stop"), _EKYOBO.getTime(), miniAudioPlayerAni.audioPlay());
            }),
            this.playProgress.mouseenter(function () {
                miniAudioPlayerAni.playProgress.find("span").animate({ height: "10px" }, 200);
            }),
            this.playProgress.mouseleave(function () {
                miniAudioPlayerAni.playProgress.find("span").animate({ height: "5px" }, 200);
            });
    },
    audioPlayListPannel: function (a) {
        10 > a
            ? (this.audioPlayList.css("display", "flex"), /* this.contorlBox.animate({ height: "147px" }, 500, "easeOutCirc"), */ this.audioPlayList.animate({ bottom: "137px" }, 500, "easeOutCirc"))
            : (/*this.contorlBox.animate({ height: "96px" }, 200),*/
              this.audioPlayList.animate({ bottom: "0" }, 200, function () {
                  miniAudioPlayerAni.audioPlayList.css("display", "none");
              }));

    },
    equalizer: function () {
        equalizerStart = setInterval(function () {
            miniAudioPlayerAni.miniPlayer.hasClass("playing")
                ? $(".equalizer span").each(function () {
                      var a = parseInt(32 * Math.random()),
                          b = parseInt(400 * Math.random());
                      $(this).animate({ height: a + "px" }, b, "swing");
                  })
                : (clearInterval(equalizerStart),
                  $(".equalizer span").each(function () {
                      $(this).clearQueue(), $(this).stop().animate({ height: "8px" }, 200);
                  }));
        });
    },
    equalizerClear: function () {
        this.miniPlayer.removeClass("playing");
    },
    equalizerStart: function () {
        this.equalizer(), this.miniPlayer.addClass("playing");
    },
    controlPannel: function () {
        var a = parseInt(this.contorlBox.width());
        
            10 > a
                ? (this.playerBody.addClass("open"),
                    this.contorlBoxPannel.css("width","484px"),
                    this.contorlBox.removeAttr("style"),
                    this.contorlBox.animate({ width: "297px" }, 400, "easeOutCirc", function () {
                      miniAudioPlayerAni.playerBody.find(".slide").removeClass('scale')
                  }))
                : (this.playerBody.removeClass("open"),
                    this.contorlBoxPannel.css("width","fit-content"),
                    this.contorlBox.css("display", "none"),
                  0 < parseInt(this.audioPlayList.css("bottom"))
                      ? this.audioPlayList.animate({ bottom: "0" }, 200, function () {
                            miniAudioPlayerAni.audioPlayList.css({ display: "none" }),
                                miniAudioPlayerAni.contorlBox.animate({ height: "88px" }, 100, function () {                                    
                                    miniAudioPlayerAni.contorlBox.animate({ width: "0" }, 100),
                                    miniAudioPlayerAni.playerBody.removeClass("open");
                                });
                        })
                      : this.contorlBox.animate({ width: "0" }, 100, function () {
                        miniAudioPlayerAni.playerBody.find(".slide").addClass('scale'),
                        miniAudioPlayerAni.playerBody.removeClass("open");
                        }));
    },
    audioStop: function () {
        this.equalizerClear(), $(".audioPlayer .pannel button.play").removeClass("stop"), $(".listening_list button").removeClass("stop").find("div").hide(), this.audioPlayTimeUpdate();
    },
    audioPlay: function () {
        this.equalizerStart(), $(".audioPlayer .pannel button.play").addClass("stop"), this.audioPlayTimeUpdate();
    },
    audioRePlay: function () {
        this.equalizerClear(), this.equalizerStart(), this.btnAudioPlay.addClass("stop"), this.audioPlayTimeUpdate();
    },
    audioPlayTimeUpdate: function () {},
},
console = window.console || { log: function () {} },
_EKYOBO = (function () {
    var a,
        b,
        c,
        d,
        f,
        g = {
            userAgent: "M",
            audioDiv: "#K_AUDIO_PLAYER_DIV",
            id: "#K_AUDIO_PLAYER",
            player: null,
            isPlaying: !1,
            playPause: ".audioPlayer .pannel button.play",
            playClose: ".audioPlayer .btn_close",
            progressbar: "K_AUDIO_PROGRESS",
            timeline: "K_AUDIO_TIMELINE",
            timerUp: !1,
            timerLength: 0,
            previewCount: 0,
            previewMobileCount: 3,
            previewPcCount: 5,
            volume: 0.4,
            delayId: 0,
            audioPalyerList: "#K_AUDIO_PALYER_LIST",
            audioPalyerListFormat: "#K_AUDIO_PALYER_LIST_FORMAT",
            audioTime: "#K_AUDIO_TIME",
            audioTimeTotal: "#K_AUDIO_TIME_TOTAL",
            audioTitle: "#K_AUDIO_TITLE",
            audioReading: "#K_AUDIO_READING",
            audioMianImage: "#K_AUDIO_MAIN_IMG",
            test: 0,
        },
        h = function (a) {
            $(g.audioDiv).find("audio").remove(),
                $(g.audioDiv).html("<audio id='K_AUDIO_PLAYER' preload='auto' style='display:none;'><source src='#' type='audio/mpeg'></audio>"),
                miniAudioPlayerAni.init(),
                l(a),
                _EKYOBO.getStorageList(),
                y().done(function () {
                    g.player = $(g.id)[0];
                }),
                $(g.playPause).click(function () {
                    y()
                        .done(function () {
                            (g.player = $(g.id)[0]),
                                j(!1).done(function () {
                                    !1 === g.player.paused ? (g.player.pause(), (g.isPlaying = !1)) : (g.player.play(), (g.isPlaying = !0));
                                });
                        })
                        .fail(function (a) {
                            alert("\uC7AC\uC0DD\uBAA9\uB85D\uC774 \uBE44\uC5B4\uC788\uC2B5\uB2C8\uB2E4.[" + a + "]");
                        });
                });
        };
    $(g.playClose).click(function () {
        !1 === g.player.paused && (g.player.pause(), (g.isPlaying = !1));
    });
    var i = function (a, b, c, d, e, f, h) {
            $(g.audioDiv).find("audio").remove(),
                $(g.audioDiv).html("<audio id='K_AUDIO_PLAYER' preload='auto' style='display:none;'><source src='#' type='audio/mpeg'></audio>"),
                $(".audioPlayer").show(),
                z(a, b, c, d, e, f, h).done(function () {
                    h === void 0 && (miniAudioPlayerAni.audioRePlay(), B()),
                        y().done(function () {
                            (g.player = $(g.id)[0]),
                                j(!0, a).done(function () {
                                    g.player.load(), (g.isPlaying = !0), k();
                                });
                        });
                });
        },
        j = function (a) {
            return a && (n(), s()), $.Deferred().resolve().promise();
        },
        k = function () {
            clearTimeout(g.delayId), m();
        },
        l = function (a) {
            for (var b = Object.keys(a), c = 0, d = b.length; c < d; c++) g.hasOwnProperty(b[c]) && (g[b[c]] = a[b[c]]);
            "M" == g.userAgent ? (g.previewCount = g.previewMobileCount) : "P" == g.userAgent && (g.previewCount = g.previewPcCount);
        },
        m = function () {
            g.delayId = setTimeout(function () {
                g.player.play(), (g.isPlaying = !0), s();
            }, 300);
        },
        n = function () {
            g.player.addEventListener("timeupdate", p);
        },
        o = function () {
            return 0 < g.timerLength ? g.timerLength : g.player.duration;
        },
        p = function () {
            var a = $("#" + g.timeline).width(),
                b = o(g.timerLength),
                c = g.player.currentTime;
            if (!isNaN(b)) {
                var d = q(b),
                    e = r(c),
                    f = document.getElementById(g.progressbar);
                g.timerUp
                    ? ($(g.audioTime).html(e),
                      c >= b
                          ? ($("#" + g.progressbar).width("0px"), g.player.pause(), (g.isPlaying = !1), miniAudioPlayerAni.audioStop(), $(g.audioTime).html("00:00"))
                          : $("#" + g.progressbar).width(a * (g.player.currentTime / o(g.timerLength)) + "px"))
                    : ($(g.audioTime).html(r(b - c)),
                      0 < b - c
                          ? $("#" + g.progressbar).width(a * (g.player.currentTime / o(g.timerLength)) + "px")
                          : ($("#" + g.progressbar).width("0px"), g.player.pause(), (g.isPlaying = !1), miniAudioPlayerAni.audioStop(), $(g.audioTime).html("00:00")));
            }
        },
        q = function (a) {
            var b = Math.floor(a / 60),
                c = a - 60 * b;
            10 > b && (b = "0" + b), 10 > c && (c = "0" + c);
            var d = c.toString(),
                e = d.substr(0, 2),
                f = b + ":" + e;
            return f;
        },
        r = function (a) {
            var b = parseInt(a / 3600) % 24,
                c = parseInt(a / 60) % 60,
                d = (a % 60).toFixed();
            60 <= d && (d = 59);
            var e = (10 > c ? "0" + c : c) + ":" + (10 > d ? "0" + d : d);
            return e;
        },
        s = function () {
            (a = null), (b = null), (c = document.getElementById(g.timeline)), (d = document.getElementById(g.progressbar)), (f = $("#" + g.timeline).width()), c.addEventListener("click", t), window.addEventListener("mouseup", w);
        },
        t = function (a) {
            g.player.currentTime = o(g.timerLength) * u(a, c, f);
        },
        u = function (a, b, c) {
            return (event.clientX - v(b)) / c;
        },
        v = function (a) {
            return a.getBoundingClientRect().left;
        },
        w = function (d) {
            if (null != a) {
                document.getElementById(b);
                (g.player.currentTime = o(g.timerLength) * u(d, c, f)), g.player.addEventListener("timeupdate", p), g.player.addEventListener("timeupdate", x);
            }
            a = null;
        },
        x = function () {
            var a = f * (g.player.currentTime / o(g.timerLength));
            (g.player.style.marginLeft = a + "px"), g.player.currentTime == o(g.timerLength) && (g.player.pause(), (g.isPlaying = !1));
        },
        y = function () {
            var a = [];
            try {
                if (!localStorage) {
                    if ("undefined" != typeof $.cookie("AUDIO-P-LIST")) {
                        var a = JSON.parse($.cookie("AUDIO-P-LIST") || {});
                        if (0 == a.length) return $.Deferred().reject(1).promise();
                    } else return $.Deferred().reject(1).promise();
                } else if (((a = JSON.parse(localStorage.getItem("AUDIO-P-LIST"))), [] == a)) return $.Deferred().reject(1).promise();
            } catch (a) {
                return console.log(a), $.Deferred().reject(2).promise();
            }
            return null == a
                ? $.Deferred().reject(3).promise()
                : ($(g.audioMianImage).attr("src", a[0].url),
                  $(g.id).find("source").attr("src", a[0].src),
                  null == g.player ? $(g.audioTime).text(a[0].time) : 0 == g.player.currentTime && $(g.audioTime).text(a[0].time),
                  $(g.audioTimeTotal).text(a[0].time),
                  $(g.audioTitle).text(a[0].title),
                  $(g.audioReading).text(a[0].reading),
                  $.Deferred().resolve().promise());
        },
        z = function (a, b, c, d, e, f) {
            var h = { key: 0, time: a, src: b, barcode: c, url: d, title: e, reading: f },
                j = [];
            j.push(h);
            try {
                if (!localStorage) {
                    if ("undefined" != typeof $.cookie("AUDIO-P-LIST")) {
                        var k = JSON.parse($.cookie("AUDIO-P-LIST") || {});
                        if (0 < k.length)
                            for (var l = 0; l < k.length && g.previewCount > j.length; l++)
                                c != k[l].barcode && ((h = { key: j.length, time: k[l].time, src: k[l].src, barcode: k[l].barcode, url: k[l].url, title: k[l].title, reading: k[l].reading }), j.push(h));
                    }
                    $.cookie("AUDIO-P-LIST", JSON.stringify(j), { expires: 365 });
                } else {
                    var k = [];
                    try {
                        k = JSON.parse(localStorage.getItem("AUDIO-P-LIST"));
                    } catch (a) {
                        console.log(a);
                    }
                    if (null != k)
                        for (var l = 0; l < k.length && g.previewCount > j.length; l++)
                            c != k[l].barcode && ((h = { key: j.length, time: k[l].time, src: k[l].src, barcode: k[l].barcode, url: k[l].url, title: k[l].title, reading: k[l].reading }), j.push(h));
                    localStorage.setItem("AUDIO-P-LIST", JSON.stringify(j));
                }
            } catch (a) {
                return console.log(a), $.Deferred().reject(a).promise();
            }
            return $.Deferred().resolve().promise();
        },
        A = function () {
            var a = [];
            try {
                if (!localStorage) {
                    if ("undefined" != typeof $.cookie("AUDIO-P-LIST")) {
                        var a = JSON.parse($.cookie("AUDIO-P-LIST") || {});
                        return !!(0 < a.length) && ($(g.id).find("source").attr("src", a[0].src), $(g.audioTime).text(a[0].time), a[0]);
                    }
                    return !1;
                }
                return (a = JSON.parse(localStorage.getItem("AUDIO-P-LIST"))), [] != a && ($(g.id).find("source").attr("src", a[0].src), $(g.audioTime).text(a[0].time), a[0]);
            } catch (a) {
                return !1;
            }
            if (null == a) return !1;
        },
        B = function () {
            var a = [];
            try {
                if (!!localStorage) a = JSON.parse(localStorage.getItem("AUDIO-P-LIST"));
                else if ("undefined" != typeof $.cookie("AUDIO-P-LIST")) var a = JSON.parse($.cookie("AUDIO-P-LIST") || {});
                else return !1;
                $(g.audioPalyerList).html("");
                for (var b = 0; b < a.length; b++) 0 == b && ((a[b].btnStop = "stop"), (a[b].btnLast = "last")), $(g.audioPalyerList).append(getFormatAudioObject(g.audioPalyerListFormat, a[b]));
            } catch (a) {
                return !1;
            }
            if (null == a) return !1;
        },
        C = function () {
            var a = navigator.userAgent.toLowerCase();
            return (
                !(-1 != a.indexOf("firefox")) &&
                !("Microsoft Internet Explorer" == navigator.appName && -1 != a.indexOf("msie") && null != /MSIE ([0-9]{1,}[./0-9]{0,})/.exec(navigator.userAgent) && ((version = parseInt(RegExp.$1)), 10 > version))
            );
        },
        D = function () {
            var a = navigator.userAgent.toLowerCase();
            return !(("Netscape" != navigator.appName || -1 == navigator.userAgent.search("Trident")) && -1 == a.indexOf("msie"));
        };
    return {
        Init: function (a) {
            C() && h(a);
        },
        play: function () {
            k();
        },
        getId: function () {
            return g.id;
        },
        getAudioDiv: function () {
            return g.audioDiv;
        },
        fileChange: function (a, b, c, d, e, f, g) {
            var h = C();
            h ? i(a, b, c, d, e, f, g) : alert("\uD574\uB2F9 \uBE0C\uB77C\uC6B0\uC800\uC5D0\uC11C\uB294 \uC624\uB514\uC624\uBBF8\uB9AC\uB4E3\uAE30\uB97C \uC9C0\uC6D0\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.");
        },
        getStorage: function () {
            return A();
        },
        getStorageList: function () {
            return B();
        },
        getTime: function () {
            _EKYOBO.navigatorAgentIE && g.player.currentTime >= o(g.timerLength) && (g.player.currentTime = 0);
        },
        navigatorAgent: function () {
            return C();
        },
        navigatorAgentIE: function () {
            return D();
        },
    };
})(),
getFormatAudioObject = function (a, b) {
    var c = getDomPieceAudio($(a).html(), b),
        d = $(c);
    return (d[0].originalData = b), d;
};
function getDomPieceAudio(a, b) {
if ("" === $.trim(a)) return a;
var c,
    d = a;
for (c in b) d = domPieceReplaceAllAudio(c, b[c], d);
return (d = d.split(/\[\[[_0-9a-zA-Z]+\]\]/).join("")), (d = d.split(/\{\{[_0-9a-zA-Z]+\}\}/).join("")), d;
}
function domPieceReplaceAllAudio(b, c, d) {
"use strict";
var e,
    f,
    g = [
        { pre: "[[", post: "]]", defVal: "" },
        { pre: "{{", post: "}}", defVal: 0 },
    ],
    h = ["string", "number"],
    i = d;
try {
    if ("undefined" != c && null != c) {
        if ("" === (b || "")) throw new Error("\uBD88\uAC00\uB2A5\uD55C \uBCC0\uD658 \uD0C0\uC785\uC785\uB2C8\uB2E4.");
        if (null == c || null == c) throw new Error("\uBD88\uAC00\uB2A5\uD55C \uBCC0\uD658 \uD0C0\uC785\uC785\uB2C8\uB2E4.");
        for (var j = 0; j < h.length; j++)
            if (h[j] === typeof c) {
                e = j;
                break;
            }
        (f = c), (i = i.split(g[e].pre + b + g[e].post).join(f));
    } else {
        f = "";
        for (var j = 0; j < h.length; j++) i = i.split(g[j].pre + b + g[j].post).join(f);
    }
    return i;
} catch (a) {
    return d;
}
}