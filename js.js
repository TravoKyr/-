// Код JavaScript
        document.addEventListener('DOMContentLoaded', function() {
            // Корзина
            let cart = [];
            const cartCount = document.getElementById('cart-count');
            const cartItems = document.getElementById('cart-items');
            const cartTotalPrice = document.getElementById('cart-total-price');
            const cartModal = document.getElementById('cart-modal');
            const cartIcon = document.getElementById('cart-icon');
            const closeModal = document.querySelector('.close');
            const checkoutButton = document.getElementById('checkout-button');
            
            // Функция обновления корзины
            function updateCart() {
                // Обновляем счетчик
                cartCount.textContent = cart.length;
                
                // Обновляем список товаров
                cartItems.innerHTML = '';
                let total = 0;
                
                cart.forEach((item, index) => {
                    total += item.price;
                    
                    const cartItem = document.createElement('div');
                    cartItem.className = 'cart-item';
                    cartItem.innerHTML = `
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <p>${item.price} ₽</p>
                        </div>
                        <div class="cart-item-actions">
                            <button class="remove-from-cart" data-index="${index}">Удалить</button>
                        </div>
                    `;
                    cartItems.appendChild(cartItem);
                });
                
                // Обновляем общую стоимость
                cartTotalPrice.textContent = total;
                
                // Добавляем обработчики для кнопок удаления
                document.querySelectorAll('.remove-from-cart').forEach(button => {
                    button.addEventListener('click', function() {
                        const index = parseInt(this.getAttribute('data-index'));
                        cart.splice(index, 1);
                        updateCart();
                    });
                });
            }
            
            // Функция создания формы для оформления заказа
            function createOrderForm() {
                const formHTML = `
                    <div id="order-form">
                        <h3>Данные для доставки</h3>
                        <form id="customer-info-form">
                            <div class="form-group">
                                <input type="text" placeholder="Ваше имя" id="customer-name" required>
                            </div>
                            <div class="form-group">
                                <input type="text" placeholder="Город" id="customer-city" required>
                            </div>
                            <div class="form-group">
                                <input type="email" placeholder="Электронная почта" id="customer-email" required>
                            </div>
                            <div class="form-group">
                                <textarea placeholder="Адрес доставки (улица, дом, квартира)" id="customer-address" rows="3" required></textarea>
                            </div>
                            <div class="form-group">
                                <textarea placeholder="Комментарий к заказу (необязательно)" id="customer-comment" rows="2"></textarea>
                            </div>
                            <div class="form-buttons">
                                <button type="button" id="cancel-order">Отмена</button>
                                <button type="submit" id="submit-order">Подтвердить заказ</button>
                            </div>
                        </form>
                    </div>
                `;
                
                return formHTML;
            }
            
            // Функция оформления заказа
            function processOrder() {
                if (cart.length === 0) {
                    alert('Ваша корзина пуста!');
                    return;
                }
                
                // Скрываем текущее содержимое корзины
                document.querySelector('.cart-items').style.display = 'none';
                document.querySelector('.cart-total').style.display = 'none';
                checkoutButton.style.display = 'none';
                
                // Добавляем форму для оформления заказа
                const orderFormHTML = createOrderForm();
                cartItems.insertAdjacentHTML('afterend', orderFormHTML);
                
                // Обработка отправки формы
                document.getElementById('customer-info-form').addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    const customerData = {
                        name: document.getElementById('customer-name').value,
                        city: document.getElementById('customer-city').value,
                        email: document.getElementById('customer-email').value,
                        address: document.getElementById('customer-address').value,
                        comment: document.getElementById('customer-comment').value,
                        cart: cart,
                        total: cart.reduce((sum, item) => sum + item.price, 0),
                        orderDate: new Date().toLocaleString('ru-RU')
                    };
                    
                    // В реальном приложении здесь был бы AJAX запрос на сервер
                    console.log('Данные заказа:', customerData);
                    
                    // Показываем подтверждение
                    showOrderConfirmation(customerData);
                });
                
                // Обработка отмены
                document.getElementById('cancel-order').addEventListener('click', function() {
                    // Возвращаем корзину в исходное состояние
                    document.getElementById('order-form').remove();
                    document.querySelector('.cart-items').style.display = 'block';
                    document.querySelector('.cart-total').style.display = 'block';
                    checkoutButton.style.display = 'block';
                });
            }
            
            // Функция показа подтверждения заказа
            function showOrderConfirmation(customerData) {
                // Удаляем форму
                document.getElementById('order-form').remove();
                
                // Показываем подтверждение
                const confirmationHTML = `
                    <div id="order-confirmation">
                        <h3>Заказ оформлен!</h3>
                        <div class="order-details">
                            <p><strong>Номер заказа:</strong> #${Math.floor(Math.random() * 10000)}</p>
                            <p><strong>Имя:</strong> ${customerData.name}</p>
                            <p><strong>Город:</strong> ${customerData.city}</p>
                            <p><strong>Email:</strong> ${customerData.email}</p>
                            <p><strong>Адрес доставки:</strong> ${customerData.address}</p>
                            ${customerData.comment ? `<p><strong>Комментарий:</strong> ${customerData.comment}</p>` : ''}
                            <p><strong>Сумма заказа:</strong> ${customerData.total} ₽</p>
                            <p><strong>Дата заказа:</strong> ${customerData.orderDate}</p>
                        </div>
                        <p>Информация о заказе отправлена на вашу электронную почту.</p>
                        <p>С вами свяжутся для уточнения деталей доставки.</p>
                        <button id="close-confirmation" class="button">Закрыть</button>
                    </div>
                `;
                
                cartItems.insertAdjacentHTML('afterend', confirmationHTML);
                
                // Очищаем корзину
                cart = [];
                updateCart();
                
                // Сохраняем заказ в localStorage (в реальном приложении отправляем на сервер)
                saveOrderToHistory(customerData);
                
                // Обработка закрытия подтверждения
                document.getElementById('close-confirmation').addEventListener('click', function() {
                    document.getElementById('order-confirmation').remove();
                    cartModal.style.display = 'none';
                    
                    // Возвращаем корзину в исходное состояние
                    document.querySelector('.cart-items').style.display = 'block';
                    document.querySelector('.cart-total').style.display = 'block';
                    checkoutButton.style.display = 'block';
                });
            }
            
            // Функция сохранения истории заказов
            function saveOrderToHistory(orderData) {
                let orderHistory = JSON.parse(localStorage.getItem('sneakers74-order-history')) || [];
                orderHistory.push(orderData);
                localStorage.setItem('sneakers74-order-history', JSON.stringify(orderHistory));
            }
            
            // Добавление товара в корзину
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    const name = this.getAttribute('data-name');
                    const price = parseInt(this.getAttribute('data-price'));
                    
                    cart.push({ id, name, price });
                    updateCart();
                    
                    // Визуальная обратная связь
                    this.textContent = 'Добавлено!';
                    this.style.backgroundColor = '#4CAF50';
                    setTimeout(() => {
                        this.textContent = 'Добавить в корзину';
                        this.style.backgroundColor = '';
                    }, 1000);
                });
            });
            
            // Открытие модального окна корзины
            cartIcon.addEventListener('click', function() {
                cartModal.style.display = 'block';
            });
            
            // Закрытие модального окна
            closeModal.addEventListener('click', function() {
                cartModal.style.display = 'none';
            });
            
            // Закрытие модального окна при клике вне его
            window.addEventListener('click', function(event) {
                if (event.target === cartModal) {
                    cartModal.style.display = 'none';
                }
            });
            
            // Оформление заказа
            checkoutButton.addEventListener('click', processOrder);
            
            // Навигация по странице
            document.querySelectorAll('nav a').forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href').substring(1);
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            });
            
            // Обработка формы контактов
            document.getElementById('contact-form').addEventListener('submit', function(e) {
                e.preventDefault();
                alert('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.');
                this.reset();
            });
            
            // Обработка формы подписки
            document.querySelector('.footer-form').addEventListener('submit', function(e) {
                e.preventDefault();
                alert('Спасибо за подписку!');
                this.reset();
            });
            
            // Инициализация корзины
            updateCart();
            
            // Сохранение корзины в localStorage
            function saveCart() {
                localStorage.setItem('sneakers74-cart', JSON.stringify(cart));
            }
            
            function loadCart() {
                const savedCart = localStorage.getItem('sneakers74-cart');
                if (savedCart) {
                    cart = JSON.parse(savedCart);
                    updateCart();
                }
            }
            
            // Загружаем корзину при загрузке страницы
            loadCart();
            
            // Сохраняем корзину при изменении
            window.addEventListener('beforeunload', saveCart);
        });