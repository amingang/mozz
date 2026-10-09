// اطلاعات سفر در مرورگر ذخیره می‌شوند تا بعد از بستن صفحه هم باقی بمانند.
function loadArray(key, fallback) {
    try {
        const savedValue = localStorage.getItem(key);
        if (!savedValue) return fallback;

        const parsedValue = JSON.parse(savedValue);
        return Array.isArray(parsedValue) ? parsedValue : fallback;
    } catch (error) {
        return fallback;
    }
}

let members = loadArray('trip_members', ['ارسلان', 'شهاب', 'امین']);
let items = loadArray('trip_items', [
    { name: 'چادر مسافرتی', ready: false },
    { name: 'کیسه‌خواب', ready: true }
]);
let expenses = loadArray('trip_expenses', [
    { title: 'رفت و برگشت', amount: 5000000, category: 'حمل‌ونقل', payer: 'علی' },
    { title: 'هتل', amount: 3000000, category: 'اقامت', payer: 'رضا' }
]);

function saveData() {
    localStorage.setItem('trip_members', JSON.stringify(members));
    localStorage.setItem('trip_items', JSON.stringify(items));
    localStorage.setItem('trip_expenses', JSON.stringify(expenses));
}

function createElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
}

function createActionButton(text, action, index, className = 'delete-button') {
    const button = createElement('button', className, text);
    button.type = 'button';
    button.dataset.action = action;
    button.dataset.index = String(index);
    return button;
}

function renderMembers() {
    const memberList = document.getElementById('member-list');
    const cardsContainer = document.getElementById('members-cards-container');
    const countText = document.getElementById('member-count-text');
    const homeCountText = document.getElementById('index-member-count');

    if (countText) {
        countText.textContent = `در این سفر ${members.length} نفر حضور دارند.`;
    }
    if (homeCountText) {
        homeCountText.textContent = `${members.length} نفر`;
    }

    if (cardsContainer) {
        cardsContainer.replaceChildren();
        members.forEach((member, index) => {
            const card = createElement('div', 'card');
            card.appendChild(createElement('h3', '', member));
            card.appendChild(createElement('p', '', index === 0 ? 'مسئول هماهنگی سفر' : 'عضو گروه'));
            cardsContainer.appendChild(card);
        });
    }

    if (memberList) {
        memberList.replaceChildren();
        members.forEach((member, index) => {
            const listItem = createElement('li', 'list-entry');
            listItem.appendChild(createElement('span', '', member));
            listItem.appendChild(createActionButton('حذف', 'remove-member', index));
            memberList.appendChild(listItem);
        });
    }
}

function handleAddMember() {
    const input = document.getElementById('member-input');
    if (!input) return;

    const name = input.value.trim();
    if (!name) {
        alert('لطفاً نام عضو را وارد کنید.');
        input.focus();
        return;
    }

    members.push(name);
    saveData();
    renderMembers();
    renderExpenses();
    input.value = '';
    input.focus();
}

function removeMember(index) {
    if (index < 0 || index >= members.length) return;
    members.splice(index, 1);
    saveData();
    renderMembers();
    renderExpenses();
}

function renderItems() {
    const itemList = document.getElementById('item-list');
    const cardsContainer = document.getElementById('items-cards-container');
    const stats = document.getElementById('item-stats');

    let readyCount = 0;
    items.forEach(item => {
        if (item.ready) readyCount++;
    });

    if (itemList) {
        itemList.replaceChildren();
        items.forEach((item, index) => {
            const listItem = createElement('li', 'list-entry item-entry');
            const label = createElement('label', 'item-label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = Boolean(item.ready);
            checkbox.dataset.action = 'toggle-item';
            checkbox.dataset.index = String(index);
            const name = createElement('span', item.ready ? 'item-name is-ready' : 'item-name', item.name);

            label.append(checkbox, name);
            listItem.append(label, createActionButton('حذف', 'remove-item', index));
            itemList.appendChild(listItem);
        });
    }

    if (cardsContainer) {
        cardsContainer.replaceChildren();
        items.forEach(item => {
            const card = createElement('div', 'card');
            card.appendChild(createElement('h3', '', item.name));
            card.appendChild(createElement('p', '', item.ready ? 'وضعیت: ✅ آماده شده' : 'وضعیت: ⏳ در حال آماده‌سازی'));
            cardsContainer.appendChild(card);
        });
    }

    if (stats) {
        const percentage = items.length > 0 ? Math.round((readyCount / items.length) * 100) : 0;
        stats.textContent = `وضعیت آمادگی: ${readyCount} از ${items.length} وسیله (${percentage}٪ آماده شده)`;
    }
}

function handleAddItem() {
    const input = document.getElementById('item-input');
    if (!input) return;

    const name = input.value.trim();
    if (!name) {
        alert('لطفاً نام وسیله را وارد کنید.');
        input.focus();
        return;
    }

    items.push({ name, ready: false });
    saveData();
    renderItems();
    input.value = '';
    input.focus();
}

function toggleItem(index) {
    if (index < 0 || index >= items.length) return;
    items[index].ready = !items[index].ready;
    saveData();
    renderItems();
}

function removeItem(index) {
    if (index < 0 || index >= items.length) return;
    items.splice(index, 1);
    saveData();
    renderItems();
}

function renderExpenses() {
    const expenseList = document.getElementById('expense-list');
    const cardsContainer = document.getElementById('expenses-cards-container');
    const totalElement = document.getElementById('total-expense');
    const perPersonElement = document.getElementById('per-person-expense');

    let totalSum = 0;
    expenses.forEach(expense => {
        totalSum += Number(expense.amount) || 0;
    });

    if (cardsContainer) {
        cardsContainer.replaceChildren();
        expenses.forEach(expense => {
            const card = createElement('div', 'card');
            card.appendChild(createElement('h3', '', expense.title));
            card.appendChild(createElement('p', '', `${(Number(expense.amount) || 0).toLocaleString('fa-IR')} تومان`));
            cardsContainer.appendChild(card);
        });
    }

    if (expenseList) {
        expenseList.replaceChildren();
        expenses.forEach((expense, index) => {
            const listItem = createElement('li', 'list-entry expense-entry');
            const topRow = createElement('div', 'expense-entry-top');
            const amount = (Number(expense.amount) || 0).toLocaleString('fa-IR');
            topRow.appendChild(createElement('strong', '', `${expense.title} (${amount} تومان)`));
            topRow.appendChild(createActionButton('حذف', 'remove-expense', index));

            const details = createElement(
                'div',
                'expense-details',
                `پرداخت‌کننده: ${expense.payer || 'نامشخص'} | دسته‌بندی: ${expense.category || 'عمومی'}`
            );

            listItem.append(topRow, details);
            expenseList.appendChild(listItem);
        });
    }

    if (totalElement) {
        totalElement.textContent = `مجموع هزینه‌ها: ${totalSum.toLocaleString('fa-IR')} تومان`;
    }
    if (perPersonElement) {
        const average = members.length > 0 ? Math.round(totalSum / members.length) : 0;
        perPersonElement.textContent = `سهم متوسط هر نفر: ${average.toLocaleString('fa-IR')} تومان`;
    }
}

function handleAddExpense() {
    const titleInput = document.getElementById('exp-title');
    const amountInput = document.getElementById('exp-amount');
    const categoryInput = document.getElementById('exp-category');
    const payerInput = document.getElementById('exp-payer');

    if (!titleInput || !amountInput) return;

    const title = titleInput.value.trim();
    const amount = Number(amountInput.value);

    if (!title || !Number.isFinite(amount) || amount <= 0) {
        alert('لطفاً عنوان و مبلغ معتبر برای هزینه وارد کنید.');
        return;
    }

    expenses.push({
        title,
        amount,
        category: categoryInput && categoryInput.value.trim() ? categoryInput.value.trim() : 'عمومی',
        payer: payerInput && payerInput.value.trim() ? payerInput.value.trim() : 'نامشخص'
    });

    saveData();
    renderExpenses();
    titleInput.value = '';
    amountInput.value = '';
    if (categoryInput) categoryInput.value = '';
    if (payerInput) payerInput.value = '';
    titleInput.focus();
}

function removeExpense(index) {
    if (index < 0 || index >= expenses.length) return;
    expenses.splice(index, 1);
    saveData();
    renderExpenses();
}

// اتصال رویدادها در JavaScript؛ دیگر به onclick داخل HTML نیازی نیست.
document.addEventListener('click', event => {
    const button = event.target.closest('[data-action]');
    if (!button) return;

    const action = button.dataset.action;
    const index = Number(button.dataset.index);

    switch (action) {
        case 'add-member':
            handleAddMember();
            break;
        case 'remove-member':
            removeMember(index);
            break;
        case 'add-item':
            handleAddItem();
            break;
        case 'remove-item':
            removeItem(index);
            break;
        case 'add-expense':
            handleAddExpense();
            break;
        case 'remove-expense':
            removeExpense(index);
            break;
        default:
            break;
    }
});

document.addEventListener('change', event => {
    const checkbox = event.target.closest('[data-action="toggle-item"]');
    if (!checkbox) return;
    toggleItem(Number(checkbox.dataset.index));
});

document.addEventListener('keydown', event => {
    if (event.key !== 'Enter') return;

    if (event.target.id === 'member-input') handleAddMember();
    if (event.target.id === 'item-input') handleAddItem();
    if (event.target.id === 'exp-title' || event.target.id === 'exp-amount') {
        handleAddExpense();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    renderMembers();
    renderItems();
    renderExpenses();
});
