document.addEventListener("DOMContentLoaded", () => {
  let currentPageIndex = 0;
  let currentKeywordIndex = 0;
  let data;
  let pages = [];

  // Load JSON
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

  window.addEventListener("popstate", (event) => {
    const pageId = event.state?.pageId || "home"; // Use page ID from state or default page
    showPage(pageId);
  });

  function showRequestPage() {
    // Check if there's a hash in the URL
    const hash = window.location.hash.substring(1); // Remove "#" from hash

    // Show the page corresponding to the hash or the default page
    if (hash && document.getElementById(hash)) {
      showPage(hash);
    } else {
      showHome();
    }
  }

  // Render Home Page
  function renderHome() {
    const homeContent = document.querySelector("#home .content");

    // Set title and subtitle
    document.getElementById("home-title").innerText = data.home.title;
    document.getElementById("home-subtitle").innerText = data.home.subtitle;

    // Add actions
    const actionsContainer = document.getElementById("home-actions");
    data.home.actions.forEach((action) => {
      const button = document.createElement("button");
      button.innerText = action.text;

      button.addEventListener("click", () => {
        // Check if the link is an external URL or internal reference
        if (action.link.startsWith('http://') || action.link.startsWith('https://')) {
          // If external URL, open in new tab
          window.open(action.link, '_blank');

        } else {
          // If internal reference, navigate to page
          showPage(action.link.replace("#", ""))
        }
      });

      actionsContainer.appendChild(button);
    });
  }

  function renderPages() {
    // Add home to pages array
    const homePage = document.getElementById("home");
    pages.push(homePage);

    const pagesContainer = document.getElementById("pages");

    data.pages.forEach((page, index) => {
      const pageElement = document.createElement("div");
      pageElement.id = page.id;
      pageElement.className = "page";

      const contentDiv = document.createElement("div");
      contentDiv.className = "content";

      // Add title and subtitle
      const title = document.createElement("h1");
      title.textContent = page.title;
      contentDiv.appendChild(title);

      const subtitle = document.createElement("h2");
      subtitle.textContent = page.subtitle;
      contentDiv.appendChild(subtitle);

      if (page.type === "standard") {
        // If page is "standard" type
        const keywordContent = document.createElement("div");
        keywordContent.className = "keyword-content";

        const keywordList = document.createElement("div");
        keywordList.className = "keyword-list";

        // Loop through keywords
        page.keywords.forEach((keyword, i) => {
          const keywordItem = document.createElement("div");
          keywordItem.className = "keyword-item";
          keywordItem.dataset.index = i;
          keywordItem.textContent = keyword.name;
          keywordList.appendChild(keywordItem);
        });

        const keywordImage = document.createElement("div");
        keywordImage.className = "keyword-image";

        // Show concept and image of first keyword
        if (page.keywords.length > 0) {
          const concept = document.createElement("p");
          concept.innerHTML = page.keywords[0].concept; // Use innerHTML to interpret HTML tags
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
        // If page is "custom" type
        const customContent = document.createElement("div");
        customContent.className = "custom-content";

        const text = document.createElement("p");
        text.innerHTML = page.content.text; // Use innerHTML to interpret HTML tags
        customContent.appendChild(text);

        const image = document.createElement("img");
        image.src = page.content.image;
        image.alt = page.title;
        customContent.appendChild(image);

        contentDiv.appendChild(customContent);
      }

      // Add navigation buttons
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
      pages.push(pageElement); // Add page to array
    });

    // Add listeners to navigation buttons
    setupNavigationButtons();

    // Add Glossary to pages array
    const glossaryPage = document.getElementById("glossary");
    pages.push(glossaryPage);

    // Add Footer to pages array
    const footerPage = document.getElementById("footer");
    pages.push(footerPage);
  }

  function setupNavigationButtons() {
    const prevButtons = document.querySelectorAll(".prev-button");
    const nextButtons = document.querySelectorAll(".next-button");

    prevButtons.forEach((button) => {
      button.addEventListener("click", () => navigatePages("up")); // Previous page
    });

    nextButtons.forEach((button) => {
      button.addEventListener("click", () => navigatePages("down")); // Next page
    });
  }

  function renderGlossary() {
    document.getElementById("glossary-title").innerText = data.glossary.title;
    const glossaryList = document.getElementById("glossary-list");
    data.glossary.keywords.forEach((keyword) => {
      const li = document.createElement("li");

      // Add title (keyword)
      const title = document.createElement("h3");
      title.innerText = keyword.name;
      li.appendChild(title);

      // Add concept
      const concept = document.createElement("p");
      concept.innerText = keyword.concept;
      li.appendChild(concept);

      // Click handling
      li.addEventListener("click", () => {
        showPage(keyword.pageId); // Redirect to specific page
      });

      glossaryList.appendChild(li);
    });

    // Add actions
    const actionsContainer = document.getElementById("glossary-actions");
    data.glossary.actions.forEach((action) => {
      const button = document.createElement("button");
      button.innerText = action.text;
      button.addEventListener("click", () =>
        showPage(action.link.replace("#", ""))
      );
      actionsContainer.appendChild(button);
    });
  }

  // Render Footer
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

    // Add actions
    const actionsContainer = document.getElementById("footer-actions");
    data.footer.actions.forEach((action) => {
      const button = document.createElement("button");
      button.innerText = action.text;
      button.addEventListener("click", () =>
        showPage(action.link.replace("#", ""))
      );
      actionsContainer.appendChild(button);
    });
  }

  // Show specific page
  function showPage(pageId) {
    document
      .querySelectorAll(".page")
      .forEach((page) => page.classList.remove("active"));
    document.getElementById(pageId).classList.add("active");

    fadeInFunc(document.getElementById(pageId).querySelector(".content")); // fade in effect on content

    currentPageIndex = pages.findIndex((page) => page.id === pageId); // Update current page index

    // Reset concept index only if page is "standard" type
    if (data.pages[currentPageIndex - 1]?.type === "standard") {
      currentKeywordIndex = 0;
      updateKeywordDisplay(); // Update concept display
      setupKeywordClickListeners(); // Set up click listeners
    }

    document.getElementById("logo").style.visibility =
      currentPageIndex === 0 ? "hidden" : "visible";

    // Update URL with page ID
    history.pushState({ pageId }, `Page ${pageId}`, `#${pageId}`);

    updateProgressBar();
  }

  function showHome() {
    showPage("home");
  }

  // Set up click listeners for keywords
  function setupKeywordClickListeners() {
    const currentPage = pages[currentPageIndex];
    if (currentPage && data.pages[currentPageIndex - 1]?.type === "standard") {
      const keywordItems = currentPage.querySelectorAll(".keyword-item");
      keywordItems.forEach((item, index) => {
        item.addEventListener("click", () => {
          currentKeywordIndex = index; // Update selected concept index
          updateKeywordDisplay(); // Update display
        });
      });
    }
  }

  // Update selected concept display
  function updateKeywordDisplay() {
    const currentPage = pages[currentPageIndex];
    if (currentPage && data.pages[currentPageIndex - 1]?.type === "standard") {
      const keywordItems = currentPage.querySelectorAll(".keyword-item");
      const keywordImage = currentPage.querySelector(".keyword-image img");
      const keywordConcept = currentPage.querySelector(".keyword-image p");

      // Remove 'active' class from all concepts
      keywordItems.forEach((item) => item.classList.remove("active"));

      // Set current concept as active
      if (keywordItems[currentKeywordIndex]) {
        keywordItems[currentKeywordIndex].classList.add("active");
        keywordImage.src =
          data.pages[currentPageIndex - 1].keywords[currentKeywordIndex].image;
        keywordImage.onload = function () {
          fadeInFunc(keywordImage);
          fadeInFunc(keywordConcept);
          keywordConcept.innerText =
            data.pages[currentPageIndex - 1].keywords[
              currentKeywordIndex
            ].concept;
        };
      }
    }
  }

  // Navigate between concepts (right/left)
  function navigateKeywords(direction) {
    const currentPage = pages[currentPageIndex];
    if (currentPage && data.pages[currentPageIndex - 1]?.type === "standard") {
      const totalKeywords = data.pages[currentPageIndex - 1].keywords.length;
      if (direction === "right") {
        currentKeywordIndex = (currentKeywordIndex + 1) % totalKeywords; // Go to next concept
      } else if (direction === "left") {
        currentKeywordIndex =
          (currentKeywordIndex - 1 + totalKeywords) % totalKeywords; // Go to previous concept
      }
      updateKeywordDisplay(); // Update display
    }
  }

  // Navigate between pages (up/down)
  function navigatePages(direction) {
    if (direction === "down") {
      if (currentPageIndex === pages.length - 1) return;

      currentPageIndex = (currentPageIndex + 1) % pages.length; // Go to next page
    } else if (direction === "up") {
      if (currentPageIndex === 0) return;

      currentPageIndex = (currentPageIndex - 1 + pages.length) % pages.length; // Go to previous page
    }
    showPage(pages[currentPageIndex].id); // Show new page
  }

  // Keyboard event handling
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      navigateKeywords("right"); // Go to next concept
    } else if (event.key === "ArrowUp") {
      navigateKeywords("left"); // Go to previous concept
    } else if (event.key === "ArrowRight") {
      navigatePages("down"); // Go to next page
    } else if (event.key === "ArrowLeft") {
      navigatePages("up"); // Go to previous page
    }
  });

  // Toggle fullscreen mode
  function toggleFullscreen() {
    const elem = document.documentElement; // Select root element (entire page)
    const icon = document.getElementById("fullscreen-icon"); // Select icon

    if (!document.fullscreenElement) {
      // Enter fullscreen mode
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        // For Safari
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        // For IE/Edge
        elem.msRequestFullscreen();
      }

      // Change icon to "compress"
      icon.classList.remove("fa-expand");
      icon.classList.add("fa-compress");
    } else {
      // Exit fullscreen mode
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        // For Safari
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        // For IE/Edge
        document.msExitFullscreen();
      }

      // Change icon to "expand"
      icon.classList.remove("fa-compress");
      icon.classList.add("fa-expand");
    }
  }

  // Update progress bar
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

  // Update progress bar on page load
  updateProgressBar();

  function fadeInFunc(el) {
    el.style.opacity = 0;
    var tick = function () {
      el.style.opacity = +el.style.opacity + 0.05;
      if (+el.style.opacity < 1) {
        (window.requestAnimationFrame && requestAnimationFrame(tick)) ||
          setTimeout(tick, 16);
      }
    };
    tick();
  }

  // Add event to button
  document
    .getElementById("fullscreen-toggle")
    .addEventListener("click", toggleFullscreen);
  document.getElementById("logo").addEventListener("click", showHome);
});
