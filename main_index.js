  const burgerBtn = document.getElementById('burgerBtn');
  const menuOverlay = document.getElementById('menuOverlay');

  burgerBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // чтобы клик не ушёл на body
    menuOverlay.classList.toggle('open');
  });

  // Закрывать меню при клике на любую ссылку в нём
  menuOverlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuOverlay.classList.remove('open');
    });
  });
  document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".product-card");
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(window.innerWidth <= 768 ? "animate-left" : "animate-up");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    cards.forEach(card => observer.observe(card));
  });

  const closeMenuBtn = document.getElementById('closeMenuBtn');
  closeMenuBtn.addEventListener('click', () => {
    menuOverlay.classList.remove('open');
  });

  function slideImage(btn, direction) {
  const wrapper = btn.closest('.slider-wrapper');
  const images = wrapper.querySelectorAll('img');
  let current = Array.from(images).findIndex(img => img.classList.contains('active'));
  if (current === -1) return;
  images[current].classList.remove('active');
  let next = (current + direction + images.length) % images.length;
  images[next].classList.add('active');
}

const header = document.querySelector('header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

  // Современная корзина
  const cart = [];
  const cartPanel = document.getElementById('cartPanel');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartCount = document.getElementById('cartCount');
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  const closeCartBtn = document.getElementById('closeCartBtn');

  function openCart() {
  cartPanel.classList.add('open');
  cartOverlay.classList.add('visible');
  }

  function closeCart() {
  cartPanel.classList.remove('open');
  cartOverlay.classList.remove('visible');
  }

  document.getElementById('cartIcon').addEventListener('click', openCart);
  closeCartBtn.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  function saveCart() {
  localStorage.setItem('nightwood_cart', JSON.stringify(cart));
  }
  function loadCart() {
  const saved = localStorage.getItem('nightwood_cart');
  if (saved) {
    const parsed = JSON.parse(saved);
    cart.length = 0;
    parsed.forEach(item => cart.push(item));
    updateCartUI();
  }
  }
  loadCart();

  document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', () => {
    const productCard = button.closest('.product-card');
    const title = productCard.querySelector('h3').innerText;
    const priceText = productCard.querySelector('.product-footer div').innerText.replace(/[^\d\.]/g, '');
    const price = parseFloat(priceText);
    const image = productCard.querySelector('img').src;

    const existing = cart.find(item => item.title === title);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ title, price, image, qty: 1 });
    }

    updateCartUI();
  });
  });

  function updateCartUI() {
  cartItems.innerHTML = '';
  let total = 0;
  cart.forEach((item, index) => {
    total += item.price * item.qty;
    const li = document.createElement('li');
    li.innerHTML = 
      '<img src="' + item.image + '" alt="">' +
      '<div class="item-info">' +
        '<h4>' + item.title + '</h4>' +
        '<div class="price">€' + (item.price * item.qty).toFixed(2) + '</div>' +
        '<div class="qty-controls">' +
          '<button onclick="changeQty(' + index + ', -1)">−</button>' +
          '<span>' + item.qty + '</span>' +
          '<button onclick="changeQty(' + index + ', 1)">+</button>' +
        '</div>' +
      '</div>' +
      '<button onclick="removeItem(' + index + ')" class="remove-item-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>';
    cartItems.appendChild(li);
  });
  cartTotal.innerText = total.toFixed(2);
  cartCount.innerText = cart.reduce((sum, item) => sum + item.qty, 0);
  saveCart();
  }

  function removeFromCart(title) {
  const index = cart.findIndex(item => item.title === title);
  if (index > -1) {
    cart[index].qty -= 1;
    if (cart[index].qty <= 0) {
      cart.splice(index, 1);
    }
    updateCartUI();
  }
  } 

  function updateCartUI() {
  cartItems.innerHTML = '';
  let total = 0;
  cart.forEach((item, index) => {
    total += item.price * item.qty;
    const li = document.createElement('li');
    li.innerHTML = 
      '<img src="' + item.image + '" alt="">' +
      '<div class="item-info">' +
        '<h4>' + item.title + '</h4>' +
        '<div class="price">€' + (item.price * item.qty).toFixed(2) + '</div>' +
        '<div class="qty-controls">' +
          '<button onclick="changeQty(' + index + ', -1)">−</button>' +
          '<span>' + item.qty + '</span>' +
          '<button onclick="changeQty(' + index + ', 1)">+</button>' +
        '</div>' +
      '</div>' +
      '<button onclick="removeItem(' + index + ')" class="remove-item-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>';
    cartItems.appendChild(li);
  });
  cartTotal.innerText = total.toFixed(2);
  cartCount.innerText = cart.reduce((sum, item) => sum + item.qty, 0);
  saveCart();
  }

  function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  updateCartUI();
  }
  function removeItem(index) {
  cart.splice(index, 1);
  updateCartUI();
  }

  // Добавляет в корзину и сразу переходит в cart.html
// Исправленный обработчик для кнопок "PIRKTI"
document.querySelectorAll('.go-to-cart').forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    const productCard = button.closest('.product-card');
    const title = productCard.querySelector('h3').innerText;
    
    // Получаем цену - сначала проверяем наличие скидки
    let priceElement = productCard.querySelector('.sale-price');
    if (!priceElement) {
      priceElement = productCard.querySelector('.product-price'); // обычная цена
    } else {
      // Если есть скидка, удаляем старую запись (если была по обычной цене)
      const savedCart = JSON.parse(localStorage.getItem('nightwood_cart')) || [];
      const existingIndex = savedCart.findIndex(item => item.title === title && !item.isSale);
      if (existingIndex !== -1) {
        savedCart.splice(existingIndex, 1);
        localStorage.setItem('nightwood_cart', JSON.stringify(savedCart));
      }
    }
    
    const priceText = priceElement.innerText.replace(/[^\d,.]/g, '').replace(',', '.');
    const price = parseFloat(priceText);
    const image = productCard.querySelector('img.active').src;
    const isSale = productCard.querySelector('.badge-sale') !== null;

    const savedCart = JSON.parse(localStorage.getItem('nightwood_cart')) || [];
    const existing = savedCart.find(item => item.title === title && item.isSale === isSale);
    
    if (existing) {
      existing.qty += 1;
    } else {
      savedCart.push({ 
        id: Date.now().toString(), 
        title, 
        price, 
        image, 
        qty: 1,
        isSale: isSale // Добавляем флаг скидки
      });
    }

    localStorage.setItem('nightwood_cart', JSON.stringify(savedCart));
    window.location.href = '/cart.html';
  });
});


// Проверяем поддержку backdrop-filter (включая -webkit- для Safari)
const hasBackdropSupport = CSS && 
                         (CSS.supports('backdrop-filter', 'blur(3px)') || 
                          CSS.supports('-webkit-backdrop-filter', 'blur(3px)'));

// Если не поддерживается — устанавливаем fallback-фон
if (!hasBackdropSupport) {
  const overlay = document.querySelector('.cart-overlay');
  if (overlay) {
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  }
}

// Исправление для мобильных устройств
document.addEventListener('DOMContentLoaded', function() {
  function fixHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  
  fixHeight();
  window.addEventListener('resize', fixHeight);
});

const upButton = document.getElementById('upButton');

function updateButton() {
  if (window.pageYOffset > 300) {
    upButton.style.opacity = '1';
  } else {
    upButton.style.opacity = '0';
  }
}

// Инициализация
updateButton();
window.addEventListener('scroll', updateButton);

// Плавный скролл
upButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});


// Исправление для мобильных устройств
  document.addEventListener('DOMContentLoaded', function() {
    function fixHeight() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    fixHeight();
    window.addEventListener('resize', fixHeight);
  });



