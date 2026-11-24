var shown = { v: 400 };
function countTo(box, t) {
  if (box.dataset.value !== undefined && Number(box.dataset.value) === t) { return; }
  box.dataset.value = t;
  gsap.to(shown, {
    v: t,
    duration: 0.35,
    ease: "power2.out",
    overwrite: true,
    onUpdate: function () {
      box.textContent = "Rs " + Math.round(shown.v).toLocaleString("en-US");
    }
  });
}
var rate = 400;
var station = "Gaming PC";
var hrs = 1;
var prevTotal = null; 
function calcTotal() {
  var t = rate * hrs;
  if (hrs >= 3) { t = t - t * 0.1; }
  return Math.round(t);
}
function upd() {
  document.getElementById("h").textContent = hrs;
  document.getElementById("sn").textContent = station;
  if (!isFinite(rate) || rate < 0) { rate = 0; } 
  var t = calcTotal();
  var off = document.getElementById("off");
  if (hrs >= 3) {
    off.textContent = "10% off applied";
  } else {
    off.textContent = "Book 3 hours or more for 10% off";
  }
  var totalBox = document.getElementById("tot");
  var changed = (prevTotal === null || prevTotal !== t);
  prevTotal = t;
  countTo(totalBox, t);
  if (changed) {
    totalBox.classList.remove("bump");
    void totalBox.offsetWidth;
    totalBox.classList.add("bump");
  }
  var n = document.getElementById("n").value.trim();
  var p = document.getElementById("p").value.trim();
  var d = document.getElementById("d").value;
  var tm = timeBox ? timeBox.value : "";
  var msg = "Salam! I am " + n + " (" + p + "). I want to book " + station;
  msg = msg + " on " + d + (tm ? " at " + tm : "") + " for " + hrs + " hour(s). Total: Rs " + t;
  document.getElementById("wa").href =
    "https://wa.me/923100104673?text=" + encodeURIComponent(msg);
}
var picks = document.querySelectorAll(".pick");
for (var i = 0; i < picks.length; i++) {
  picks[i].onclick = function () {
    for (var j = 0; j < picks.length; j++) {
      picks[j].setAttribute("aria-pressed", "false");
    }
    this.setAttribute("aria-pressed", "true");
    rate = Number(this.dataset.price);
    if (!isFinite(rate)) { rate = 0; }
    station = this.dataset.name;
    upd();
  };
}
document.getElementById("plus").onclick = function () {
  if (hrs < 12) {
    hrs++;
    upd();
  }
};
document.getElementById("minus").onclick = function () {
  if (hrs > 1) {
    hrs--;
    upd();
  }
};
var dateBox = document.getElementById("d");
var timeBox = document.getElementById("t");

function todayStr() {
  var now = new Date();
  var m = now.getMonth() + 1;
  var day = now.getDate();
  return now.getFullYear() + "-" + (m < 10 ? "0" + m : m) + "-" + (day < 10 ? "0" + day : day);
}

dateBox.min = todayStr();
dateBox.value = todayStr();
function buildTimeOptions() {
  if (!timeBox) { return; }
  var prev = timeBox.value;
  var isToday = dateBox.value === todayStr();
  var now = new Date();
  var nowMins = now.getHours() * 60 + now.getMinutes();
  var html = "";
  var firstOpen = "";
  var found = false;
  for (var m = 12 * 60; m <= 23 * 60 + 30; m += 30) {
    var hh = Math.floor(m / 60);
    var mi = m % 60;
    var val = (hh < 10 ? "0" + hh : hh) + ":" + (mi < 10 ? "0" + mi : mi);
    var lbl = ((hh % 12) || 12) + ":" + (mi < 10 ? "0" + mi : mi) + " " + (hh < 12 ? "AM" : "PM");
    var gone = isToday && m <= nowMins;
    if (!gone && !firstOpen) { firstOpen = val; }
    if (val === prev) { found = true; }
    html += '<option value="' + val + '"' + (gone ? " disabled" : "") + '>' + lbl + '</option>';
  }
  timeBox.innerHTML = html;
  timeBox.value = found ? prev : (firstOpen || "18:00");
}
buildTimeOptions();

dateBox.onchange = function () {
  var errBox = document.getElementById("err");
  if (dateBox.value && dateBox.value < todayStr()) {
    errBox.textContent = "Previous day date will not be showed.";
    dateBox.value = todayStr();
  } else {
    errBox.textContent = "";
  }
  upd();
};
if (timeBox) { timeBox.onchange = upd; }
buildTimeOptions();

var waLink = document.getElementById("wa");
function refreshWa() {
  var n = document.getElementById("n").value.trim();
  var p = document.getElementById("p").value.trim();
  var d = document.getElementById("d").value;
  var tm = timeBox ? timeBox.value : "";
  var t = calcTotal();
  var msg = "Salam! I am " + n + " (" + p + "). I want to book " + station;
  msg = msg + " on " + d + (tm ? " at " + tm : "") + " for " + hrs + " hour(s). Total: Rs " + t;
  waLink.href = "https://wa.me/923100104673?text=" + encodeURIComponent(msg);
}
document.getElementById("n").oninput = refreshWa;
document.getElementById("p").oninput = refreshWa;
document.getElementById("wa").onclick = function (e) {
  var err = document.getElementById("err");
  var n = document.getElementById("n").value.trim();
  var p = document.getElementById("p").value.trim();
  if (n === "") {
    err.textContent = "Enter your name.";
    e.preventDefault();
    return;
  }
  if (p.length !== 11 || isNaN(p) || p.slice(0, 2) !== "03") {
    err.textContent = "Phone should look like 03001234567.";
    e.preventDefault();
    return;
  }
  if (dateBox.value === "") {
    err.textContent = "Pick a date.";
    e.preventDefault();
    return;
  }
  if (dateBox.value < todayStr()) {
    err.textContent = "Purani date nahi chalegi. Aaj ya us ke baad ki date chuno.";
    dateBox.value = todayStr();
    e.preventDefault();
    return;
  }
  err.textContent = "";
};
var filterBtns = document.querySelectorAll(".filters button");
var rows = document.querySelectorAll("#gt tr[data-p]");
for (var a = 0; a < filterBtns.length; a++) {
  filterBtns[a].onclick = function () {
    for (var b = 0; b < filterBtns.length; b++) {
      filterBtns[b].setAttribute("aria-pressed", "false");
    }
    this.setAttribute("aria-pressed", "true");
    var f = this.dataset.f;
    for (var c = 0; c < rows.length; c++) {
      if (f === "all" || rows[c].dataset.p === f) {
        rows[c].style.display = "";
      } else {
        rows[c].style.display = "none";
      }
    }
  };
}
var secs = ["stations", "games", "tournaments", "help"];
var navLinks = document.querySelectorAll("nav a");
window.onscroll = function () {
  var current = "";
  for (var s = 0; s < secs.length; s++) {
    var pos = document.getElementById(secs[s]).getBoundingClientRect().top;
    if (pos < 120) {
      current = secs[s];
    }
  }
  for (var m = 0; m < navLinks.length; m++) {
    if (navLinks[m].getAttribute("href") === "#" + current) {
      navLinks[m].classList.add("on");
    } else {
      navLinks[m].classList.remove("on");
    }
  }
};

upd();
var navAnchors = document.querySelectorAll('a[href^="#"]');
var siteHeader = document.querySelector("header");
var noMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var scrollMode = noMotion ? "auto" : "smooth";

function headerGap() {
  return siteHeader.offsetHeight + 8;
}
function goTo(target) {
  var y = target.getBoundingClientRect().top + window.pageYOffset - headerGap();
  window.scrollTo({ top: y, behavior: scrollMode });
  setTimeout(function () {
    var diff = target.getBoundingClientRect().top - headerGap();
    if (Math.abs(diff) > 4) {
      window.scrollTo({ top: window.pageYOffset + diff, behavior: scrollMode });
    }
  }, 900);
}
for (var q = 0; q < navAnchors.length; q++) {
  navAnchors[q].addEventListener("click", function (e) {
    var id = this.getAttribute("href");
    var target = id.length > 1 ? document.querySelector(id) : null;
    if (target) {
      e.preventDefault();
      goTo(target);
    }
  });
}
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  var pulse = gsap.to(".hero .btn", {
    scale: 1.06, duration: 0.9, repeat: -1, yoyo: true,
    ease: "sine.inOut", paused: true
  });
  var tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  tl.from("header", { y: -70, opacity: 0, duration: 0.7, clearProps: "transform,opacity" })
    .from("nav a", { y: -12, opacity: 0, stagger: 0.08, duration: 0.4, clearProps: "transform,opacity" }, "-=0.3")
    .from(".hud > *", { opacity: 0, stagger: 0.1, duration: 0.5 }, "-=0.2")
    .from("h1", { y: 50, opacity: 0, duration: 0.9 }, "-=0.1")
    .to(".p2 i", { width: "4%", duration: 2.4, ease: "power2.in" }, "-=0.3")
    .fromTo(".stamp", { scale: 2.4, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2.2)" })
    .from(".sub", { y: 20, opacity: 0, duration: 0.6 }, "-=0.2")
    .from(".hero .btn", { y: 20, opacity: 0, duration: 0.5 }, "-=0.3")
    .add(function () { pulse.play(); });
  var heroBtn = document.querySelector(".hero .btn");
  heroBtn.addEventListener("mouseenter", function () {
    pulse.pause();
    gsap.to(heroBtn, { scale: 1, y: -3, duration: 0.2 });
  });
  heroBtn.addEventListener("mouseleave", function () {
    gsap.to(heroBtn, { y: 0, duration: 0.2, onComplete: function () { pulse.play(); } });
  });
  var picks = gsap.utils.toArray(".pick");
  function liftSelected() {
    picks.forEach(function (p) {
      var up = p.getAttribute("aria-pressed") === "true" ? -4 : 0;
      gsap.to(p, { y: up, duration: 0.45, ease: "back.out(2)" });
    });
  }
  function reveal(selector, y, stagger, keep, done) {
    var els = gsap.utils.toArray(selector);
    if (els.length === 0) { return; }
    gsap.set(els, { y: y, opacity: 0 });
    ScrollTrigger.batch(els, {
      start: "top 90%",
      once: true,
      onEnter: function (batch) {
        var vars = { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: stagger };
        if (!keep) { vars.clearProps = "transform,opacity"; }
        if (done) { vars.onComplete = done; }
        gsap.to(batch, vars);
      }
    });
  }
  reveal("section h2, section .lead", 30, 0.1);
  reveal(".gal > *", 50, 0.15, true);
  reveal(".pick", 60, 0.12, true, liftSelected);
  reveal(".fields label", 30, 0.1);
  reveal(".book", 40, 0);
  reveal(".filters", 20, 0);
  reveal("tr", 20, 0.07);
  reveal(".two > div", 30, 0.15);
  reveal("details", 24, 0.1);
  picks.forEach(function (p) {
    p.addEventListener("mouseenter", function () {
      gsap.to(p, { y: -8, duration: 0.3, ease: "power2.out" });
    });
    p.addEventListener("mouseleave", function () {
      var up = p.getAttribute("aria-pressed") === "true" ? -4 : 0;
      gsap.to(p, { y: up, duration: 0.4, ease: "power2.out" });
    });
    p.addEventListener("click", liftSelected);
  });
  gsap.utils.toArray(".gal > *").forEach(function (g) {
    g.addEventListener("mouseenter", function () { gsap.to(g, { scale: 1.04, duration: 0.35, ease: "power2.out" }); });
    g.addEventListener("mouseleave", function () { gsap.to(g, { scale: 1, duration: 0.35, ease: "power2.out" }); });
  });
  var slides = gsap.utils.toArray(".bg-slide");
  var holdTime = 6;
  var current = 0;
  if (slides.length > 1) {
    gsap.set(slides, { opacity: 0 });
    gsap.set(slides[0], { opacity: 1, scale: 1.08, xPercent: -3 });
    gsap.to(slides[0], { scale: 1.16, xPercent: 3, duration: holdTime + 3, ease: "none" });
    gsap.delayedCall(holdTime, nextSlide);
  }
  function nextSlide() {
    var from = slides[current];
    current = (current + 1) % slides.length;
    var to = slides[current];
    gsap.set(to, { scale: 1.08, xPercent: -3 });
    gsap.to(from, { opacity: 0, duration: 1.4, ease: "power1.inOut" });
    gsap.to(to, { opacity: 1, duration: 1.4, ease: "power1.inOut" });
    gsap.to(to, { scale: 1.16, xPercent: 3, duration: holdTime + 3, ease: "none", overwrite: "auto" });
    gsap.delayedCall(holdTime, nextSlide);
  }
  gsap.to("h2", {
    textShadow: "0 0 20px rgba(41, 224, 255, 0.95)",
    duration: 1.8, repeat: -1, yoyo: true, ease: "sine.inOut"
  });

  window.addEventListener("load", function () {
    ScrollTrigger.refresh();
  });
  if (document.fonts) {
    document.fonts.ready.then(function () {
      ScrollTrigger.refresh();
    });
  }
})();
