(function(){
  const here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll('a.kw[href]').forEach(a => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    if (href === here) a.classList.add("active");
  });

  const form = document.querySelector("#collabForm");
  if(form){
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = (document.querySelector("#name")?.value || "").trim();
      const msg = (document.querySelector("#message")?.value || "").trim();

      const subject = encodeURIComponent("Sonderhaus collaboration");
      const body = encodeURIComponent(`Name: ${name}\n\nMessage:\n${msg}\n\nSent from sonderhauss.github.io`);

      /* change this email */
      const to = "hello@sonderhaus.events";
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    });
  }
})();
