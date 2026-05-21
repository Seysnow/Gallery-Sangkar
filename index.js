const header = document.querySelector("header#header");
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("header#header ul.menu-horizontal li a");

// Add or remove the 'header-scrolled' class based on scroll position
document.addEventListener("scroll", () => {
  if (window.scrollY > 75) {
    header.classList.add("header-scrolled");
  } else {
    header.classList.remove("header-scrolled");
  }
});

// Create the IntersectionObserver
const options = {
  root: null,
  threshold: 0.2,
};

let currentSectionId = "";

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const sectionId = entry.target.getAttribute("id");

      if (currentSectionId !== sectionId) {
        currentSectionId = sectionId;

        navLinks.forEach((link) => link.classList.remove("text-primary"));

        const activeLink = document.querySelector(`header#header ul.menu-horizontal li a[href="/#${sectionId}"]`);

        if (activeLink) {
          activeLink.classList.add("text-primary");
        }
      }
    }
  });
}, options);

sections.forEach((section) => observer.observe(section));

// Product card UX: color switcher + WhatsApp message.
// To edit products, open index.html and search for section id="produk".
// To change the WhatsApp number, edit the number inside each href="https://wa.me/..." button.
function setupProductCard(card) {
  if (!card) return;

  const imageElement = card.querySelector("figure img");
  const colorOptions = card.querySelectorAll("ul li");
  const productName = card.querySelector('.card-body > div:last-child h3')?.textContent?.trim() || 'Produk Gallery Sangkar Indonesia';
  const price = card.querySelector('.card-body > div:last-child h2')?.textContent?.trim() || '';
  const whatsappLink = card.querySelector('a[href*="wa.me"]');
  const basePhone = (whatsappLink?.href.match(/wa\.me\/(\d+)/) || [])[1] || '6282142853691';

  function updateWhatsApp(colorName) {
    if (!whatsappLink) return;
    const message = `Halo Gallery Sangkar Indonesia, saya ingin membeli ${productName}${colorName ? ' warna ' + colorName : ''}${price ? ' dengan harga ' + price : ''}. Apakah masih tersedia?`;
    whatsappLink.href = `https://wa.me/${basePhone}?text=${encodeURIComponent(message)}`;
  }

  colorOptions.forEach((option, index) => {
    const button = option.querySelector('button');
    const label = button?.querySelector('span')?.textContent?.trim() || '';
    const imageClass = Array.from(option.classList).find((className) => className.startsWith('sangkar-'));

    if (index === 0) {
      option.classList.add('is-active');
      updateWhatsApp(label);
    }

    option.addEventListener('click', () => {
      if (imageClass && imageElement) {
        imageElement.src = `./assets/images/${imageClass}.jpg`;
      }
      colorOptions.forEach((item) => item.classList.remove('is-active'));
      option.classList.add('is-active');
      updateWhatsApp(label);
    });
  });
}

document.querySelectorAll('#produk .card').forEach(setupProductCard);
