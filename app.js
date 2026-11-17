const products = [
  { slug: 'wave-form', name: 'Wave Form', notes: 'Vanilla cream ale', description: 'A warm brewery collaboration with creamy vanilla character. Exact product copy can replace this short placeholder description.' },
  { slug: 'international-man-of-leisure', name: 'International Man of Leisure', notes: 'Mahogany + teakwood', description: 'Polished woods and a quietly confident room. A candle for leather chairs, low light, and plans that can wait.' },
  { slug: 'stick-season', name: 'Stick Season', notes: 'Full scent notes coming soon', description: 'Late autumn, rain on the window, and one more song before heading home. Final fragrance notes can be added here.' },
  { slug: 'white-pumpkin', name: 'White Pumpkin', notes: 'Seasonal blend · full notes coming soon', description: 'A softer take on fall: warm, creamy, and deliberately free of pumpkin-patch crowds.' },
  { slug: 'apple-orchard', name: 'Apple Orchard', notes: 'Orchard apple · full notes coming soon', description: 'The bright familiarity of apple picking in fall, translated into a warm amber jar.' },
  { slug: 'coffee-cake', name: 'Coffee Cake', notes: 'Coffee cake · full notes coming soon', description: 'A slow morning, a warm kitchen, and the good part of waking up early.' }
];

const productGrid = document.querySelector('#productGrid');
const quickView = document.querySelector('#quickView');
const quickImage = document.querySelector('#quickImage');
const quickThumbs = document.querySelector('#quickThumbs');
const quickTitle = document.querySelector('#quickViewTitle');
const quickNotes = document.querySelector('#quickNotes');
const quickDescription = document.querySelector('#quickDescription');
const addButton = document.querySelector('.add-to-cart');
let currentProduct = null;
let cart = [];

const imagePath = (slug, number, name) => `assets/products/${slug}/0${number}-${name}.png`;
const galleryFor = slug => [
  imagePath(slug, 1, 'packshot'),
  imagePath(slug, 2, 'lit-lifestyle'),
  imagePath(slug, 3, 'wick-detail'),
  imagePath(slug, 4, 'label-angle'),
  imagePath(slug, 5, 'scent-story')
];

products.forEach(product => {
  const card = document.createElement('article');
  card.className = 'product-card';
  card.tabIndex = 0;
  card.setAttribute('aria-label', `View ${product.name}`);
  card.innerHTML = `
    <div class="product-image">
      <img class="base-image" src="${imagePath(product.slug, 1, 'packshot')}" alt="${product.name} candle in an amber jar">
      <img class="hover-image" src="${imagePath(product.slug, 5, 'scent-story')}" alt="" aria-hidden="true" loading="lazy">
    </div>
    <div class="product-meta">
      <span class="product-name">${product.name}</span>
      <span class="product-price">$15</span>
      <p class="product-notes">${product.notes}</p>
    </div>
    <button class="quick-button" type="button">Quick view</button>`;
  const open = () => openProduct(product);
  card.addEventListener('click', open);
  card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); } });
  productGrid.appendChild(card);
});

function openProduct(product) {
  currentProduct = product;
  quickTitle.textContent = product.name;
  quickNotes.textContent = product.notes;
  quickDescription.textContent = product.description;
  const gallery = galleryFor(product.slug);
  quickImage.src = gallery[0];
  quickImage.alt = `${product.name} candle product photograph`;
  quickThumbs.innerHTML = '';
  gallery.forEach((src, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = index === 0 ? 'active' : '';
    button.setAttribute('aria-label', `Show image ${index + 1} of ${product.name}`);
    button.innerHTML = `<img src="${src}" alt="" loading="lazy">`;
    button.addEventListener('click', () => {
      quickImage.src = src;
      [...quickThumbs.children].forEach(child => child.classList.remove('active'));
      button.classList.add('active');
    });
    quickThumbs.appendChild(button);
  });
  quickView.showModal();
  document.body.classList.add('locked');
}

document.querySelector('.dialog-close').addEventListener('click', () => quickView.close());
quickView.addEventListener('click', event => {
  if (event.target === quickView) quickView.close();
});
quickView.addEventListener('close', () => document.body.classList.remove('locked'));

addButton.addEventListener('click', () => {
  if (!currentProduct) return;
  cart.push(currentProduct);
  updateCart();
  quickView.close();
  openCart();
});

const cartDrawer = document.querySelector('#cartDrawer');
const pageOverlay = document.querySelector('#pageOverlay');
const cartItems = document.querySelector('#cartItems');

function openCart() {
  cartDrawer.classList.add('open');
  cartDrawer.setAttribute('aria-hidden', 'false');
  document.querySelector('.cart-button').setAttribute('aria-expanded', 'true');
  pageOverlay.hidden = false;
  document.body.classList.add('locked');
}
function closeCart() {
  cartDrawer.classList.remove('open');
  cartDrawer.setAttribute('aria-hidden', 'true');
  document.querySelector('.cart-button').setAttribute('aria-expanded', 'false');
  pageOverlay.hidden = true;
  document.body.classList.remove('locked');
}
function updateCart() {
  document.querySelector('.cart-count').textContent = cart.length;
  document.querySelector('#cartSubtotal').textContent = `$${(cart.length * 15).toFixed(2)}`;
  if (!cart.length) {
    cartItems.innerHTML = '<p class="empty-cart">Your bag is currently empty.</p>';
    return;
  }
  cartItems.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <img src="${imagePath(item.slug, 1, 'packshot')}" alt="">
      <div><strong>${item.name}</strong><span>$15.00</span></div>
      <button class="cart-remove" type="button" data-index="${index}">Remove</button>
    </div>`).join('');
  cartItems.querySelectorAll('.cart-remove').forEach(button => button.addEventListener('click', () => {
    cart.splice(Number(button.dataset.index), 1);
    updateCart();
  }));
}

document.querySelector('.cart-button').addEventListener('click', openCart);
document.querySelector('.cart-close').addEventListener('click', closeCart);
pageOverlay.addEventListener('click', closeCart);

const heroVideo = document.querySelector('#heroVideo');
const heroContent = document.querySelector('#heroContent');
const siteHeader = document.querySelector('#siteHeader');
const heroSkip = document.querySelector('#heroSkip');
const heroReplay = document.querySelector('#heroReplay');
let revealed = false;

function revealHero() {
  if (revealed) return;
  revealed = true;
  heroContent.classList.add('revealed');
  siteHeader.classList.add('revealed');
  heroSkip.hidden = true;
  heroReplay.hidden = false;
}

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  revealHero();
} else {
  heroVideo.addEventListener('timeupdate', () => { if (heroVideo.currentTime > 3.7) revealHero(); });
  heroVideo.addEventListener('ended', revealHero);
  heroVideo.addEventListener('error', revealHero);
  window.setTimeout(revealHero, 6200);
}

heroSkip.addEventListener('click', () => { heroVideo.pause(); revealHero(); });
heroReplay.addEventListener('click', () => {
  revealed = false;
  heroContent.classList.remove('revealed');
  siteHeader.classList.remove('revealed');
  heroReplay.hidden = true;
  heroSkip.hidden = false;
  heroVideo.currentTime = 0;
  heroVideo.play().catch(revealHero);
});

window.addEventListener('scroll', () => siteHeader.classList.toggle('scrolled', window.scrollY > window.innerHeight * .75), { passive: true });

const menuButton = document.querySelector('.menu-button');
const mobileNav = document.querySelector('#mobileNav');
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  mobileNav.hidden = open;
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  mobileNav.hidden = true;
}));

document.querySelector('.newsletter-form').addEventListener('submit', event => {
  event.preventDefault();
  event.currentTarget.reset();
  document.querySelector('.form-note').textContent = 'You’re on the list. This signup is illustrative in the rendering.';
});
