(function () {
  const here = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  document.querySelectorAll('a.kw[href]').forEach((a) => {
    const href = (a.getAttribute("href") || "").toLowerCase();

    if (href === here || (here === "" && href === "index.html")) {
      a.classList.add("active");
    }
  });
})();
