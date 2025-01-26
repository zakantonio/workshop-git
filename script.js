document.addEventListener("DOMContentLoaded", () => {
  let currentPageIndex = 0;
  let currentKeywordIndex = 0;
  let data;
  let pages = [];

  // Carica il JSON
  fetch("data.json")
    .then((response) => response.json())
    .then((json) => {
      data = json;
      renderHome();
      renderPages();
      renderGlossary();
      renderFooter();
      showRequestPage();
    });

    window.addEventListener('popstate', (event) => {
      const pageId = event.state?.pageId || 'home'; // Usa l'ID della pagina dallo stato o la pagina predefinita
      showPage(pageId);
    });

  function showRequestPage() {
    // Verifica se c'è un hash nell'URL
    const hash = window.location.hash.substring(1); // Rimuovi il "#" dall'hash

    // Mostra la pagina corrispondente all'hash o la pagina predefinita
    if (hash && document.getElementById(hash)) {
      showPage(hash);
    } else {
      showHome();
    }
  }

  // Renderizza la Home Page
  function renderHome() {
    const homeContent = document.querySelector("#home .content");

    // Imposta titolo e sottotitolo
    document.getElementById("home-title").innerText = data.home.title;
    document.getElementById("home-subtitle").innerText = data.home.subtitle;

    // Aggiungi le azioni
    const actionsContainer = document.getElementById("home-actions");
    data.home.actions.forEach((action) => {
      const button = document.createElement("button");
      button.innerText = action.text;
      button.addEventListener("click", () =>
        showPage(action.link.replace("#", ""))
      );
      actionsContainer.appendChild(button);
    });
  }

  function renderPages() {
    // Aggiungi la home all'array delle pagine
    const homePage = document.getElementById("home");
    pages.push(homePage);

    const pagesContainer = document.getElementById("pages");

    data.pages.forEach((page, index) => {
      const pageElement = document.createElement("div");
      pageElement.id = page.id;
      pageElement.className = "page";

      const contentDiv = document.createElement("div");
      contentDiv.className = "content";

      // Aggiungi il titolo e il sottotitolo
      const title = document.createElement("h1");
      title.textContent = page.title;
      contentDiv.appendChild(title);

      const subtitle = document.createElement("h2");
      subtitle.textContent = page.subtitle;
      contentDiv.appendChild(subtitle);

      if (page.type === "standard") {
        // Se la pagina è di tipo "standard"
        const keywordContent = document.createElement("div");
        keywordContent.className = "keyword-content";

        const keywordList = document.createElement("div");
        keywordList.className = "keyword-list";

        // Ciclo sulle keywords
        page.keywords.forEach((keyword, i) => {
          const keywordItem = document.createElement("div");
          keywordItem.className = "keyword-item";
          keywordItem.dataset.index = i;
          keywordItem.textContent = keyword.name;
          keywordList.appendChild(keywordItem);
        });

        const keywordImage = document.createElement("div");
        keywordImage.className = "keyword-image";

        // Mostra il concetto e l'immagine della prima keyword
        if (page.keywords.length > 0) {
          const concept = document.createElement("p");
          concept.innerHTML = page.keywords[0].concept; // Usa innerHTML per interpretare i tag HTML
          keywordImage.appendChild(concept);

          const image = document.createElement("img");
          image.src = page.keywords[0].image;
          image.alt = page.keywords[0].name;
          keywordImage.appendChild(image);
        }

        keywordContent.appendChild(keywordList);
        keywordContent.appendChild(keywordImage);
        contentDiv.appendChild(keywordContent);
      } else {
        // Se la pagina è di tipo "custom"
        const customContent = document.createElement("div");
        customContent.className = "custom-content";

        const text = document.createElement("p");
        text.innerHTML = page.content.text; // Usa innerHTML per interpretare i tag HTML
        customContent.appendChild(text);

        const image = document.createElement("img");
        image.src = page.content.image;
        image.alt = page.title;
        customContent.appendChild(image);

        contentDiv.appendChild(customContent);
      }

      // Aggiungi i bottoni di navigazione
      const navigationButtons = document.createElement("div");
      navigationButtons.className = "navigation-buttons";

      const prevButton = document.createElement("button");
      prevButton.className = "nav-button prev-button";
      prevButton.textContent = "←";
      navigationButtons.appendChild(prevButton);

      const nextButton = document.createElement("button");
      nextButton.className = "nav-button next-button";
      nextButton.textContent = "→";
      navigationButtons.appendChild(nextButton);

      contentDiv.appendChild(navigationButtons);
      pageElement.appendChild(contentDiv);
      pagesContainer.appendChild(pageElement);
      pages.push(pageElement); // Aggiungi la pagina all'array
    });

    // Aggiungi i listener ai bottoni di navigazione
    setupNavigationButtons();

    // Aggiungi il Glossario all'array delle pagine
    const glossaryPage = document.getElementById("glossary");
    pages.push(glossaryPage);

    // Aggiungi il Footer all'array delle pagine
    const footerPage = document.getElementById("footer");
    pages.push(footerPage);
  }

  function setupNavigationButtons() {
    const prevButtons = document.querySelectorAll(".prev-button");
    const nextButtons = document.querySelectorAll(".next-button");

    prevButtons.forEach((button) => {
      button.addEventListener("click", () => navigatePages("up")); // Pagina precedente
    });

    nextButtons.forEach((button) => {
      button.addEventListener("click", () => navigatePages("down")); // Pagina successiva
    });
  }

  function renderGlossary() {
    document.getElementById("glossary-title").innerText = data.glossary.title;
    const glossaryList = document.getElementById("glossary-list");
    data.glossary.keywords.forEach((keyword) => {
      const li = document.createElement("li");

      // Aggiungi il titolo (parola chiave)
      const title = document.createElement("h3");
      title.innerText = keyword.name;
      li.appendChild(title);

      // Aggiungi il concetto
      const concept = document.createElement("p");
      concept.innerText = keyword.concept;
      li.appendChild(concept);

      // Gestione del click
      li.addEventListener("click", () => {
        showPage(keyword.pageId); // Reindirizza alla pagina specifica
      });

      glossaryList.appendChild(li);
    });
  }

  // Renderizza il Footer
  function renderFooter() {
    document.getElementById("footer-title").innerText = data.footer.title;
    document.getElementById("footer-quote").innerText = data.footer.quote;
    const footerLinks = document.getElementById("footer-links");
    data.footer.links.forEach((link) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = link.url;
      a.innerText = link.text;
      a.title = link.description;
      li.appendChild(a);
      footerLinks.appendChild(li);
    });
  }

  // Mostra una pagina specifica
  function showPage(pageId) {
    document
      .querySelectorAll(".page")
      .forEach((page) => page.classList.remove("active"));
    document.getElementById(pageId).classList.add("active");
    currentPageIndex = pages.findIndex((page) => page.id === pageId); // Aggiorna l'indice della pagina corrente

    // Resetta l'indice del concetto solo se la pagina è di tipo "standard"
    if (data.pages[currentPageIndex - 1]?.type === "standard") {
      currentKeywordIndex = 0;
      updateKeywordDisplay(); // Aggiorna la visualizzazione del concetto
      setupKeywordClickListeners(); // Imposta i listener per il click
    }

    document.getElementById("logo").style.visibility =
      currentPageIndex === 0 ? "hidden" : "visible";

    updateProgressBar();

    // Aggiorna l'URL con l'ID della pagina
    history.pushState({ pageId }, `Page ${pageId}`, `#${pageId}`);
  }

  function showHome() {
    showPage("home");
  }

  // Imposta i listener per il click sulle parole chiave
  function setupKeywordClickListeners() {
    const currentPage = pages[currentPageIndex];
    if (currentPage && data.pages[currentPageIndex - 1]?.type === "standard") {
      const keywordItems = currentPage.querySelectorAll(".keyword-item");
      keywordItems.forEach((item, index) => {
        item.addEventListener("click", () => {
          currentKeywordIndex = index; // Aggiorna l'indice del concetto selezionato
          updateKeywordDisplay(); // Aggiorna la visualizzazione
        });
      });
    }
  }

  // Aggiorna la visualizzazione del concetto selezionato
  function updateKeywordDisplay() {
    const currentPage = pages[currentPageIndex];
    if (currentPage && data.pages[currentPageIndex - 1]?.type === "standard") {
      const keywordItems = currentPage.querySelectorAll(".keyword-item");
      const keywordImage = currentPage.querySelector(".keyword-image img");
      const keywordConcept = currentPage.querySelector(".keyword-image p");

      // Rimuovi la classe 'active' da tutti i concetti
      keywordItems.forEach((item) => item.classList.remove("active"));

      // Imposta il concetto corrente come attivo
      if (keywordItems[currentKeywordIndex]) {
        keywordItems[currentKeywordIndex].classList.add("active");
        keywordImage.src =
          data.pages[currentPageIndex - 1].keywords[currentKeywordIndex].image;
        keywordConcept.innerText =
          data.pages[currentPageIndex - 1].keywords[
            currentKeywordIndex
          ].concept;
      }
    }
  }

  // Navigazione tra i concetti (destra/sinistra)
  function navigateKeywords(direction) {
    const currentPage = pages[currentPageIndex];
    if (currentPage && data.pages[currentPageIndex - 1]?.type === "standard") {
      const totalKeywords = data.pages[currentPageIndex - 1].keywords.length;
      if (direction === "right") {
        currentKeywordIndex = (currentKeywordIndex + 1) % totalKeywords; // Passa al concetto successivo
      } else if (direction === "left") {
        currentKeywordIndex =
          (currentKeywordIndex - 1 + totalKeywords) % totalKeywords; // Passa al concetto precedente
      }
      updateKeywordDisplay(); // Aggiorna la visualizzazione
    }
  }

  // Navigazione tra le pagine (su/giù)
  function navigatePages(direction) {
    if (direction === "down") {
      if (currentPageIndex === pages.length - 1) return;

      currentPageIndex = (currentPageIndex + 1) % pages.length; // Passa alla pagina successiva
    } else if (direction === "up") {
      if (currentPageIndex === 0) return;

      currentPageIndex = (currentPageIndex - 1 + pages.length) % pages.length; // Passa alla pagina precedente
    }
    showPage(pages[currentPageIndex].id); // Mostra la nuova pagina
  }

  // Gestione degli eventi da tastiera
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      navigateKeywords("right"); // Passa al concetto successivo
    } else if (event.key === "ArrowUp") {
      navigateKeywords("left"); // Passa al concetto precedente
    } else if (event.key === "ArrowRight") {
      navigatePages("down"); // Passa alla pagina successiva
    } else if (event.key === "ArrowLeft") {
      navigatePages("up"); // Passa alla pagina precedente
    }
  });
  // Funzione per attivare/disattivare la modalità full screen
  function toggleFullscreen() {
    const elem = document.documentElement; // Seleziona l'elemento root (l'intera pagina)
    const icon = document.getElementById("fullscreen-icon"); // Seleziona l'icona

    if (!document.fullscreenElement) {
      // Entra in modalità full screen
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        // Per Safari
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        // Per IE/Edge
        elem.msRequestFullscreen();
      }

      // Cambia l'icona in "comprimi"
      icon.classList.remove("fa-expand");
      icon.classList.add("fa-compress");
    } else {
      // Esci dalla modalità full screen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        // Per Safari
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        // Per IE/Edge
        document.msExitFullscreen();
      }

      // Cambia l'icona in "espandi"
      icon.classList.remove("fa-compress");
      icon.classList.add("fa-expand");
    }
  }

  // Funzione per aggiornare la barra di caricamento
  function updateProgressBar() {
    let progressBar = document.getElementById("progress");
    if (currentPageIndex === 0) {
      progressBar.style.width = 0;
    } else {
      const delta = (1 / pages.length) * 100;
      const percent = (currentPageIndex / pages.length) * 100;
      progressBar.style.width = percent + delta + "%";
    }
  }

  // Aggiorna la barra di caricamento al caricamento della pagina
  updateProgressBar();

  // Aggiungi l'evento al pulsante
  document
    .getElementById("fullscreen-toggle")
    .addEventListener("click", toggleFullscreen);
  document.getElementById("logo").addEventListener("click", showHome);
});
